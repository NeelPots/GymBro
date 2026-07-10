-- Phase 2: fills in instructions/variations for the original 4 seeded
-- exercises, then adds a broad set of common calisthenics + gym exercises
-- across the same push/pull/legs/core categories. video_url stays null
-- everywhere - see README for how to add real demo videos later.

update public.exercises set
  instructions = $$1. Start in a high plank: hands under shoulders, feet together, body in a straight line from head to heels.
2. Brace your core and lower your chest toward the floor, elbows at roughly 45 degrees from your body.
3. Stop just above the floor, then press back up to full arm extension without letting your hips sag or pike.$$,
  easier_variation = 'Do them with your hands on a bench or step, or drop to your knees - same shape, less bodyweight to press.',
  harder_variation = 'Elevate your feet on a bench, add a weighted vest, or slow the lowering phase to 3-4 seconds.'
where name = 'Push-ups';

update public.exercises set
  instructions = $$1. Grip the bar slightly wider than shoulder-width, palms facing away from you.
2. Hang with arms fully extended and shoulder blades engaged (not fully relaxed/dead hang for the first rep).
3. Pull your chin above the bar by driving your elbows down toward your hips.
4. Lower back down under control to a full hang.$$,
  easier_variation = 'Use a resistance band looped over the bar for assistance, or do slow negatives (jump to the top, lower for 4-5 seconds).',
  harder_variation = 'Add a weighted vest or dip belt, or slow both the pull and the lower for tempo pull-ups.'
where name = 'Pull-ups';

update public.exercises set
  instructions = $$1. Stand with feet shoulder-width apart, toes slightly turned out.
2. Push your hips back and bend your knees to lower down, keeping your chest up and heels planted.
3. Go down until your thighs are at least parallel to the floor.
4. Drive through your heels to stand back up.$$,
  easier_variation = 'Squat to a bench or box behind you for a consistent depth cue, or reduce range of motion.',
  harder_variation = 'Hold a weight at your chest (goblet-style), add a pause at the bottom, or try single-leg (pistol) squats.'
where name = 'Squats';

update public.exercises set
  instructions = $$1. Get into a forearm plank: elbows under shoulders, forearms flat on the floor.
2. Extend your legs behind you, balancing on your toes, body in one straight line from head to heels.
3. Brace your core and squeeze your glutes - don't let your hips sag or pike up.
4. Hold, breathing steadily, for the target time.$$,
  easier_variation = 'Drop to your knees while keeping the same straight line from head to knees, or shorten the hold time.',
  harder_variation = 'Lift one foot off the ground at a time, or add a shoulder tap (alternating hands) to challenge stability.'
where name = 'Plank (secs)';

