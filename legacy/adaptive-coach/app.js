/**
 * App state & rendering.
 * Persists to localStorage (this is a real deployed PWA, not a sandboxed
 * artifact, so browser storage is fine here - unlike in-chat artifacts).
 */

const STORAGE_KEY = 'adaptive-coach-state-v1';

const DEFAULT_MOVEMENTS = {
  'Push-ups':     { reps: 8,  sets: 3, difficultyTier: 1, category: 'push' },
  'Pull-ups':     { reps: 4,  sets: 3, difficultyTier: 1, category: 'pull' },
  'Squats':       { reps: 12, sets: 3, difficultyTier: 1, category: 'legs' },
  'Plank (secs)': { reps: 30, sets: 3, difficultyTier: 1, category: 'core' },
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through to default */ }
  }
  return {
    movements: JSON.parse(JSON.stringify(DEFAULT_MOVEMENTS)),
    history: Object.fromEntries(Object.keys(DEFAULT_MOVEMENTS).map(k => [k, []])),
    sessionLog: [], // flat list of {date} for streak calc
    lastSignal: [],
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let pendingMovement = null;

/* ---------- Streak & compliance ---------- */

function computeStreak() {
  const dates = [...new Set(state.sessionLog.map(s => s.date))].sort().reverse();
  if (dates.length === 0) return 0;
  let streak = 0;
  let cursor = new Date();
  for (const d of dates) {
    const diff = Math.round((cursor - new Date(d)) / 86400000);
    if (diff > 1) break;
    streak++;
    cursor = new Date(d);
  }
  return streak;
}

function computeWeekCompletion() {
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = state.sessionLog.filter(s => new Date(s.date).getTime() >= weekAgo);
  const uniqueDays = new Set(thisWeek.map(s => s.date)).size;
  return Math.min(100, Math.round((uniqueDays / 6) * 100)); // target 6 sessions/week
}

/* ---------- Rendering ---------- */

function render() {
  document.getElementById('streak-value').textContent = `${computeStreak()} day streak`;
  document.getElementById('stat-compliance').textContent = computeWeekCompletion() + '%';
  document.getElementById('stat-sessions').textContent = state.sessionLog.length;
  document.getElementById('stat-movements').textContent = Object.keys(state.movements).length;

  renderSignal();
  renderMovements();
  renderChart();
}

function renderSignal() {
  const feed = document.getElementById('signal-feed');
  feed.innerHTML = '';

  if (state.lastSignal.length === 0) {
    feed.innerHTML = `<div class="signal-item"><span class="signal-dot hold"></span>
      <span>Log a few sessions and the plan will start adjusting to how you're actually performing.</span></div>`;
  } else {
    state.lastSignal.forEach(sig => {
      const div = document.createElement('div');
      div.className = 'signal-item';
      div.innerHTML = `<span class="signal-dot ${sig.action}"></span>
        <span><strong>${sig.movement}:</strong> ${sig.reason}</span>`;
      feed.appendChild(div);
    });
  }

  drawSignalWave();
}

function drawSignalWave() {
  // A simple procedural waveform representing recent RPE across all sessions -
  // literally visualizing "the signal the plan is reading."
  const svg = document.getElementById('signal-wave');
  const allRecent = state.sessionLog.slice(-16);
  const width = svg.clientWidth || 300;
  const height = 48;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  if (allRecent.length < 2) {
    svg.innerHTML = `<path d="M0,${height / 2} L${width},${height / 2}" stroke-dasharray="4 4" opacity="0.3"/>`;
    return;
  }

  const rpes = allRecent.map(s => s.avgRpe || 6);
  const step = width / (rpes.length - 1);
  const points = rpes.map((rpe, i) => {
    const y = height - (rpe / 10) * height;
    return `${i * step},${y}`;
  });
  svg.innerHTML = `<path d="M${points.join(' L')}" />`;
}

function renderMovements() {
  const container = document.getElementById('movement-list');
  container.innerHTML = '';
  for (const [name, params] of Object.entries(state.movements)) {
    const row = document.createElement('div');
    row.className = 'movement-row';
    row.innerHTML = `
      <div>
        <div class="movement-name">${name}</div>
        <div class="movement-target">${params.sets} × ${params.reps} · tier ${params.difficultyTier}</div>
      </div>
      <button class="movement-log-btn" data-movement="${name}">Log</button>
    `;
    container.appendChild(row);
  }
  container.querySelectorAll('.movement-log-btn').forEach(btn => {
    btn.addEventListener('click', () => openLogModal(btn.dataset.movement));
  });
}

function renderChart() {
  const ctx = document.getElementById('progress-chart');
  if (!ctx) return;
  const allDates = [...new Set(
    Object.values(state.history).flat().map(h => h.date)
  )].sort();

  const datasets = Object.entries(state.history)
    .filter(([, hist]) => hist.length > 0)
    .map(([name, hist], i) => {
      const colorList = ['#FF4D2E', '#3ECF8E', '#FFB020', '#7DA6FF'];
      const dataMap = Object.fromEntries(hist.map(h => [h.date, h.completedReps * h.completedSets]));
      return {
        label: name,
        data: allDates.map(d => dataMap[d] ?? null),
        borderColor: colorList[i % colorList.length],
        backgroundColor: 'transparent',
        tension: 0.3,
        spanGaps: true,
      };
    });

  if (window._chart) window._chart.destroy();
  window._chart = new Chart(ctx, {
    type: 'line',
    data: { labels: allDates, datasets },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#9A9DA3', font: { family: 'JetBrains Mono', size: 10 } } } },
      scales: {
        x: { ticks: { color: '#5C6066', font: { size: 9 } }, grid: { color: '#26292E' } },
        y: { ticks: { color: '#5C6066', font: { size: 9 } }, grid: { color: '#26292E' } },
      },
    },
  });
}

/* ---------- Logging a session ---------- */

function openLogModal(movement) {
  pendingMovement = movement;
  const params = state.movements[movement];
  document.getElementById('modal-title').textContent = `Log: ${movement}`;
  document.getElementById('input-completed-reps').value = params.reps;
  document.getElementById('input-completed-sets').value = params.sets;
  document.getElementById('input-rpe').value = 6;
  document.getElementById('rpe-display').textContent = '6';
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  pendingMovement = null;
}

function submitLog() {
  if (!pendingMovement) return;
  const params = state.movements[pendingMovement];
  const completedReps = Number(document.getElementById('input-completed-reps').value);
  const completedSets = Number(document.getElementById('input-completed-sets').value);
  const rpe = Number(document.getElementById('input-rpe').value);
  const today = new Date().toISOString().slice(0, 10);

  const entry = {
    date: today,
    targetReps: params.reps,
    targetSets: params.sets,
    completedReps, completedSets, rpe,
  };
  state.history[pendingMovement].push(entry);
  state.sessionLog.push({ date: today, movement: pendingMovement, avgRpe: rpe });

  // Run the adaptive engine on this movement right now
  const result = AdaptiveEngine.evaluateMovement(state.history[pendingMovement], params);
  state.movements[pendingMovement] = result.newParams;

  state.lastSignal = state.lastSignal.filter(s => s.movement !== pendingMovement);
  state.lastSignal.unshift({ movement: pendingMovement, action: result.action, reason: result.reason });
  state.lastSignal = state.lastSignal.slice(0, 6);

  saveState(state);
  closeModal();
  render();
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', () => {
  render();
  document.getElementById('input-rpe').addEventListener('input', (e) => {
    document.getElementById('rpe-display').textContent = e.target.value;
  });
  document.getElementById('btn-save-log').addEventListener('click', submitLog);
  document.getElementById('btn-cancel-log').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  window.addEventListener('resize', drawSignalWave);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