insert into public.exercises (name, category, description, default_reps, default_sets, difficulty_tier, source, moderation_status, is_public, instructions, easier_variation, harder_variation)
values
  (
    'Incline Push-ups', 'push', 'Push-up with hands elevated on a bench or step - an easier entry point into full push-ups.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Place your hands on a bench, step, or sturdy elevated surface, slightly wider than shoulder-width.
2. Walk your feet back so your body forms a straight line from head to heels.
3. Lower your chest toward the surface, then press back up to full extension.$$,
    'Use a higher surface (e.g. a wall or kitchen counter) to reduce the load further.',
    'Lower the incline (use a shorter step) until you''re ready for push-ups from the floor.'
  ),
  (
    'Diamond Push-ups', 'push', 'A close-grip push-up variation that shifts more emphasis onto the triceps.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Get into a push-up position with your hands together under your chest, thumbs and index fingers touching to form a diamond shape.
2. Keep your elbows tucked close to your body as you lower your chest toward your hands.
3. Press back up to full extension, keeping your core braced throughout.$$,
    'Drop to your knees, or widen your hand position slightly until your wrists and elbows feel comfortable.',
    'Elevate your feet on a bench, or add a slow 3-second lowering phase.'
  ),
  (
    'Pike Push-ups', 'push', 'A push-up variant done in a pike position that emphasizes the shoulders, a common stepping stone to handstand push-ups.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Start in a downward-dog-like position: hips high, hands and feet on the floor, forming an inverted V.
2. Bend your elbows to lower the top of your head toward the floor between your hands.
3. Press back up through your hands to return to the starting position.$$,
    'Elevate your hands on a step to reduce the angle, or reduce the range of motion.',
    'Elevate your feet on a bench to increase the angle toward vertical, working toward a handstand push-up.'
  ),
  (
    'Dips (Parallel Bars)', 'push', 'A compound pushing exercise on parallel bars or dip station that targets chest, shoulders, and triceps.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Grip parallel bars and support your body with arms extended, leaning slightly forward.
2. Lower yourself by bending your elbows until your shoulders are about level with your elbows.
3. Press back up to full arm extension without shrugging your shoulders toward your ears.$$,
    'Use an assisted-dip machine or a resistance band looped under your feet/knees for support.',
    'Add a weighted vest or dip belt, or add a pause at the bottom of each rep.'
  ),
  (
    'Bench Press (Barbell)', 'push', 'The classic barbell chest press performed lying on a flat bench.',
    8, 3, 1, 'system', 'approved', true,
    $$1. Lie on a flat bench with your eyes under the bar, feet flat on the floor.
2. Grip the bar slightly wider than shoulder-width and unrack it over your chest.
3. Lower the bar under control to your mid-chest, elbows at roughly 45 degrees.
4. Press the bar back up to full arm extension.$$,
    'Use lighter weight or dumbbells, which allow a more natural, forgiving path.',
    'Add a pause at the chest, slow the lowering tempo, or increase the load.'
  ),
  (
    'Overhead Press (Dumbbell)', 'push', 'A standing or seated press that builds shoulder strength and overhead stability.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand or sit holding a dumbbell in each hand at shoulder height, palms facing forward.
2. Brace your core and press both dumbbells straight overhead until your arms are fully extended.
3. Lower back down under control to shoulder height.$$,
    'Press one arm at a time, or use lighter dumbbells and a seated position for more stability.',
    'Press both dumbbells together for a strict standing press, or slow the lowering phase.'
  ),
  (
    'Incline Dumbbell Press', 'push', 'A pressing movement on an inclined bench that emphasizes the upper chest.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Set a bench to a 30-45 degree incline and lie back with a dumbbell in each hand at shoulder height.
2. Press the dumbbells up and slightly together until your arms are extended.
3. Lower back down under control to the starting position.$$,
    'Use lighter dumbbells or reduce the incline angle closer to flat.',
    'Increase the weight, add a pause at the bottom, or slow the eccentric (lowering) phase.'
  ),
  (
    'Chin-ups', 'pull', 'A pull-up variation with an underhand grip that emphasizes the biceps more than a standard pull-up.',
    6, 3, 1, 'system', 'approved', true,
    $$1. Grip the bar with palms facing you, hands shoulder-width apart.
2. Hang with arms fully extended.
3. Pull yourself up until your chin clears the bar, leading with your chest.
4. Lower back down under control to a full hang.$$,
    'Use a resistance band for assistance, or perform slow negatives from the top position.',
    'Add a weighted vest, or pause for 1-2 seconds at the top of each rep.'
  ),
  (
    'Inverted Rows', 'pull', 'A horizontal pulling exercise using a bar or rings set at waist height - a great pull-up progression.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Set a bar in a rack (or use rings) at around waist height.
2. Lie under the bar and grip it with hands shoulder-width apart, body straight, heels on the floor.
3. Pull your chest up to the bar, squeezing your shoulder blades together.
4. Lower back down under control to full arm extension.$$,
    'Raise the bar higher so your body is more upright, reducing the amount of bodyweight you pull.',
    'Lower the bar, elevate your feet on a bench, or add a weight plate on your chest.'
  ),
  (
    'Bent-Over Row (Barbell)', 'pull', 'A compound hinge-and-pull movement that builds the back and rear shoulders.',
    8, 3, 1, 'system', 'approved', true,
    $$1. Stand with feet hip-width apart, hinge at the hips until your torso is close to parallel with the floor, knees slightly bent.
2. Grip the bar just outside your knees, back flat.
3. Pull the bar up toward your lower ribs, squeezing your shoulder blades together.
4. Lower it back down under control without rounding your back.$$,
    'Use lighter weight, or perform the row supported with your chest on an incline bench.',
    'Increase the load, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'Lat Pulldown', 'pull', 'A machine exercise that mimics a pull-up, letting you scale the resistance precisely.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit at the lat pulldown machine and grip the bar wider than shoulder-width.
2. Lean back slightly and pull the bar down to your upper chest, driving your elbows down and back.
3. Control the bar back up to full arm extension without letting your shoulders shrug up.$$,
    'Reduce the weight stack, or use a closer grip to make the pull more manageable.',
    'Increase the weight, slow the return phase, or switch to a single-arm attachment.'
  ),
  (
    'Deadlift (Conventional)', 'pull', 'A foundational hip-hinge pulling movement that builds total-body strength.',
    5, 3, 1, 'system', 'approved', true,
    $$1. Stand with feet hip-width apart, the bar over your mid-foot.
2. Hinge down and grip the bar just outside your knees, back flat, chest up.
3. Drive through your heels and stand up tall, keeping the bar close to your body throughout.
4. Lower the bar back down by hinging at the hips first, then bending the knees.$$,
    'Start with lighter weight or a trap bar, and pull from blocks/a rack to reduce the range of motion.',
    'Increase the load, add a pause just off the floor, or slow the lowering phase.'
  ),
  (
    'Face Pulls (Cable)', 'pull', 'A rear-delt and upper-back isolation move that supports shoulder health.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Set a cable with a rope attachment at upper-chest to head height.
2. Grip the rope with both hands, palms facing in, and step back to create tension.
3. Pull the rope toward your face, flaring your elbows out and squeezing your shoulder blades together.
4. Return to the start under control.$$,
    'Use a lighter weight and focus purely on the squeeze at the back position.',
    'Increase the weight or add a brief pause at the fully-pulled position each rep.'
  ),
  (
    'Goblet Squat', 'legs', 'A squat variation holding a single weight at the chest - great for learning squat depth and posture.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Hold a dumbbell or kettlebell vertically against your chest with both hands.
2. Stand with feet shoulder-width apart, toes slightly out.
3. Squat down by pushing your hips back and bending your knees, keeping your chest up.
4. Drive through your heels to return to standing.$$,
    'Use a lighter weight or no weight at all, and reduce depth if needed.',
    'Increase the weight, add a 2-second pause at the bottom, or slow the descent.'
  ),
  (
    'Back Squat (Barbell)', 'legs', 'The classic barbell squat with the bar racked across the upper back.',
    5, 3, 1, 'system', 'approved', true,
    $$1. Set the bar in a rack at about shoulder height and position it across your upper back.
2. Unrack the bar, step back, and stand with feet shoulder-width apart.
3. Squat down by pushing your hips back and bending your knees until thighs are at least parallel.
4. Drive through your heels to stand back up.$$,
    'Reduce the weight, squat to a box for a consistent depth cue, or use a goblet squat instead.',
    'Increase the load, add a pause at the bottom, or slow the descent for extra time under tension.'
  ),
  (
    'Bulgarian Split Squat', 'legs', 'A single-leg squat with the rear foot elevated behind you - builds strength and balance evenly on each side.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand a couple of feet in front of a bench, and rest the top of one foot on it behind you.
2. Lower your back knee toward the floor by bending your front leg, keeping your torso upright.
3. Push through your front heel to return to standing.
4. Complete all reps on one side before switching legs.$$,
    'Reduce the range of motion, or hold onto something for balance.',
    'Hold dumbbells at your sides, or elevate your front foot slightly too for more range.'
  ),
  (
    'Walking Lunges', 'legs', 'A dynamic lunge pattern that builds single-leg strength and balance through a full stride.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand tall, then step forward with one leg into a long stride.
2. Lower your back knee toward the floor, keeping your front knee over your ankle.
3. Push off your front foot to bring your back leg forward into the next stride.
4. Continue alternating legs for the set.$$,
    'Take shorter steps, or do stationary reverse lunges instead of walking forward.',
    'Hold a dumbbell in each hand, or add a pause at the bottom of each stride.'
  ),
  (
    'Leg Press', 'legs', 'A machine-based squat pattern that lets you load the legs safely with back support.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit in the leg press machine with your feet shoulder-width apart on the platform.
2. Release the safety and lower the platform by bending your knees toward your chest.
3. Press back up through your heels to extend your legs without locking your knees out hard.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, slow the lowering phase, or try a single-leg press.'
  ),
  (
    'Glute Bridge', 'legs', 'A simple hip-extension exercise that builds glute strength and is easy on the lower back.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Lie on your back with knees bent, feet flat on the floor hip-width apart.
2. Squeeze your glutes and lift your hips up until your body forms a straight line from shoulders to knees.
3. Lower back down under control without fully resting between reps.$$,
    'Reduce the range of motion, or perform fewer reps with more rest.',
    'Elevate your shoulders on a bench (hip thrust style), or add a weight across your hips.'
  ),
  (
    'Calf Raises', 'legs', 'A simple, targeted exercise for the calf muscles, done standing on flat ground or a raised edge.',
    20, 3, 1, 'system', 'approved', true,
    $$1. Stand with feet hip-width apart, holding onto something for balance if needed.
2. Rise up onto the balls of your feet as high as you can.
3. Lower back down under control to the starting position.$$,
    'Hold onto a wall or rail for balance, or do fewer reps.',
    'Stand on the edge of a step to add extra range of motion, or do them single-leg.'
  ),
  (
    'Step-Ups', 'legs', 'A functional single-leg exercise stepping onto a bench or box.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand in front of a sturdy bench or box.
2. Step up with one foot, driving through that heel to bring your whole body up onto the box.
3. Step back down under control and repeat, then switch legs.$$,
    'Use a lower step, or hold a rail for balance.',
    'Use a higher box, hold dumbbells, or step up without letting the trailing foot assist.'
  ),
  (
    'Side Plank', 'core', 'A lateral core hold that targets the obliques and builds hip stability.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Lie on your side with your elbow under your shoulder and legs stacked.
2. Lift your hips off the floor so your body forms a straight line from head to feet.
3. Hold, keeping your hips lifted and core braced, for the target time, then switch sides.$$,
    'Bend your knees and stack them for a shorter lever arm, or shorten the hold time.',
    'Lift your top leg while holding the position, or add a reach-through with your top arm.'
  ),
  (
    'Hollow Body Hold', 'core', 'A gymnastics-style core hold that builds full-body tension and control.',
    20, 3, 2, 'system', 'approved', true,
    $$1. Lie on your back and press your lower back flat into the floor.
2. Lift your shoulders and legs off the ground, arms extended overhead, legs straight.
3. Hold this "banana" shape, keeping your lower back pressed down, for the target time.$$,
    'Bend your knees and keep your arms at your sides for a shorter, easier hold.',
    'Straighten your legs further and lower them closer to the floor, or add a gentle rock.'
  ),
  (
    'Hanging Leg Raise', 'core', 'A challenging hanging core exercise that targets the lower abs and hip flexors.',
    10, 3, 3, 'system', 'approved', true,
    $$1. Hang from a pull-up bar with arms fully extended.
2. Keeping your legs straight (or knees bent for an easier version), raise them up until at least parallel to the floor.
3. Lower back down under control without swinging.$$,
    'Bend your knees and raise them toward your chest instead of keeping legs straight.',
    'Raise your straight legs all the way to touch the bar, controlling the descent fully.'
  ),
  (
    'Russian Twist', 'core', 'A rotational core exercise performed seated, targeting the obliques.',
    20, 3, 1, 'system', 'approved', true,
    $$1. Sit on the floor with knees bent, leaning back slightly to engage your core.
2. Lift your feet slightly off the floor for more challenge, or keep them down for stability.
3. Rotate your torso to touch the floor on one side, then the other, keeping your chest up.$$,
    'Keep your feet on the floor and reduce the range of the twist.',
    'Hold a weight plate or dumbbell with both hands as you twist, or lift your feet off the floor.'
  ),
  (
    'Dead Bug', 'core', 'A slow, controlled core exercise that teaches you to brace your midsection while your limbs move.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Lie on your back with arms reaching straight up and knees bent 90 degrees over your hips.
2. Press your lower back into the floor and slowly extend one arm overhead and the opposite leg straight out.
3. Return to the start and repeat on the other side, keeping your lower back flat throughout.$$,
    'Move only your legs (keep arms still), or reduce how far you extend your leg.',
    'Add a light weight in your hands, or slow the tempo further.'
  ),
  (
    'Mountain Climbers', 'core', 'A dynamic core exercise performed from a plank position that also raises your heart rate.',
    20, 3, 1, 'system', 'approved', true,
    $$1. Start in a high plank position, hands under shoulders, body straight.
2. Drive one knee toward your chest, then quickly switch legs.
3. Keep your hips low and core braced as you continue alternating at a controlled or fast pace.$$,
    'Slow the pace down significantly, or perform them with your hands elevated on a bench.',
    'Increase the pace, or add a plank shoulder tap between reps.'
  ),
  (
    'Ab Wheel Rollout', 'core', 'An advanced core exercise using an ab wheel (or barbell) that builds serious anti-extension strength.',
    8, 3, 3, 'system', 'approved', true,
    $$1. Kneel on the floor holding an ab wheel (or barbell) in front of you.
2. Brace your core and roll the wheel forward, extending your body as far as you can control.
3. Pull back to the starting position using your core, not your arms.$$,
    'Only roll out a short distance, gradually increasing range as you get stronger.',
    'Roll out from a standing position instead of kneeling, or extend further before pulling back.'
  );
