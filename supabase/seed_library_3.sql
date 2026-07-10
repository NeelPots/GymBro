-- Phase 6: expands the exercise library to ~300 total - broad additions
-- across all 7 categories (more machine/cable/band variants, more compound
-- lift variants, more bodyweight progressions, more cardio/functional
-- movements). Mirrors src/lib/adaptive/defaultExercises.ts. video_url stays
-- null everywhere - see README for how to add real demo videos later.

insert into public.exercises (name, category, description, default_reps, default_sets, difficulty_tier, source, moderation_status, is_public, instructions, easier_variation, harder_variation)
values
  (
    'Svend Press', 'push', 'A chest isolation move pressing two plates together in front of the chest.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Hold two weight plates together, smooth sides out, pressed between your palms at chest height.
2. Squeeze the plates together hard and press your arms straight out in front of you.
3. Return to your chest under control without letting the plates separate.$$,
    'Use lighter plates and press only partway out.',
    'Use heavier plates, hold the extension longer, or slow the tempo.'
  ),
  (
    'Landmine Press', 'push', 'A pressing movement using one end of a barbell anchored in a landmine, easy on the shoulders.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hold the loaded end of a landmine barbell at shoulder height with both hands.
2. Press it up and away from you until your arms are extended.
3. Lower back down under control to the starting position.$$,
    'Use less weight or press from a seated position for more stability.',
    'Press single-arm, or add a step or half-kneeling stance for more core demand.'
  ),
  (
    'Guillotine Press', 'push', 'A bench press variation lowering the bar toward the neck/upper chest for a deep stretch.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Lie on a flat bench and grip the bar slightly wider than shoulder-width.
2. Lower the bar toward your upper chest/neck with elbows flared out.
3. Press back up to full extension under control.$$,
    'Use lighter weight and stop the descent higher on the chest.',
    'Increase the load, or add a brief pause at the bottom.'
  ),
  (
    'Neutral-Grip Dumbbell Press', 'push', 'A bench press with palms facing each other, easier on the shoulders than a pronated grip.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Lie on a flat bench holding dumbbells with palms facing each other.
2. Lower the dumbbells to the sides of your chest, keeping wrists neutral.
3. Press back up to full extension.$$,
    'Use lighter dumbbells and a smaller range of motion.',
    'Increase the weight, add a pause at the chest, or slow the descent.'
  ),
  (
    'Smith Machine Bench Press', 'push', 'A guided-bar-path bench press that removes the need to balance the bar.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Lie on a bench under the Smith machine bar, gripping slightly wider than shoulder-width.
2. Unrack the bar and lower it to your mid-chest.
3. Press back up to full extension, then re-rack when finished.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the load, add a pause at the chest, or try a slow eccentric.'
  ),
  (
    'Cable Chest Press', 'push', 'A standing chest press using cables, keeping tension on the muscle through the full range.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Set both cable pulleys at chest height and grip a handle in each hand, stepping forward for tension.
2. Press both handles forward until your arms are extended.
3. Return under control back to the starting position.$$,
    'Reduce the weight and use a shorter range of motion.',
    'Increase the weight, or press one arm at a time.'
  ),
  (
    'Resistance Band Chest Press', 'push', 'A band-resisted chest press, useful for travel or warming up before heavier pressing.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Anchor a resistance band behind you at chest height and hold an end in each hand.
2. Press both hands forward until your arms are extended.
3. Return under control, keeping tension on the band throughout.$$,
    'Use a lighter band or stand closer to the anchor point.',
    'Use a heavier band or step further from the anchor for more tension.'
  ),
  (
    'Archer Push-up', 'push', 'A push-up variation shifting most of the load onto one arm while the other stays extended.',
    6, 3, 3, 'system', 'approved', true,
    $$1. Start in a wide-hand push-up position.
2. Lower toward one hand while the other arm stays straight and slides out to the side.
3. Press back up to the start, then repeat toward the other side.$$,
    'Reduce the range of motion, or do these from your knees.',
    'Slow the lowering phase, or progress toward a one-arm push-up.'
  ),
  (
    'Hindu Push-up', 'push', 'A flowing push-up variation that moves through a downward-dog-to-cobra pattern.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Start in a downward-dog position, hips high.
2. Dive your chest forward and down close to the floor, sweeping into an upward-facing arch with hips low and chest up.
3. Reverse the motion back to the starting downward-dog position.$$,
    'Reduce the range of the dive and keep movements small and controlled.',
    'Slow the whole flow down, or add a push-up at the bottom of the dive.'
  ),
  (
    'One-Arm Push-up', 'push', 'An advanced push-up performed with a single arm, requiring serious pressing strength and stability.',
    3, 3, 3, 'system', 'approved', true,
    $$1. Get into a push-up position with feet spread wide for balance and one hand behind your back.
2. Lower your chest toward the floor under control, keeping your body square.
3. Press back up to full extension, then repeat on the other side.$$,
    'Work archer push-ups and one-arm negatives first to build toward this.',
    'Elevate your feet, or add a pause at the bottom.'
  ),
  (
    'Explosive Clap Push-up', 'push', 'A plyometric push-up variation where your hands leave the floor to clap before landing.',
    6, 3, 3, 'system', 'approved', true,
    $$1. Start in a standard push-up position.
2. Lower under control, then press up explosively so your hands leave the floor.
3. Clap once in the air, then land softly with bent elbows to absorb the impact.$$,
    'Practice an explosive push-up without the clap first, or do these from an incline.',
    'Add a double clap, or clap behind your back.'
  ),
  (
    'Wall Push-up', 'push', 'A beginner-friendly push-up performed standing against a wall, minimal bodyweight load.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Stand facing a wall, arm's length away, hands flat on the wall at shoulder height.
2. Bend your elbows to bring your chest toward the wall.
3. Press back to the starting position.$$,
    'Stand closer to the wall to reduce the load further.',
    'Step back further from the wall, or progress to incline push-ups on a low surface.'
  ),
  (
    'Resistance Band Push-up', 'push', 'A push-up with a band looped across your back for extra resistance at lockout.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Loop a resistance band across your upper back and hold an end under each hand on the floor.
2. Perform a push-up as normal, pressing against the added band tension.
3. Lower back down under control and repeat.$$,
    'Use a lighter band or drop to your knees.',
    'Use a heavier band, or elevate your feet.'
  ),
  (
    'Cable Fly (Low-to-High)', 'push', 'A cable fly variation that emphasizes the upper chest.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Set both cable pulleys low and grip a handle in each hand.
2. Step forward and sweep your hands up and together in front of your upper chest.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a shorter range of motion.',
    'Increase the weight, or pause at the top of each rep.'
  ),
  (
    'Cable Fly (High-to-Low)', 'push', 'A cable fly variation that emphasizes the lower chest.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Set both cable pulleys high and grip a handle in each hand.
2. Step forward and sweep your hands down and together in front of your hips.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a shorter range of motion.',
    'Increase the weight, or pause at the bottom of each rep.'
  ),
  (
    'Machine Pec Deck', 'push', 'A seated machine isolation exercise for the chest with a fixed, guided motion.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit in the pec deck machine with your back flat against the pad, forearms on the arm pads.
2. Bring your arms together in front of your chest, squeezing your pecs.
3. Return under control to the starting position without letting the weight stack slam.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Decline Dumbbell Press', 'push', 'A dumbbell press on a decline bench that emphasizes the lower chest.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Lie on a decline bench holding a dumbbell in each hand at shoulder height.
2. Press the dumbbells up until your arms are extended.
3. Lower back down under control to the starting position.$$,
    'Use lighter dumbbells and reduce the range of motion.',
    'Increase the weight, add a pause at the bottom, or slow the descent.'
  ),
  (
    'Incline Barbell Press', 'push', 'A barbell press on an incline bench that emphasizes the upper chest.',
    8, 3, 1, 'system', 'approved', true,
    $$1. Set a bench to a 30-45 degree incline and lie back, gripping the bar slightly wider than shoulder-width.
2. Unrack the bar and lower it to your upper chest.
3. Press back up to full extension.$$,
    'Use lighter weight, or reduce the incline angle.',
    'Increase the load, add a pause at the chest, or slow the descent.'
  ),
  (
    'Spoto Press', 'push', 'A bench press variation pausing just above the chest to build control and remove momentum.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Lie on a flat bench and unrack the bar with a standard grip.
2. Lower the bar to about an inch above your chest and pause for 1-2 seconds.
3. Press back up to full extension without bouncing the bar off your chest.$$,
    'Use lighter weight and shorten the pause.',
    'Increase the load, or lengthen the pause to 3 seconds.'
  ),
  (
    'Board Press', 'push', 'A partial-range bench press variation pressing off boards stacked on the chest, used to overload lockout strength.',
    5, 3, 2, 'system', 'approved', true,
    $$1. Have a partner hold boards (or a firm pad) on your chest while you lie on a bench.
2. Lower the bar until it touches the boards.
3. Press back up to full extension.$$,
    'Use fewer boards for a longer range, or reduce the weight.',
    'Use more boards for a shorter range and heavier loads, or add a pause at the boards.'
  ),
  (
    'Neutral-Grip Press (Machine)', 'push', 'A machine chest press using neutral, parallel handles that''s easier on the shoulders.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit in the machine and grip the neutral handles at chest height.
2. Press forward until your arms are extended.
3. Return under control back to the starting position.$$,
    'Reduce the weight stack and use a partial range of motion.',
    'Increase the weight, slow the return phase, or press one arm at a time.'
  ),
  (
    'Single-Arm Dumbbell Press', 'push', 'A unilateral chest press that also challenges core stability to resist rotation.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Lie on a bench holding one dumbbell at shoulder height, the other hand braced on your torso.
2. Press the dumbbell up until your arm is extended, resisting the urge to rotate.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell and keep both feet flat for extra stability.',
    'Increase the weight, or perform it on a stability ball.'
  ),
  (
    'Push-up on Rings', 'push', 'A push-up performed with hands on gymnastic rings, adding an unstable, deeper-range challenge.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Set rings a few inches off the floor and grip one in each hand in a push-up position.
2. Lower your chest between the rings, letting them turn out slightly at the bottom.
3. Press back up to full extension, stabilizing the rings throughout.$$,
    'Set the rings higher, or do these from your knees.',
    'Lower the rings further, or elevate your feet.'
  ),
  (
    'Ring Dips', 'push', 'A dip performed on gymnastic rings, adding a stability challenge on top of the pressing strength demand.',
    6, 3, 3, 'system', 'approved', true,
    $$1. Support yourself on two rings with arms extended, rings turned out slightly.
2. Lower yourself by bending your elbows until your shoulders are about level with your elbows.
3. Press back up to full extension, keeping the rings stable.$$,
    'Use a resistance band for assistance, or perform regular bar dips first.',
    'Add a weighted vest, or slow the lowering phase.'
  ),
  (
    'Weighted Dips', 'push', 'A parallel-bar dip with added external weight for more overload once bodyweight dips are easy.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Attach weight via a dip belt or hold a dumbbell between your feet.
2. Support yourself on the parallel bars and lower until your shoulders are about level with your elbows.
3. Press back up to full extension.$$,
    'Reduce the added weight, or remove it entirely.',
    'Add more weight, or pause at the bottom of each rep.'
  ),
  (
    'Bench Dip', 'push', 'A beginner-friendly triceps-and-chest dip using a bench for support instead of parallel bars.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit on the edge of a bench, hands gripping the edge beside your hips, legs extended in front of you.
2. Lower your hips toward the floor by bending your elbows.
3. Press back up through your palms to the starting position.$$,
    'Bend your knees to reduce the load on your arms.',
    'Straighten your legs further, elevate your feet on another bench, or add weight on your lap.'
  ),
  (
    'Pseudo Planche Push-up', 'push', 'A push-up with hands shifted back toward the hips, building toward planche strength.',
    6, 3, 3, 'system', 'approved', true,
    $$1. Get into a push-up position with your hands turned out and shifted back near your hips.
2. Lean your shoulders forward past your hands and lower your chest toward the floor.
3. Press back up to full extension, keeping the forward lean throughout.$$,
    'Shift your hands less far back, or reduce the range of motion.',
    'Shift your hands further back, or elevate your feet.'
  ),
  (
    'Deficit Push-up', 'push', 'A push-up performed with hands elevated on blocks for a deeper range of motion than the floor allows.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Place your hands on two blocks or low platforms, slightly wider than shoulder-width.
2. Lower your chest below hand height, feeling a deep stretch.
3. Press back up to full extension.$$,
    'Use lower blocks, or reduce the range of motion.',
    'Use higher blocks for a deeper range, or add a weighted vest.'
  ),
  (
    'Plyo Push-up (Box)', 'push', 'An explosive push-up pressing from the floor up onto a low box or platform.',
    6, 3, 3, 'system', 'approved', true,
    $$1. Start in a push-up position with a low box or platform in front of you.
2. Lower down, then press up explosively, driving your hands onto the box.
3. Step back down and repeat.$$,
    'Use a lower box, or practice a regular explosive push-up first.',
    'Use a higher box, or push off the floor and land back on the floor for extra air time.'
  ),
  (
    'Seated Chest Press Machine', 'push', 'A seated, back-supported machine press for the chest with a fixed, stable path.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit in the machine with your back flat against the pad and grip the handles at chest height.
2. Press forward until your arms are extended.
3. Return under control back to the starting position.$$,
    'Reduce the weight stack and use a partial range of motion.',
    'Increase the weight, slow the return phase, or press one arm at a time.'
  ),
  (
    'Cross-Body Cable Press', 'push', 'A single-arm cable press that finishes across the body, adding a rotational chest squeeze.',
    12, 3, 2, 'system', 'approved', true,
    $$1. Set a cable pulley at chest height and grip the handle with one hand, side-on to the machine.
2. Press the handle across your body until your arm is extended.
3. Return under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a shorter range of motion.',
    'Increase the weight, or add a pause at full extension.'
  ),
  (
    'Standing Landmine Chest Press', 'push', 'A standing single-arm landmine press across the body that also challenges core anti-rotation.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand side-on to a landmine barbell, holding the loaded end at chest height with one hand.
2. Press it forward and slightly across your body until your arm is extended.
3. Return under control, then complete all reps before switching sides.$$,
    'Use less weight, or stand facing the anchor rather than side-on.',
    'Increase the weight, or add a split stance for more instability.'
  ),
  (
    'Dumbbell Squeeze Press', 'push', 'A bench press variation pressing two dumbbells together for constant inward chest tension.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Lie on a flat bench holding two dumbbells pressed together above your chest.
2. Lower them to your chest while squeezing them together throughout.
3. Press back up to full extension, maintaining the squeeze.$$,
    'Use lighter dumbbells and focus purely on the squeeze.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Iso-Lateral Chest Press Machine', 'push', 'A plate-loaded machine press with independent arms, letting each side move through its own path.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit in the machine and grip each independent handle at chest height.
2. Press both handles forward until your arms are extended.
3. Return under control back to the starting position.$$,
    'Reduce the weight and use a partial range of motion.',
    'Increase the weight, or press one arm at a time while the other rests.'
  ),
  (
    'Banded Push-up', 'push', 'A push-up with a resistance band looped across the upper back for accommodating resistance at the top.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Loop a resistance band across your upper back, holding one end under each hand.
2. Perform a push-up, pressing against the increasing band tension near the top.
3. Lower back down under control and repeat.$$,
    'Use a lighter band, or drop to your knees.',
    'Use a heavier band, or elevate your feet on a bench.'
  ),
  (
    'Cable Pullover', 'pull', 'A lat isolation exercise pulling a cable from overhead down to the thighs with straight arms.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Kneel or stand facing away from a high cable, gripping a straight bar with arms extended overhead.
2. Keeping your arms mostly straight, pull the bar down in an arc to your thighs, engaging your lats.
3. Let it return under control to the starting position.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the bottom of each rep.'
  ),
  (
    'Machine Row (Hammer Strength)', 'pull', 'A plate-loaded machine row with independent arms for each side of the back.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit or stand at the machine, chest against the pad, gripping the handles.
2. Pull the handles toward you, squeezing your shoulder blades together.
3. Extend back out under control to the starting position.$$,
    'Reduce the weight and use a partial range of motion.',
    'Increase the weight, or pull one arm at a time.'
  ),
  (
    'Renegade Row', 'pull', 'A plank position row that combines core stability with a unilateral back pull.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Get into a high plank with a dumbbell in each hand, feet spread for stability.
2. Row one dumbbell up to your hip while balancing on the other hand.
3. Lower it back down and repeat on the other side, keeping your hips level throughout.$$,
    'Widen your stance further, or perform the plank hold without rowing first.',
    'Narrow your stance, or add a push-up between rows.'
  ),
  (
    'Meadows Row', 'pull', 'A single-arm landmine row performed from a bent-over, staggered stance.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand side-on to a landmine barbell in a staggered stance, hinging forward at the hips.
2. Grip the loaded end with one hand and row it up toward your hip.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a shorter range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Landmine Row', 'pull', 'A bent-over row using a landmine-anchored barbell, both hands on the same end.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Straddle a landmine barbell, hinge forward at the hips, and grip the loaded end with both hands.
2. Row the bar up toward your chest, squeezing your shoulder blades together.
3. Lower back down under control.$$,
    'Use lighter weight, or reduce your forward hinge slightly.',
    'Increase the load, or add a pause at the top of each rep.'
  ),
  (
    'Rack Pull', 'pull', 'A partial-range deadlift pulled from knee height, allowing heavier loads and building lockout strength.',
    5, 3, 2, 'system', 'approved', true,
    $$1. Set a barbell on rack pins at about knee height.
2. Grip the bar just outside your knees, back flat, chest up.
3. Drive through your heels and stand up tall, keeping the bar close to your body.$$,
    'Set the pins higher for a shorter range, or use lighter weight.',
    'Set the pins lower for a longer range, or increase the load.'
  ),
  (
    'Sumo Deadlift High Pull', 'pull', 'An explosive hybrid pull combining a sumo deadlift with an upright row finish.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand with a wide stance over a barbell or kettlebell, gripping it with both hands.
2. Pull the weight up explosively, extending your hips.
3. As it rises, pull your elbows up and out to bring the weight to chest height.$$,
    'Use lighter weight and focus on the hip drive before adding the pull.',
    'Increase the weight, or add more explosiveness to the pull.'
  ),
  (
    'Kroc Row', 'pull', 'A heavy, high-rep single-arm dumbbell row using some body English for overload.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Support yourself with one hand on a bench, holding a heavy dumbbell in the other.
2. Row the dumbbell up toward your hip, allowing a slight body rotation to help drive the weight.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell and keep the motion strict.',
    'Increase the weight and rep count for a serious back and grip challenge.'
  ),
  (
    'Chest-Supported Row', 'pull', 'A row performed lying chest-down on an incline bench, removing lower-back involvement.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Lie face-down on an incline bench holding a dumbbell in each hand, arms hanging.
2. Row both dumbbells up toward your ribs, squeezing your shoulder blades together.
3. Lower back down under control.$$,
    'Use lighter dumbbells and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Resistance Band Row', 'pull', 'A band-resisted seated row, useful for travel or higher-rep back work.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Sit with legs extended and loop a resistance band around your feet, holding an end in each hand.
2. Pull both hands toward your ribs, squeezing your shoulder blades together.
3. Return under control, keeping tension on the band.$$,
    'Use a lighter band or bend your knees slightly.',
    'Use a heavier band, or add a pause at full contraction.'
  ),
  (
    'Superman', 'pull', 'A bodyweight lower-back and glute extension exercise performed lying face-down.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Lie face-down with arms extended in front of you.
2. Simultaneously lift your arms, chest, and legs off the floor.
3. Hold briefly, then lower back down under control.$$,
    'Lift arms and legs separately rather than all at once.',
    'Hold the top position longer, or add small pulsing reps at the top.'
  ),
  (
    'Reverse Fly Machine', 'pull', 'A seated machine isolation exercise for the rear delts and upper back.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit in the machine facing the pad, gripping the handles with arms extended in front of you.
2. Open your arms out to the sides, squeezing your shoulder blades together.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Scapular Pull-up', 'pull', 'A foundational pull-up drill training shoulder blade control without bending the elbows.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hang from a pull-up bar with arms fully extended.
2. Without bending your elbows, pull your shoulder blades down and together to raise your body slightly.
3. Relax back to a full hang and repeat.$$,
    'Use a resistance band for assistance.',
    'Hold the top position longer, or add a slight pause each rep.'
  ),
  (
    'Ring Rows', 'pull', 'A horizontal pulling exercise on gymnastic rings, easily scaled by changing your body angle.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Set rings at around waist height and lie underneath, gripping a ring in each hand, body straight.
2. Pull your chest up to the rings, squeezing your shoulder blades together.
3. Lower back down under control to full arm extension.$$,
    'Stand more upright (less horizontal) to reduce the load.',
    'Lower the rings, or elevate your feet on a bench.'
  ),
  (
    'Wide-Grip Pull-up', 'pull', 'A pull-up variation with a wider grip that emphasizes the outer lats.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Grip the bar significantly wider than shoulder-width, palms facing away from you.
2. Pull yourself up until your chin clears the bar.
3. Lower back down under control to a full hang.$$,
    'Use a resistance band for assistance, or use a slightly narrower grip.',
    'Add a weighted vest, or pause at the top of each rep.'
  ),
  (
    'Neutral-Grip Pull-up', 'pull', 'A pull-up performed on parallel handles with palms facing each other, easier on the shoulders.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Grip parallel handles with palms facing each other, hanging with arms extended.
2. Pull yourself up until your chin clears the handles.
3. Lower back down under control to a full hang.$$,
    'Use a resistance band for assistance, or do slow negatives.',
    'Add a weighted vest, or slow the lowering phase.'
  ),
  (
    'Archer Pull-up', 'pull', 'A pull-up variation shifting most of the load onto one arm while the other stays extended out to the side.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Grip the bar wide and pull yourself up while shifting your body toward one hand.
2. Let the other arm straighten out to the side as you pull.
3. Lower back down under control, then repeat toward the other side.$$,
    'Reduce how far you shift to the side, or use a band for assistance.',
    'Shift further to the side, or slow the pull and lower.'
  ),
  (
    'L-Sit Pull-up', 'pull', 'A pull-up performed with your legs held out straight in an L position, adding a serious core demand.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Hang from the bar with your legs extended straight out in front of you at hip height.
2. Pull yourself up until your chin clears the bar, keeping your legs raised.
3. Lower back down under control without letting your legs drop.$$,
    'Bend your knees instead of keeping legs fully straight.',
    'Hold the L-sit position longer between reps, or add a weighted vest.'
  ),
  (
    'Muscle-Up', 'pull', 'An advanced combination movement transitioning from a pull-up directly into a dip above the bar or rings.',
    3, 3, 3, 'system', 'approved', true,
    $$1. Start with an explosive pull-up, pulling your chest toward the bar.
2. As you rise, lean forward and transition your wrists over the bar.
3. Press up through a dip to full arm extension above the bar.$$,
    'Practice the pull-up and dip halves separately, or use a resistance band for assistance.',
    'Perform strict (no kip) muscle-ups, or add a weighted vest.'
  ),
  (
    'Trap Bar Deadlift', 'pull', 'A deadlift performed inside a hexagonal trap bar, which is more forgiving on the lower back.',
    6, 3, 1, 'system', 'approved', true,
    $$1. Stand inside the trap bar with feet hip-width apart, gripping the handles.
2. Hinge down keeping your chest up and back flat.
3. Drive through your heels to stand up tall, then lower back down under control.$$,
    'Use lighter weight, or stand on a small platform to reduce the range of motion.',
    'Increase the load, add a pause off the floor, or slow the lowering phase.'
  ),
  (
    'Deficit Deadlift', 'pull', 'A deadlift performed standing on a small platform for extra range of motion off the floor.',
    5, 3, 2, 'system', 'approved', true,
    $$1. Stand on a 1-2 inch platform with the bar over your mid-foot.
2. Hinge down and grip the bar, back flat, chest up.
3. Drive through your heels to stand up tall, keeping the bar close to your body.$$,
    'Use a lower platform or lighter weight.',
    'Use a higher platform for more range, or increase the load.'
  ),
  (
    'Snatch-Grip Deadlift', 'pull', 'A deadlift with a very wide grip that increases range of motion and upper-back demand.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Stand with feet hip-width apart, gripping the bar very wide, near the collars.
2. Hinge down, back flat, chest up.
3. Drive through your heels and stand up tall, keeping the bar close to your body.$$,
    'Use lighter weight given the extended range of motion.',
    'Increase the load, or add a pause just off the floor.'
  ),
  (
    'Seal Row', 'pull', 'A strict row performed lying face-down on a raised bench, eliminating any body English.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Lie face-down on a bench raised high enough that the weight hangs freely beneath you.
2. Row the weight up toward the bench, squeezing your shoulder blades together.
3. Lower back down under control to a full stretch.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Pendlay Row', 'pull', 'A strict, explosive barbell row starting from a dead stop on the floor each rep.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Hinge over a barbell on the floor, back flat, torso close to parallel with the ground.
2. Row the bar explosively up to your lower chest.
3. Lower it back to the floor completely before starting the next rep.$$,
    'Use lighter weight and focus on strict form.',
    'Increase the load, or add more explosiveness to the pull.'
  ),
  (
    'Dumbbell Pullover', 'pull', 'A classic lat-and-chest exercise pulling a single dumbbell from overhead down to the chest.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Lie across a bench with your upper back supported, holding one dumbbell with both hands above your chest.
2. Lower the dumbbell back over your head, feeling a stretch in your lats.
3. Pull it back up over your chest under control.$$,
    'Use a lighter dumbbell and a smaller range of motion.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'One-Arm Lat Pulldown', 'pull', 'A single-arm cable pulldown that lets each side of the back work independently.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Attach a single handle to a high cable and sit facing the machine.
2. Pull the handle down toward your ribs, driving your elbow down and back.
3. Control it back up to full extension, then complete all reps before switching sides.$$,
    'Reduce the weight stack and use a partial range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Behind-the-Neck Pulldown', 'pull', 'A lat pulldown variation pulling the bar down behind the head instead of to the front.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Sit at the pulldown machine and grip the bar wide.
2. Pull the bar down behind your head to the base of your neck, keeping the movement controlled.
3. Let it rise back up under control without straining your neck forward.$$,
    'Reduce the weight and range of motion, or use the standard front pulldown instead.',
    'Increase the weight, or slow the return phase.'
  ),
  (
    'Band Pull-Apart', 'pull', 'A simple band exercise for the rear delts and upper back that supports shoulder health.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Hold a light resistance band in front of you with both hands, shoulder-width apart.
2. Pull the band apart by driving your arms out to the sides, squeezing your shoulder blades together.
3. Return under control to the starting position.$$,
    'Use a lighter band or hold your hands wider apart.',
    'Use a heavier band, or add a pause at full stretch.'
  ),
  (
    'Face Pull (Band)', 'pull', 'A band-resisted rear-delt and upper-back exercise, useful for warm-ups or travel.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Anchor a band at upper-chest to head height and grip it with both hands, palms facing in.
2. Pull the band toward your face, flaring your elbows out and squeezing your shoulder blades together.
3. Return to the start under control.$$,
    'Use a lighter band and focus purely on the squeeze.',
    'Use a heavier band, or add a brief pause at the fully-pulled position.'
  ),
  (
    'Towel Pull-up', 'pull', 'A pull-up gripping towels draped over the bar, building serious grip and forearm strength.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Drape a towel over the bar and grip one end in each hand.
2. Hang with arms extended, gripping the towel tightly.
3. Pull yourself up until your chin clears the bar, then lower back down under control.$$,
    'Use a resistance band for assistance, or use one towel with both hands together.',
    'Add a weighted vest, or use thicker towels for a harder grip.'
  ),
  (
    'Weighted Pull-up', 'pull', 'A pull-up with added external weight for overload once bodyweight pull-ups are easy.',
    5, 3, 2, 'system', 'approved', true,
    $$1. Attach weight via a dip belt or hold a dumbbell between your feet.
2. Hang from the bar with arms extended.
3. Pull yourself up until your chin clears the bar, then lower back down under control.$$,
    'Reduce the added weight, or remove it entirely.',
    'Add more weight, or pause at the top of each rep.'
  ),
  (
    'Jackknife Pull-up (Typewriter Pull-up)', 'pull', 'A pull-up variation shifting side to side at the top, building unilateral pulling strength.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Pull yourself up to the top of a wide-grip pull-up.
2. Shift your body across to one hand, then the other, like a typewriter carriage, staying at the top.
3. Lower back down under control after completing both sides.$$,
    'Reduce how far you shift side to side.',
    'Slow the shifting movement further, or add a weighted vest.'
  ),
  (
    'Gorilla Row', 'pull', 'An alternating kettlebell row performed from a wide, athletic squat stance.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand over two kettlebells in a wide squat stance, gripping one handle in each hand.
2. Row one kettlebell up toward your hip while the other stays planted for support.
3. Lower it back down and repeat on the other side.$$,
    'Use lighter kettlebells and a narrower stance.',
    'Increase the weight, or add a pause at the top of each row.'
  ),
  (
    'Suspension Trainer Row (TRX Row)', 'pull', 'A bodyweight row using suspension straps, easily scaled by adjusting your body angle.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Grip the suspension straps and lean back with arms extended, feet planted, body straight.
2. Pull your chest up to your hands, squeezing your shoulder blades together.
3. Lower back down under control to full arm extension.$$,
    'Stand more upright to reduce the load.',
    'Lean back further, or perform the row single-arm.'
  ),
  (
    'High Row Machine', 'pull', 'A machine row pulling from a high angle, emphasizing the upper back and rear delts.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit at the machine with your chest against the pad, gripping the high handles.
2. Pull the handles back toward you, leading with your elbows high.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a partial range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Zercher Squat', 'legs', 'A squat holding the bar in the crooks of your elbows, building serious core and upper-back strength.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Cradle a barbell in the crooks of your elbows, held close to your chest.
2. Squat down keeping your torso upright until your thighs are at least parallel.
3. Drive through your heels to stand back up.$$,
    'Use lighter weight, or pad the bar for comfort in your elbows.',
    'Increase the load, or add a pause at the bottom.'
  ),
  (
    'Box Squat', 'legs', 'A squat that pauses on a box at the bottom, teaching consistent depth and hip drive.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Set a box or bench behind you at or slightly below parallel-squat height.
2. Squat down and sit back onto the box, briefly relaxing your hips.
3. Drive back up through your heels without bouncing off the box.$$,
    'Use a higher box and lighter weight.',
    'Use a lower box, or increase the load.'
  ),
  (
    'Overhead Squat', 'legs', 'A squat holding the bar locked out overhead, demanding serious mobility and core stability.',
    6, 3, 3, 'system', 'approved', true,
    $$1. Hold a barbell locked out overhead with a wide grip.
2. Squat down keeping the bar directly over your mid-foot and your torso upright.
3. Drive through your heels to stand back up, keeping the bar locked out throughout.$$,
    'Use a light bar or PVC pipe to build mobility and pattern first.',
    'Increase the load, or add a pause at the bottom.'
  ),
  (
    'Landmine Squat', 'legs', 'A goblet-style squat holding a landmine barbell, an easy-to-scale loaded squat pattern.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand facing a landmine barbell, holding the loaded end with both hands at chest height.
2. Squat down keeping your chest up.
3. Drive through your heels to stand back up.$$,
    'Use lighter weight and reduce depth if needed.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Cyclist Squat', 'legs', 'A squat performed with heels elevated on a wedge, shifting emphasis heavily onto the quads.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand with your heels elevated on a small wedge or plates, feet close together.
2. Squat straight down, keeping your torso upright.
3. Drive through the balls of your feet to stand back up.$$,
    'Use a smaller heel elevation, or hold onto something for balance.',
    'Hold a weight at your chest, or increase the heel elevation slightly.'
  ),
  (
    'Sissy Squat', 'legs', 'An advanced quad isolation exercise leaning back on the toes with knees driving forward.',
    8, 3, 3, 'system', 'approved', true,
    $$1. Stand holding onto something for balance, rising onto the balls of your feet.
2. Lean back and bend your knees forward, lowering your torso while keeping hips extended.
3. Use your quads to pull yourself back up to standing.$$,
    'Reduce the range of motion, or hold on with both hands for support.',
    'Increase the range, or add a weight held behind your head.'
  ),
  (
    'Nordic Hamstring Curl', 'legs', 'A demanding bodyweight hamstring exercise lowering your torso forward under control with anchored ankles.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Kneel with your ankles anchored (partner holding them or under a pad), torso upright.
2. Lower your torso forward as slowly as possible, resisting with your hamstrings.
3. Catch yourself with your hands and push back up, or use your hamstrings to pull back if able.$$,
    'Lower only partway, or push back up with your hands to assist.',
    'Lower slower and further, or pull back up without using your hands.'
  ),
  (
    'Glute Ham Raise', 'legs', 'A machine-assisted posterior-chain exercise targeting the hamstrings and glutes through a full range.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Position yourself in the glute-ham raise machine with your ankles secured.
2. Lower your torso forward under control, keeping your body straight.
3. Use your hamstrings and glutes to pull yourself back up to the starting position.$$,
    'Reduce the range of motion, or assist with your hands on the pad.',
    'Add a weight held to your chest, or slow the lowering phase.'
  ),
  (
    'Cable Pull-Through', 'legs', 'A hip-hinge exercise using a low cable between the legs, great for teaching the hinge pattern.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand facing away from a low cable, gripping a rope attachment between your legs.
2. Hinge forward at the hips, letting the rope pull back between your legs.
3. Drive your hips forward to stand up tall, squeezing your glutes.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top squeeze.'
  ),
  (
    'Kettlebell Goblet Lunge', 'legs', 'A lunge holding a kettlebell at the chest, combining single-leg work with an anti-rotation core demand.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hold a kettlebell by the horns at your chest.
2. Step forward into a lunge, lowering your back knee toward the floor.
3. Push off your front foot to return to standing, then repeat on the other side.$$,
    'Use a lighter kettlebell or a shorter step.',
    'Increase the weight, or add a pause at the bottom of each rep.'
  ),
  (
    'Curtsy Lunge', 'legs', 'A lunge stepping diagonally behind you, targeting the glutes and outer hip through a different angle.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand tall, then step one leg diagonally behind and across the other.
2. Bend both knees to lower your hips, keeping your torso upright.
3. Push through your front foot to return to standing, then repeat on the other side.$$,
    'Take a shorter step, or reduce depth.',
    'Hold dumbbells at your sides, or add a pause at the bottom.'
  ),
  (
    'Lateral Lunge', 'legs', 'A side-stepping lunge that trains the legs through the frontal plane, often neglected in straight-ahead training.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand tall, then take a big step out to one side.
2. Bend that knee and push your hips back, keeping the other leg straight.
3. Push off to return to standing, then repeat on the other side.$$,
    'Take a shorter step, or reduce depth.',
    'Hold a weight at your chest, or add a pause at the bottom.'
  ),
  (
    'Step-Down', 'legs', 'A controlled single-leg exercise stepping down off a box, great for knee stability and control.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand on a box or step with one foot, the other hovering off the edge.
2. Slowly lower your hovering foot toward the floor by bending your standing knee.
3. Tap the floor lightly, then push back up to standing on the box.$$,
    'Use a lower box, or lightly touch down with the free foot for balance.',
    'Use a higher box, or hold a weight at your chest.'
  ),
  (
    'Wall Sit', 'legs', 'An isometric quad-and-glute hold with your back against a wall, simple and equipment-free.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Stand with your back against a wall and slide down until your knees are at about 90 degrees.
2. Hold this position, keeping your back flat against the wall.
3. Push back up to standing when the target time is reached.$$,
    'Hold a higher position (less knee bend), or shorten the hold time.',
    'Hold a lower position, hold a weight on your lap, or extend the time.'
  ),
  (
    'Single-Leg Deadlift (Dumbbell)', 'legs', 'A balance-and-hamstring exercise hinging on one leg while holding dumbbells.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand on one leg holding a dumbbell in each hand.
2. Hinge forward at the hips, extending your free leg back for balance.
3. Return to standing by driving your hips forward, then complete all reps before switching sides.$$,
    'Use lighter weight, or lightly tap your free foot down for balance.',
    'Increase the weight, or close your eyes briefly to challenge balance further.'
  ),
  (
    'Adductor Machine', 'legs', 'A seated machine isolation exercise for the inner thigh muscles.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Sit in the adductor machine with the pads against the inside of your knees.
2. Squeeze your legs together against the resistance.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Abductor Machine', 'legs', 'A seated machine isolation exercise for the outer hip and glute medius.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Sit in the abductor machine with the pads against the outside of your knees.
2. Push your legs apart against the resistance.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at full extension.'
  ),
  (
    'Standing Calf Raise Machine', 'legs', 'A machine-based calf raise that lets you load the movement heavily and safely.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Position your shoulders under the pads and the balls of your feet on the platform.
2. Rise up onto your toes as high as you can.
3. Lower back down under control, feeling a stretch at the bottom.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, add a pause at the top, or slow the descent.'
  ),
  (
    'Donkey Calf Raise', 'legs', 'A calf raise performed bent over at the hips, which changes the angle of pull on the calf.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Bend forward at the hips, resting your torso on a support, with the balls of your feet on a raised platform.
2. Rise up onto your toes as high as you can.
3. Lower back down under control to a full stretch.$$,
    'Reduce the range of motion, or remove any added weight.',
    'Add weight across your hips, or add a pause at the top.'
  ),
  (
    'Seated Calf Raise Machine', 'legs', 'A seated calf raise that targets the soleus muscle with the knee bent.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Sit in the machine with the pads resting on your lower thighs and the balls of your feet on the platform.
2. Rise up onto your toes as high as you can.
3. Lower back down under control to a full stretch.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, add a pause at the top, or slow the descent.'
  ),
  (
    'Jefferson Squat', 'legs', 'A straddle-stance squat with the bar between your legs, building unique whole-leg strength.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Straddle a barbell on the floor, one foot forward and one back.
2. Squat down and grip the bar with one hand in front and one behind.
3. Drive through both feet to stand up tall, then repeat with your stance switched.$$,
    'Use lighter weight and focus on the unfamiliar stance first.',
    'Increase the load, or add a pause at the bottom.'
  ),
  (
    'Belt Squat', 'legs', 'A squat loading the hips via a belt instead of the spine, useful for those wanting to spare their back.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Attach a belt squat harness around your hips, loaded with weight below you.
2. Squat down keeping your torso upright.
3. Drive through your heels to stand back up.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Spanish Squat', 'legs', 'A band-assisted squat that lets you sit back deeply while keeping tension purely on the quads, easy on the knees.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Loop a thick band around a low anchor and behind both knees.
2. Sit back into a squat, leaning against the band's tension, torso upright.
3. Drive through your quads to stand back up.$$,
    'Reduce the depth, or use a lighter band.',
    'Increase the depth or hold time, or add a weight at your chest.'
  ),
  (
    'Reverse Lunge', 'legs', 'A lunge stepping backward instead of forward, generally easier on the knees than a forward lunge.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand tall, then step one leg back into a lunge.
2. Lower your back knee toward the floor, keeping your front knee over your ankle.
3. Push through your front foot to return to standing, then repeat on the other side.$$,
    'Take a shorter step, or reduce depth.',
    'Hold dumbbells at your sides, or add a pause at the bottom.'
  ),
  (
    'Lunge Jump', 'legs', 'An explosive plyometric lunge switching legs mid-air, building power and coordination.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Start in a lunge position, one foot forward, one back.
2. Jump explosively, switching your legs in the air.
3. Land softly in a lunge with the opposite leg forward, then repeat.$$,
    'Step-switch instead of jumping, or slow the pace.',
    'Jump higher, or increase the pace.'
  ),
  (
    'Smith Machine Squat', 'legs', 'A guided-bar-path squat that removes the need to balance the bar.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Position the bar across your upper back in the Smith machine and unrack it.
2. Squat down until your thighs are at least parallel to the floor.
3. Drive through your heels to stand back up.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the load, or add a pause at the bottom.'
  ),
  (
    'Leg Press (Single-Leg)', 'legs', 'A single-leg version of the leg press, addressing strength imbalances between sides.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit in the leg press machine and place one foot on the platform, the other resting to the side.
2. Lower the platform by bending your knee toward your chest.
3. Press back up through your heel, then complete all reps before switching sides.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'Cossack Squat', 'legs', 'A wide-stance lateral squat shifting your weight fully to one side, great for hip mobility and strength.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand with a wide stance, toes turned slightly out.
2. Shift your weight to one side, bending that knee and sitting back while the other leg stays straight.
3. Push back to center and repeat on the other side.$$,
    'Reduce the range of motion, or hold onto something for balance.',
    'Hold a weight at your chest, or increase the depth.'
  ),
  (
    'Pin Squat', 'legs', 'A squat starting from a dead stop on safety pins, removing the stretch reflex to build raw strength.',
    5, 3, 2, 'system', 'approved', true,
    $$1. Set safety pins in a rack at your bottom squat depth.
2. Squat down and rest the bar briefly on the pins, relaxing your hips.
3. Drive back up through your heels from a dead stop.$$,
    'Set the pins higher for a shorter range, or use lighter weight.',
    'Set the pins lower, or increase the load.'
  ),
  (
    'Banded Squat', 'legs', 'A bodyweight or loaded squat with a band around the knees to cue proper knee tracking.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Loop a light band around your knees and stand with feet shoulder-width apart.
2. Squat down while actively pushing your knees out against the band.
3. Drive through your heels to stand back up.$$,
    'Use a lighter band, or perform without added weight.',
    'Use a heavier band, or hold a dumbbell at your chest.'
  ),
  (
    'Barbell Glute Bridge', 'legs', 'A floor-based hip extension exercise loading the glutes with a barbell across the hips.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit on the floor with a barbell over your hips, knees bent, feet flat.
2. Drive through your heels to lift your hips up, squeezing your glutes at the top.
3. Lower back down under control.$$,
    'Use lighter weight or no weight at all.',
    'Increase the load, or add a pause at the top.'
  ),
  (
    'Standing Hamstring Curl (Machine)', 'legs', 'A single-leg standing machine curl for the hamstrings.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand in the machine with the pad against the back of one lower leg.
2. Curl your leg back and up, squeezing your hamstring.
3. Return under control, then complete all reps before switching sides.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Duck Walk', 'legs', 'A deep-squat walking drill that builds quad endurance and hip mobility.',
    20, 3, 2, 'system', 'approved', true,
    $$1. Squat down as deep as comfortable, keeping your chest up.
2. Walk forward step by step while staying low in the squat.
3. Continue for the target number of steps, then stand up to rest.$$,
    'Squat less deep, or take fewer steps.',
    'Squat deeper, hold a weight at your chest, or take more steps.'
  ),
  (
    'Single-Arm Landmine Press', 'shoulders', 'A standing single-arm press using a landmine barbell, easy on the shoulder joint.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand holding the loaded end of a landmine barbell at shoulder height with one hand.
2. Press it up and slightly forward until your arm is extended.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use less weight, or press from a seated position.',
    'Increase the weight, or press from a half-kneeling stance.'
  ),
  (
    'Bottoms-Up Kettlebell Press', 'shoulders', 'A press holding the kettlebell upside down, demanding serious grip and shoulder stability.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Hold a kettlebell upside down by the handle at shoulder height, gripping it tightly.
2. Press it straight overhead, keeping the bell balanced.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter kettlebell and focus on the grip and balance first.',
    'Increase the weight, or slow the pressing tempo.'
  ),
  (
    'Cable Lateral Raise', 'shoulders', 'A cable version of the lateral raise that keeps constant tension on the side delt.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Stand side-on to a low cable pulley, gripping the handle with the far hand across your body.
2. Raise your arm out to the side until it reaches shoulder height.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Cuban Press', 'shoulders', 'A three-part shoulder exercise combining a high pull, external rotation, and press for shoulder health.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Hold dumbbells at your thighs and pull them up to shoulder height, elbows leading (like an upright row).
2. Rotate your forearms up so the dumbbells point overhead, elbows still at shoulder height.
3. Press the dumbbells overhead, then reverse the whole sequence back down.$$,
    'Use light dumbbells and slow the sequence down to learn the pattern.',
    'Increase the weight slightly, keeping the rotation strict.'
  ),
  (
    'Bradford Press', 'shoulders', 'A shoulder press variation alternating pressing the bar in front of and behind the head without locking out.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Hold a barbell at upper-chest height with a shoulder-width grip.
2. Press it up and slightly back, lowering it behind your head without locking out.
3. Press it back up and forward, lowering it in front to the starting position.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or slow the tempo throughout.'
  ),
  (
    'Behind-the-Neck Press', 'shoulders', 'An overhead press lowering the bar behind the head, requiring good shoulder mobility.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Grip a barbell wide and rest it behind your neck on your upper back.
2. Press it straight overhead until your arms are extended.
3. Lower back down under control behind your neck.$$,
    'Use lighter weight, or use the standard front overhead press instead.',
    'Increase the load, or add a pause at the top.'
  ),
  (
    'Z-Press', 'shoulders', 'A seated overhead press with legs extended on the floor, removing any leg drive to isolate the shoulders.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Sit on the floor with legs extended straight in front of you, holding a bar or dumbbells at shoulder height.
2. Press the weight straight overhead, keeping your torso upright.
3. Lower back down under control to shoulder height.$$,
    'Use lighter weight, or sit with your back against a wall for support.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'Reverse Pec Deck', 'shoulders', 'A machine isolation exercise for the rear delts using the pec deck in reverse.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit facing into the pec deck machine, gripping the handles with arms extended in front of you.
2. Open your arms out to the sides, squeezing your rear delts.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Plate Front Raise', 'shoulders', 'A front delt isolation exercise raising a weight plate straight out in front of you.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Hold a weight plate with both hands in front of your thighs.
2. Raise it straight out in front of you to shoulder height.
3. Lower back down under control.$$,
    'Use a lighter plate and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Y-Raise', 'shoulders', 'An incline raise moving the arms into a Y shape, targeting the lower traps and shoulders.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Lie face-down on an incline bench holding light dumbbells, arms hanging down.
2. Raise your arms up and out into a Y shape above your head.
3. Lower back down under control.$$,
    'Use lighter dumbbells or no weight at all.',
    'Increase the weight slightly, or add a pause at the top.'
  ),
  (
    'W-Raise', 'shoulders', 'A shoulder-health exercise bending the arms into a W shape while squeezing the shoulder blades.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Lie face-down on an incline bench holding light dumbbells, elbows bent at 90 degrees.
2. Raise your arms up and back into a W shape, squeezing your shoulder blades together.
3. Lower back down under control.$$,
    'Use lighter dumbbells or no weight at all.',
    'Increase the weight slightly, or add a pause at the top.'
  ),
  (
    'Scapular Shrug', 'shoulders', 'A subtle shoulder-blade movement drill performed while hanging, building scapular control.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hang from a pull-up bar with arms fully extended.
2. Without bending your elbows, shrug your shoulder blades up toward your ears, then depress them back down.
3. Repeat for the target reps, keeping the movement controlled.$$,
    'Use a resistance band for assistance if a full hang is too difficult.',
    'Add a pause at the bottom of each depression.'
  ),
  (
    'Shoulder Dislocate (Mobility)', 'shoulders', 'A mobility drill passing a band or stick over your head and behind your back to open up the shoulders.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hold a light band or stick with a wide overhand grip in front of you.
2. Keeping your arms straight, raise it overhead and continue behind your back.
3. Reverse the motion back to the starting position.$$,
    'Use a wider grip on the band or stick to reduce the shoulder demand.',
    'Narrow your grip gradually as mobility improves.'
  ),
  (
    'Pike Walk', 'shoulders', 'A walking drill in a pike position that builds shoulder strength and hamstring flexibility.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Start in a downward-dog pike position, hips high, hands and feet on the floor.
2. Walk your hands forward slightly, then walk your feet up to meet them.
3. Repeat this walking pattern forward for the target distance.$$,
    'Take smaller steps, or bend your knees slightly.',
    'Take a longer walking distance, or slow the pace.'
  ),
  (
    'Seated Dumbbell Press', 'shoulders', 'A seated overhead press with back support, a staple shoulder-building movement.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit on a bench with back support, holding a dumbbell in each hand at shoulder height.
2. Press both dumbbells straight overhead until your arms are extended.
3. Lower back down under control to shoulder height.$$,
    'Use lighter dumbbells and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Push Press', 'shoulders', 'An overhead press using a slight leg dip and drive to move more weight than a strict press.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Hold a barbell at shoulder height, feet shoulder-width apart.
2. Dip your knees slightly, then drive up explosively, pressing the bar overhead.
3. Lower back down under control to shoulder height.$$,
    'Use lighter weight and focus on the dip-drive timing.',
    'Increase the load, or slow the lowering phase.'
  ),
  (
    'Push Jerk', 'shoulders', 'An explosive overhead movement using a leg dip-drive followed by re-bending the knees to catch the bar locked out.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Hold a barbell at shoulder height, feet shoulder-width apart.
2. Dip and drive explosively, punching the bar overhead as you drop into a shallow squat.
3. Stand up to lock the bar out fully overhead, then lower back down under control.$$,
    'Practice the push press first, or use lighter weight.',
    'Increase the load, or catch in a deeper squat for more range.'
  ),
  (
    'Kettlebell Overhead Press', 'shoulders', 'A strict overhead press using a kettlebell, which sits differently than a dumbbell against the forearm.',
    8, 3, 1, 'system', 'approved', true,
    $$1. Clean a kettlebell to shoulder height, holding it close to your forearm.
2. Press it straight overhead until your arm is extended.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter kettlebell and press both arms alternately.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'Single-Arm Overhead Press', 'shoulders', 'A unilateral dumbbell press that also challenges core stability against the offset load.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand or sit holding one dumbbell at shoulder height.
2. Press it straight overhead, resisting the urge to lean to the side.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell, or perform seated for more stability.',
    'Increase the weight, or perform standing with a staggered stance.'
  ),
  (
    'Bus Driver', 'shoulders', 'A front-delt and core exercise rotating a weight plate like a steering wheel at arm''s length.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hold a light weight plate with both hands extended in front of you at shoulder height.
2. Rotate the plate like a steering wheel, turning it to one side then the other.
3. Keep your arms extended and shoulders engaged throughout.$$,
    'Use a lighter plate and a smaller rotation range.',
    'Use a heavier plate, or slow the rotation further.'
  ),
  (
    'Lu Raise', 'shoulders', 'A combination raise moving from a lateral raise into an overhead press-like finish.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Hold light dumbbells at your sides.
2. Raise them out to the sides to shoulder height, then rotate and press them up overhead.
3. Reverse the motion back down to the starting position.$$,
    'Use lighter dumbbells and slow the sequence down to learn the pattern.',
    'Increase the weight slightly, keeping the motion controlled.'
  ),
  (
    'Egyptian Lateral Raise', 'shoulders', 'A leaning single-arm lateral raise that increases the range of motion on the side delt.',
    12, 3, 2, 'system', 'approved', true,
    $$1. Hold onto a post with one hand and lean away from it, holding a dumbbell in your other hand.
2. Raise the dumbbell out to the side to shoulder height.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Lean less, or use a lighter dumbbell.',
    'Lean further for more range, or increase the weight.'
  ),
  (
    'Leaning Cable Lateral Raise', 'shoulders', 'A cable lateral raise performed leaning away from the machine for constant tension at the bottom.',
    12, 3, 2, 'system', 'approved', true,
    $$1. Grip a low cable handle and lean your upper body away from the machine, holding onto it with your free hand.
2. Raise your arm out to the side to shoulder height.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Lean less, or use lighter weight.',
    'Lean further, or increase the weight.'
  ),
  (
    'Bent-Over Cable Lateral Raise', 'shoulders', 'A cable rear-delt raise performed hinged forward, keeping tension on through the whole rep.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Hinge forward at the hips in front of a low cable, gripping the handle across your body with the opposite hand.
2. Raise your arm out to the side, squeezing your rear delt.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Machine Lateral Raise', 'shoulders', 'A machine isolation exercise for the side delts with a fixed, guided path.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit in the machine with the pads against the outside of your upper arms.
2. Raise your arms out to the sides to shoulder height.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Barbell Front Raise', 'shoulders', 'A front delt isolation exercise raising a barbell straight out in front of you.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Hold a barbell with both hands in front of your thighs.
2. Raise it straight out in front of you to shoulder height.
3. Lower back down under control.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Landmine Lateral Raise', 'shoulders', 'A lateral raise using a landmine barbell for a unique resistance curve.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand beside a landmine barbell, gripping the loaded end with the far hand.
2. Raise your arm out and up until it reaches shoulder height.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Trap Bar Shrug', 'shoulders', 'A heavy shrug performed inside a trap bar, allowing a more natural arm path than a straight barbell.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand inside a loaded trap bar, gripping the handles at your sides.
2. Shrug your shoulders straight up toward your ears.
3. Lower back down under control without rolling your shoulders.$$,
    'Use lighter weight and focus on the squeeze at the top.',
    'Increase the load, or add a pause at the top.'
  ),
  (
    'Overhead Carry', 'shoulders', 'A loaded carry holding weight overhead, building shoulder stability and core strength together.',
    30, 3, 2, 'system', 'approved', true,
    $$1. Press a dumbbell or kettlebell overhead until your arm is locked out.
2. Walk forward for the target distance or time, keeping the weight stable overhead.
3. Lower it down under control at the end, then repeat on the other side.$$,
    'Use a lighter weight or walk for a shorter distance.',
    'Increase the weight, walk further, or carry weight overhead in both hands.'
  ),
  (
    'Wall Slide (Shoulder Mobility)', 'shoulders', 'A mobility drill sliding your arms up a wall to improve overhead shoulder positioning.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand with your back against a wall, arms bent and pressed against it at shoulder height.
2. Slide your arms up the wall as high as you can while maintaining contact.
3. Slide back down under control and repeat.$$,
    'Reduce the range of motion, or step away from the wall slightly.',
    'Hold the top position longer, or add light resistance bands.'
  ),
  (
    'Spider Curl', 'arms', 'A strict biceps curl performed leaning chest-first over an incline bench, eliminating momentum.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Lie chest-down on an incline bench, arms hanging straight down holding dumbbells or a bar.
2. Curl the weight up toward your shoulders, keeping your upper arms still.
3. Lower back down under control to full extension.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the load, or add a pause at the top.'
  ),
  (
    'Zottman Curl', 'arms', 'A curl that trains both the biceps on the way up and the forearms on the way down.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand holding dumbbells with palms facing up.
2. Curl the dumbbells up toward your shoulders.
3. Rotate your palms to face down at the top, then lower slowly with palms down.$$,
    'Use lighter dumbbells and slow the rotation down to learn the pattern.',
    'Increase the weight, or slow the lowering phase further.'
  ),
  (
    'Cable Curl', 'arms', 'A biceps curl using a low cable, which keeps constant tension through the whole rep.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand facing a low cable with a straight or EZ bar attached.
2. Curl the bar up toward your shoulders, keeping your elbows still.
3. Lower back down under control to full extension.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Drag Curl', 'arms', 'A curl variation dragging the bar up the torso, keeping elbows behind the body for a different biceps emphasis.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hold a barbell with an underhand grip in front of your thighs.
2. Curl it up while dragging it along your torso, letting your elbows drift back.
3. Lower back down under control along the same path.$$,
    'Use lighter weight and focus on the unfamiliar path first.',
    'Increase the load, or slow the lowering phase.'
  ),
  (
    '21s', 'arms', 'A biceps burnout technique combining bottom-half, top-half, and full-range reps in one set.',
    21, 3, 2, 'system', 'approved', true,
    $$1. Hold a barbell with an underhand grip and curl through the bottom half of the range for 7 reps.
2. Curl through the top half of the range for 7 reps.
3. Finish with 7 full-range reps.$$,
    'Use lighter weight, or reduce each segment to 5 reps.',
    'Increase the weight, or slow every rep down.'
  ),
  (
    'Incline Dumbbell Curl', 'arms', 'A curl performed lying back on an incline bench, which increases the stretch on the biceps.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit back on an incline bench holding a dumbbell in each hand, arms hanging straight down.
2. Curl the dumbbells up toward your shoulders.
3. Lower back down under control to a full stretch.$$,
    'Use lighter dumbbells and a smaller range of motion.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'EZ-Bar Curl', 'arms', 'A curl using an angled EZ-bar, which is easier on the wrists than a straight bar.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand holding an EZ-bar with an underhand grip on the angled sections.
2. Curl the bar up toward your shoulders, keeping your elbows still.
3. Lower back down under control to full extension.$$,
    'Use lighter weight, an EZ-bar, or dumbbells for comfort.',
    'Increase the load, or add a pause at the top.'
  ),
  (
    'Reverse Curl', 'arms', 'A curl with palms facing down, targeting the forearms and brachialis more than a standard curl.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a barbell or EZ-bar with an overhand grip.
2. Curl the bar up toward your shoulders, keeping your palms facing down throughout.
3. Lower back down under control to full extension.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the load, or slow the lowering phase.'
  ),
  (
    'Wrist Curl', 'arms', 'A forearm isolation exercise curling the wrist upward while the forearm rests on a bench.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Rest your forearms on a bench, wrists hanging off the edge, holding a barbell or dumbbells with palms up.
2. Curl your wrists up as far as you can.
3. Lower back down under control to a full stretch.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Reverse Wrist Curl', 'arms', 'A forearm isolation exercise curling the wrist upward with palms facing down.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Rest your forearms on a bench, wrists hanging off the edge, holding a barbell or dumbbells with palms down.
2. Extend your wrists up as far as you can.
3. Lower back down under control to a full stretch.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'JM Press', 'arms', 'A hybrid triceps exercise between a close-grip bench press and a skull crusher.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Lie on a flat bench holding a barbell with a close, shoulder-width grip.
2. Lower the bar toward your upper chest/chin, letting your elbows travel forward slightly.
3. Press back up to full extension, driving through your triceps.$$,
    'Use lighter weight and reduce the range of motion.',
    'Increase the load, or add a pause at the bottom.'
  ),
  (
    'Tate Press', 'arms', 'A triceps isolation exercise lowering dumbbells to the chest with elbows flared out.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Lie on a flat bench holding a dumbbell in each hand above your chest, palms facing your feet.
2. Lower the dumbbells toward your chest by bending your elbows out to the sides.
3. Press back up to full extension.$$,
    'Use lighter dumbbells and reduce the range of motion.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'Rope Overhead Triceps Extension', 'arms', 'A cable triceps exercise extending a rope attachment overhead, targeting the long head of the triceps.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Face away from a low cable with a rope attachment, holding it behind your head with elbows bent.
2. Extend your arms forward and up until they're straight.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at full extension.'
  ),
  (
    'French Press', 'arms', 'A standing or seated overhead triceps extension using a barbell or EZ-bar.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hold a barbell or EZ-bar overhead with a shoulder-width grip.
2. Lower it behind your head by bending your elbows.
3. Extend your arms back up to full extension.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the load, or slow the lowering phase.'
  ),
  (
    'Concentration Curl', 'arms', 'A seated single-arm curl bracing your elbow against your thigh for strict isolation.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit on a bench and brace one elbow against the inside of your thigh, holding a dumbbell.
2. Curl the dumbbell up toward your shoulder.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Cable Rope Hammer Curl', 'arms', 'A hammer curl using a rope attachment on a low cable for constant tension.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand facing a low cable with a rope attachment, palms facing each other.
2. Curl the rope up toward your shoulders, keeping your palms facing in.
3. Lower back down under control to full extension.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Preacher Machine Curl', 'arms', 'A machine-based preacher curl that isolates the biceps with a fixed, guided path.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit in the preacher curl machine with your upper arms resting on the pad.
2. Curl the handles up toward your shoulders.
3. Lower back down under control to just short of full lockout.$$,
    'Reduce the weight and stop short of full extension.',
    'Increase the load, or add a pause at the top.'
  ),
  (
    'Single-Arm Triceps Pushdown', 'arms', 'A unilateral cable pushdown that lets you focus on each arm''s triceps individually.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand facing a cable machine with a single handle attached at the top.
2. Push the handle down until your arm is fully extended, keeping your elbow tucked.
3. Let it return under control, then complete all reps before switching sides.$$,
    'Reduce the weight stack and keep your elbow pinned to your side.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Weighted Bench Dip', 'arms', 'A bench dip with added weight on your lap for more triceps overload.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Sit on the edge of a bench with a weight plate on your lap, hands gripping the edge beside your hips.
2. Lower your hips toward the floor by bending your elbows.
3. Press back up through your palms to the starting position.$$,
    'Reduce the added weight, or remove it entirely.',
    'Add more weight, or elevate your feet on another bench.'
  ),
  (
    'Triceps Dip Machine', 'arms', 'A machine-assisted or plate-loaded dip that targets the triceps with a guided path.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit or stand in the dip machine, gripping the handles at your sides.
2. Press down until your arms are extended.
3. Return under control to the starting position.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, or slow the return phase.'
  ),
  (
    'Cross-Body Hammer Curl', 'arms', 'A hammer curl bringing the dumbbell across the body toward the opposite shoulder.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a dumbbell in one hand, palm facing your body.
2. Curl it up and across toward the opposite shoulder.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Waiter''s Curl', 'arms', 'A curl holding a single dumbbell or plate vertically on your palm, like a waiter carrying a tray.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Hold a dumbbell vertically on your open palm, other hand supporting if needed.
2. Curl it up toward your shoulder, keeping it balanced on your palm.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter weight, or hold it with a normal grip instead.',
    'Increase the weight, or remove the supporting hand.'
  ),
  (
    'Seated Dumbbell Curl', 'arms', 'A seated biceps curl that removes any leg drive or body swing.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit on a bench holding a dumbbell in each hand, arms hanging at your sides.
2. Curl both dumbbells up toward your shoulders.
3. Lower back down under control to full extension.$$,
    'Use lighter dumbbells or alternate arms.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'Single-Arm Overhead Dumbbell Extension', 'arms', 'A unilateral overhead triceps extension that helps address strength differences between arms.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Hold a dumbbell overhead with one arm, elbow pointing forward.
2. Lower it behind your head by bending your elbow.
3. Extend back up to full extension, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell and a smaller range of motion.',
    'Increase the weight, or slow the lowering phase.'
  ),
  (
    'Kickback Cable', 'arms', 'A triceps kickback using a low cable instead of a dumbbell for constant tension.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Hinge forward at the hips facing away from a low cable, gripping the handle with your upper arm parallel to the floor.
2. Extend your arm straight back until fully extended.
3. Return under control, then complete all reps before switching sides.$$,
    'Reduce the weight and range of motion.',
    'Increase the weight, or add a pause at full extension.'
  ),
  (
    'Wrist Roller', 'arms', 'A classic forearm and grip exercise winding a weight up on a rope wrapped around a bar.',
    1, 3, 2, 'system', 'approved', true,
    $$1. Hold the wrist roller bar with both hands, arms extended in front of you, weight hanging from the rope.
2. Rotate the bar with your wrists to wind the rope up, raising the weight.
3. Reverse the rotation to slowly lower the weight back down.$$,
    'Use a lighter weight, or only wind partway up.',
    'Increase the weight, or do multiple full wind-ups per set.'
  ),
  (
    'Weighted Plank', 'core', 'A standard plank hold with an added weight plate on your back for extra core demand.',
    30, 3, 2, 'system', 'approved', true,
    $$1. Get into a forearm plank position, body in a straight line from head to heels.
2. Have a partner place a weight plate on your upper back.
3. Hold, keeping your hips level, for the target time.$$,
    'Use a lighter plate, or drop the added weight entirely.',
    'Use a heavier plate, or extend the hold time.'
  ),
  (
    'RKC Plank', 'core', 'A maximal-tension plank variation squeezing every muscle as hard as possible for a shorter hold.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Get into a forearm plank, elbows under shoulders.
2. Squeeze your glutes, quads, and abs as hard as possible, and pull your elbows toward your toes without moving.
3. Hold this maximal-tension position for the target time.$$,
    'Reduce the tension level slightly, or shorten the hold.',
    'Hold the maximal tension longer, or add a shoulder tap.'
  ),
  (
    'Copenhagen Plank', 'core', 'A side plank variation with the top leg supported on a bench, heavily targeting the inner thigh and obliques.',
    20, 3, 3, 'system', 'approved', true,
    $$1. Lie on your side with your top leg's shin or foot resting on a bench, bottom leg free.
2. Prop up on your forearm and lift your hips into a side plank.
3. Hold, keeping your body straight, for the target time, then switch sides.$$,
    'Bend the bottom knee for support, or shorten the hold time.',
    'Straighten the bottom leg fully, or extend the hold time.'
  ),
  (
    'Cable Crunch', 'core', 'A kneeling ab exercise crunching down against a high cable''s resistance.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Kneel facing away from a high cable with a rope attachment held behind your head.
2. Crunch your torso down, bringing your elbows toward your knees.
3. Return under control to the starting position, keeping tension on your abs.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Decline Sit-up', 'core', 'A sit-up performed on a decline bench for extra range of motion and resistance.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Secure your feet on a decline bench and lie back with knees bent.
2. Curl your torso up to a sitting position.
3. Lower back down under control to the starting position.$$,
    'Use a lower decline angle, or reduce the range of motion.',
    'Increase the decline angle, or hold a weight across your chest.'
  ),
  (
    'Sit-up', 'core', 'A classic full-range core exercise curling the whole torso up to a seated position.',
    20, 3, 1, 'system', 'approved', true,
    $$1. Lie on your back with knees bent, feet flat, hands resting lightly behind your head or crossed on your chest.
2. Curl your torso up to a sitting position.
3. Lower back down under control to the starting position.$$,
    'Reduce the range of motion, or use your arms for a small assist.',
    'Hold a weight across your chest, or slow the tempo.'
  ),
  (
    'Flutter Kicks', 'core', 'A lower-ab exercise alternating small, rapid leg kicks while lying on your back.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Lie on your back with your lower back pressed into the floor, legs extended and lifted slightly.
2. Alternate kicking your legs up and down in small, quick movements.
3. Continue for the target number of kicks, keeping your lower back pinned down.$$,
    'Lift your legs higher to reduce the lower-back demand, or bend your knees slightly.',
    'Lower your legs closer to the floor, or extend the duration.'
  ),
  (
    'Lying Leg Raise', 'core', 'A lower-ab exercise raising straight legs from the floor to vertical.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Lie on your back with legs extended straight, hands at your sides or under your hips for support.
2. Raise your legs up until they're vertical, keeping your lower back on the floor.
3. Lower back down under control without letting your feet touch the floor between reps.$$,
    'Bend your knees to reduce the lever arm, or reduce the range of motion.',
    'Add ankle weights, or slow the lowering phase further.'
  ),
  (
    'Hanging Windshield Wipers', 'core', 'An advanced hanging core exercise rotating raised legs side to side, heavily targeting the obliques.',
    8, 3, 3, 'system', 'approved', true,
    $$1. Hang from a pull-up bar and raise your legs up in front of you.
2. Rotate your legs together to one side, then sweep them across to the other side.
3. Continue alternating sides under control, keeping your grip and shoulders stable.$$,
    'Bend your knees to shorten the lever, or reduce the rotation range.',
    'Keep your legs fully straight, or slow the rotation further.'
  ),
  (
    'Stir the Pot', 'core', 'A stability-ball plank variation moving your forearms in small circles for serious core control.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Rest your forearms on a stability ball in a plank position, body straight.
2. Move your forearms in a small circular motion, like stirring a pot.
3. Complete circles in one direction, then reverse, keeping your hips stable throughout.$$,
    'Use smaller circles, or brace your feet wider for stability.',
    'Use bigger circles, or narrow your foot stance.'
  ),
  (
    'Landmine Rotation', 'core', 'A standing rotational core exercise sweeping a landmine barbell across the body.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand holding the loaded end of a landmine barbell with both hands, arms extended in front of you.
2. Rotate your torso and arms to sweep the bar down to one hip.
3. Reverse the motion to sweep it across to the other side.$$,
    'Use lighter weight and a smaller rotation range.',
    'Increase the weight, or slow the rotation further.'
  ),
  (
    'Suitcase Carry', 'core', 'A single-sided loaded carry that trains anti-lateral-flexion core strength.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Hold a heavy dumbbell or kettlebell in one hand at your side, standing tall.
2. Walk forward for the target distance or time, resisting the urge to lean to one side.
3. Set the weight down, then repeat carrying on the other side.$$,
    'Use a lighter weight or walk a shorter distance.',
    'Increase the weight, or walk further.'
  ),
  (
    'Side Bend', 'core', 'A simple standing oblique exercise bending sideways while holding a weight.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a dumbbell in one hand at your side.
2. Bend sideways at the waist, lowering the dumbbell down your leg.
3. Return to standing, squeezing your obliques, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell and a smaller range of motion.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Standing Cable Woodchopper', 'core', 'A rotational core exercise chopping a high cable down across the body, like swinging an axe.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand side-on to a high cable, gripping the handle with both hands.
2. Rotate your torso and pull the handle down and across your body to the opposite hip.
3. Return under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a smaller rotation range.',
    'Increase the weight, or slow the return phase.'
  ),
  (
    'Kneeling Cable Crunch', 'core', 'A variation of the cable crunch performed more upright, shifting emphasis slightly differently.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Kneel below a high cable with a rope attachment held at your forehead.
2. Crunch forward and down, rounding your spine and bringing your elbows toward your thighs.
3. Return under control to the starting position.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Weighted Russian Twist', 'core', 'A rotational core exercise twisting a weight plate or dumbbell side to side while seated.',
    20, 3, 2, 'system', 'approved', true,
    $$1. Sit on the floor with knees bent, leaning back slightly, holding a weight plate with both hands.
2. Lift your feet slightly off the floor for more challenge.
3. Rotate the weight to touch the floor on one side, then the other.$$,
    'Keep your feet on the floor, or use a lighter weight.',
    'Increase the weight, or lift your feet higher off the floor.'
  ),
  (
    'Toe-to-Bar', 'core', 'An advanced hanging core exercise bringing your toes all the way up to touch the bar.',
    8, 3, 3, 'system', 'approved', true,
    $$1. Hang from a pull-up bar with arms fully extended.
2. Raise your straight (or slightly bent) legs all the way up to touch the bar.
3. Lower back down under control without swinging.$$,
    'Bend your knees and bring them to your chest instead of touching the bar.',
    'Keep your legs fully straight throughout, or slow the descent.'
  ),
  (
    'Dragon Flag', 'core', 'An advanced full-body core exercise lowering your straight body from a shoulder-supported position.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Lie on a bench and grip behind your head for support, raising your whole body up onto your shoulders.
2. Lower your body down as one straight unit, keeping your hips and knees locked.
3. Stop just above the bench, then raise back up under control.$$,
    'Bend your knees to shorten the lever, or reduce the range of motion.',
    'Keep your body fully straight, or slow the lowering phase further.'
  ),
  (
    'L-Sit', 'core', 'An isometric hold supporting your body on your hands with legs extended out in an L shape.',
    15, 3, 3, 'system', 'approved', true,
    $$1. Support yourself on parallel bars or the floor with arms straight.
2. Raise your legs straight out in front of you, forming an L shape with your body.
3. Hold this position, keeping your legs raised, for the target time.$$,
    'Bend one or both knees to reduce the lever arm, or shorten the hold.',
    'Raise your legs higher into a V-sit, or extend the hold time.'
  ),
  (
    'Plank Shoulder Taps', 'core', 'A plank variation tapping opposite shoulders to challenge anti-rotation stability.',
    20, 3, 1, 'system', 'approved', true,
    $$1. Get into a high plank position, hands under shoulders, feet wide for stability.
2. Tap one hand to the opposite shoulder without letting your hips rotate.
3. Return that hand down and repeat with the other hand.$$,
    'Widen your feet further for more stability, or slow the pace.',
    'Narrow your feet, or increase the pace.'
  ),
  (
    'Bear Crawl Hold', 'core', 'An isometric hold in a bear crawl position, building shoulder and core stability together.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Get on all fours with knees hovering an inch off the floor, hands under shoulders.
2. Hold this position, keeping your back flat and core braced.
3. Hold for the target time without letting your knees touch down.$$,
    'Let your knees rest lightly on the floor between holds.',
    'Extend the hold time, or lift one hand or foot briefly.'
  ),
  (
    'Weighted Sit-up', 'core', 'A sit-up holding a weight plate against your chest for extra resistance.',
    12, 3, 2, 'system', 'approved', true,
    $$1. Lie on your back with knees bent, holding a weight plate against your chest.
2. Curl your torso up to a sitting position.
3. Lower back down under control to the starting position.$$,
    'Use a lighter plate or no added weight.',
    'Increase the weight, or hold the plate further from your chest.'
  ),
  (
    'Half-Kneeling Pallof Press', 'core', 'A Pallof press performed from a half-kneeling stance, adding a hip-stability demand.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Kneel on one knee, side-on to a cable or band anchored at chest height, holding the handle at your chest.
2. Press the handle straight out in front of you, resisting the rotation.
3. Bring it back to your chest under control, then complete all reps before switching sides and legs.$$,
    'Use lighter resistance, or perform standing instead of half-kneeling.',
    'Increase the resistance, or add a pause at full extension.'
  ),
  (
    'V-Sit Hold', 'core', 'An isometric core hold balancing on your seat with both arms and legs raised in a V shape.',
    20, 3, 2, 'system', 'approved', true,
    $$1. Sit on the floor and lean back slightly, lifting your feet and extending your legs.
2. Extend your arms forward for balance, forming a V shape with your torso and legs.
3. Hold this position for the target time.$$,
    'Bend your knees, or hold onto the backs of your thighs for support.',
    'Straighten your legs further, or extend the hold time.'
  ),
  (
    'Seated Knee Tuck', 'core', 'A seated core exercise alternating extending and tucking the legs while balancing on your seat.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Sit on the floor, leaning back slightly, hands braced behind you or extended forward for balance.
2. Extend your legs straight out, then tuck your knees back toward your chest.
3. Continue alternating for the target reps, keeping your balance throughout.$$,
    'Keep your hands braced on the floor for more support.',
    'Remove your hands from the floor, or slow the tempo.'
  ),
  (
    'Swiss Ball Crunch', 'core', 'A crunch performed on a stability ball, which increases the range of motion compared to the floor.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Sit on a stability ball and walk your feet forward until your lower back rests on the ball.
2. Crunch your torso up, curling your ribs toward your hips.
3. Lower back down under control to a full stretch over the ball.$$,
    'Reduce the range of motion, or place your feet wider for stability.',
    'Hold a weight across your chest, or add a pause at the top.'
  ),
  (
    'Swiss Ball Pike', 'core', 'An advanced rolling core exercise piking your hips up with your shins on a stability ball.',
    10, 3, 3, 'system', 'approved', true,
    $$1. Get into a push-up position with your shins resting on a stability ball.
2. Roll the ball toward your hands by piking your hips up, keeping your legs straight.
3. Roll back out under control to the starting position.$$,
    'Reduce the range of motion, or use a larger, more stable ball.',
    'Slow the tempo, or add a push-up between reps.'
  ),
  (
    'Assault Bike', 'cardio', 'A full-body air-resistance bike that scales intensity purely with your own effort.',
    60, 3, 1, 'system', 'approved', true,
    $$1. Sit on the bike and grip the moving handles, feet on the pedals.
2. Pedal and push/pull the handles together at a steady pace.
3. Increase your pace for the target interval, then recover before the next set.$$,
    'Reduce the pace or interval length.',
    'Increase the pace, or extend the interval.'
  ),
  (
    'Ski Erg', 'cardio', 'A full-body cardio machine mimicking the double-pole skiing motion.',
    60, 3, 1, 'system', 'approved', true,
    $$1. Stand facing the ski erg, gripping a handle in each hand at the top.
2. Pull both handles down and back, hinging at the hips and bending your knees slightly.
3. Let the handles return up under control and repeat.$$,
    'Reduce the pace or resistance setting.',
    'Increase the pace, or add more resistance.'
  ),
  (
    'Stair Climber', 'cardio', 'A steady-state cardio machine simulating continuous stair climbing.',
    60, 3, 1, 'system', 'approved', true,
    $$1. Step onto the machine and hold the rails lightly for balance.
2. Step continuously, keeping an upright posture rather than leaning on the rails.
3. Maintain a steady pace for the target time.$$,
    'Reduce the speed, or hold the rails more for support.',
    'Increase the speed, or let go of the rails entirely.'
  ),
  (
    'Treadmill Incline Walk', 'cardio', 'A low-impact cardio session walking briskly on an inclined treadmill.',
    60, 3, 1, 'system', 'approved', true,
    $$1. Set the treadmill to a moderate incline and a brisk walking pace.
2. Walk tall without holding onto the handrails.
3. Maintain the pace for the target time.$$,
    'Reduce the incline or the pace.',
    'Increase the incline, the pace, or the duration.'
  ),
  (
    'Shuttle Runs', 'cardio', 'A repeated sprint drill between two markers, building speed and change-of-direction conditioning.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Set two markers a set distance apart.
2. Sprint from one marker to the other, touching the ground or line each time.
3. Turn and sprint back, repeating for the target number of shuttles.$$,
    'Reduce the distance or the number of shuttles.',
    'Increase the distance, the pace, or the number of shuttles.'
  ),
  (
    'Bear Crawl', 'cardio', 'A full-body crawling movement that builds conditioning, coordination, and shoulder stability.',
    30, 3, 2, 'system', 'approved', true,
    $$1. Get on all fours with knees hovering just off the floor.
2. Crawl forward moving opposite hand and foot together, keeping your back flat.
3. Continue for the target distance or time.$$,
    'Move slower, or let your knees touch down between steps.',
    'Increase the pace, or crawl backward or sideways.'
  ),
  (
    'Sled Drag', 'cardio', 'A backward-walking sled drag that heavily targets the quads and builds conditioning.',
    20, 3, 2, 'system', 'approved', true,
    $$1. Attach a harness or rope to a loaded sled and face away from it.
2. Walk backward in controlled steps, keeping tension on the rope or straps.
3. Continue for the target distance, then reset and repeat.$$,
    'Use lighter weight and a shorter distance.',
    'Increase the weight, or drag for a longer distance.'
  ),
  (
    'Tire Flip', 'cardio', 'A full-body power exercise flipping a heavy tire end over end.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Squat down and grip the underside of the tire with both hands.
2. Drive through your legs and hips to flip the tire up and over.
3. Reset your grip on the other side and repeat for the target reps.$$,
    'Use a lighter tire, or fewer reps.',
    'Use a heavier tire, or increase the pace between flips.'
  ),
  (
    'Sledgehammer Slam', 'cardio', 'A high-intensity, full-body exercise swinging a sledgehammer down onto a tire.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Stand over a tire holding a sledgehammer with both hands.
2. Raise the hammer overhead, then swing it down forcefully onto the tire.
3. Let it bounce back up and repeat, alternating sides if desired.$$,
    'Use a lighter hammer, or reduce the swing power.',
    'Use a heavier hammer, or increase the pace.'
  ),
  (
    'Wall Ball Shot', 'cardio', 'A squat-to-throw exercise using a medicine ball against a wall target, common in conditioning workouts.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Hold a medicine ball at your chest, standing a couple of feet from a wall.
2. Squat down, then drive up explosively, throwing the ball to a target on the wall.
3. Catch the ball as it rebounds and immediately drop into the next squat.$$,
    'Use a lighter ball, or throw to a lower target.',
    'Use a heavier ball, or throw to a higher target.'
  ),
  (
    'Broad Jump', 'cardio', 'An explosive horizontal jump for distance, building lower-body power.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Stand with feet shoulder-width apart, swinging your arms back and bending your knees.
2. Jump forward as far as you can, swinging your arms forward for momentum.
3. Land softly with bent knees, then reset and repeat.$$,
    'Jump for less distance, or land and pause before resetting.',
    'Jump for maximum distance, or chain jumps together without resetting.'
  ),
  (
    'Lateral Bound', 'cardio', 'An explosive side-to-side jump that builds lateral power and ankle stability.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Stand on one leg, then jump sideways as far as you can onto the other leg.
2. Stick the landing, absorbing the impact with a soft knee bend.
3. Immediately jump back the other way, continuing side to side.$$,
    'Jump a shorter distance, or pause and reset between jumps.',
    'Jump further, or chain jumps together without pausing.'
  ),
  (
    'Agility Ladder Drill', 'cardio', 'A footwork drill through a floor ladder, building speed, coordination, and conditioning.',
    4, 3, 1, 'system', 'approved', true,
    $$1. Lay an agility ladder flat on the ground.
2. Move quickly through each rung using short, precise foot placements (e.g. one foot per square).
3. Continue through the full length of the ladder, then walk back and repeat.$$,
    'Slow the pace, or use a simpler footwork pattern.',
    'Increase the pace, or use a more complex footwork pattern.'
  ),
  (
    'Jumping Jacks', 'cardio', 'A classic full-body cardio warm-up movement jumping the feet and arms out and in.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Stand with feet together and arms at your sides.
2. Jump your feet out wide while raising your arms overhead.
3. Jump back to the starting position and repeat at a steady pace.$$,
    'Step side to side instead of jumping, or slow the pace.',
    'Increase the pace, or add a small squat at the bottom.'
  ),
  (
    'High Knees', 'cardio', 'A running-in-place drill driving your knees up high, building conditioning and hip flexor strength.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Stand tall and jog in place, driving your knees up toward your chest.
2. Pump your arms in rhythm with your legs.
3. Continue at a quick pace for the target time.$$,
    'Slow the pace, or reduce how high you drive your knees.',
    'Increase the pace, or drive your knees higher.'
  ),
  (
    'Butt Kicks', 'cardio', 'A running-in-place drill kicking your heels up toward your glutes.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Stand tall and jog in place, kicking your heels back up toward your glutes.
2. Pump your arms in rhythm with your legs.
3. Continue at a quick pace for the target time.$$,
    'Slow the pace, or reduce how high you kick your heels.',
    'Increase the pace, or kick your heels higher.'
  ),
  (
    'Skater Jumps', 'cardio', 'A lateral bounding drill mimicking a speed skater''s stride, building agility and leg power.',
    20, 3, 2, 'system', 'approved', true,
    $$1. Stand on one leg, then leap sideways, landing on the opposite leg with the trailing leg swept behind you.
2. Immediately push off and leap back the other way.
3. Continue alternating sides at a controlled but athletic pace.$$,
    'Reduce the jump distance, or slow the pace.',
    'Increase the jump distance and speed, or add a pause on each landing.'
  ),
  (
    'Star Jumps', 'cardio', 'An explosive jump spreading your arms and legs out into a star shape at the top.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Start in a quarter-squat position with arms at your sides.
2. Jump explosively, spreading your arms and legs out into a star shape mid-air.
3. Land softly back in the quarter-squat position and repeat.$$,
    'Reduce the jump height, or do a jumping jack instead.',
    'Jump higher, or increase the pace.'
  ),
  (
    'Suicide Sprints', 'cardio', 'A progressive shuttle-sprint drill touching increasingly distant lines and returning each time.',
    5, 3, 2, 'system', 'approved', true,
    $$1. Set up multiple lines at increasing distances from a starting point.
2. Sprint to the first line, touch it, and sprint back to the start.
3. Sprint to each successive line and back, going one line further each time.$$,
    'Use fewer or closer lines.',
    'Use more or farther lines, or increase your sprint speed.'
  ),
  (
    'Sandbag Carry', 'cardio', 'A loaded carry using an unstable sandbag, building grip, core, and conditioning together.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Pick up a sandbag and hug it against your chest or rest it on one shoulder.
2. Walk forward for the target distance or time, keeping your core braced.
3. Set the bag down under control at the end.$$,
    'Use a lighter sandbag or walk a shorter distance.',
    'Use a heavier sandbag, or walk further.'
  ),
  (
    'Prowler Sprint', 'cardio', 'A fast-paced sled push performed at a sprinting effort for a short, intense conditioning burst.',
    15, 3, 2, 'system', 'approved', true,
    $$1. Load a sled with a light-to-moderate weight and grip the handles at hip height.
2. Drive forward as fast as you can in short, powerful steps.
3. Push for the target distance, then rest and repeat.$$,
    'Use lighter weight, or push for a shorter distance.',
    'Increase the weight, or push for a longer distance at full speed.'
  ),
  (
    'Medicine Ball Slam', 'cardio', 'An explosive full-body exercise slamming a medicine ball into the ground as hard as possible.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Hold a medicine ball overhead with both hands, feet shoulder-width apart.
2. Slam the ball down into the ground as hard as you can, bending your knees and hips.
3. Catch the rebound or pick the ball back up and repeat.$$,
    'Use a lighter ball, or reduce the slam power.',
    'Use a heavier ball, or increase the pace.'
  ),
  (
    'Stationary Bike Sprint', 'cardio', 'Short, maximal-effort intervals on a stationary bike for cardiovascular conditioning.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Set the bike to a moderate resistance and warm up pedaling for a minute.
2. Sprint at maximum effort for the target interval.
3. Slow to an easy pace to recover before the next interval.$$,
    'Reduce the resistance or sprint interval length.',
    'Increase the resistance, or extend the sprint interval.'
  ),
  (
    'Bear Hug Carry', 'cardio', 'A loaded carry hugging an awkward object like a sandbag or atlas stone against your chest.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Bear hug a sandbag or heavy, awkward object tightly against your chest.
2. Walk forward for the target distance or time, keeping your core braced.
3. Set it down under control at the end.$$,
    'Use a lighter object or walk a shorter distance.',
    'Use a heavier object, or walk further.'
  ),
  (
    'Dumbbell Floor Fly', 'push', 'A chest fly performed lying on the floor, which limits the range of motion and protects the shoulders.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Lie on the floor holding a dumbbell in each hand above your chest, elbows slightly bent.
2. Lower the dumbbells out to the sides until your upper arms touch the floor.
3. Bring them back together above your chest, squeezing your pecs.$$,
    'Use lighter dumbbells and reduce the range of motion.',
    'Increase the weight, or add a pause at the bottom.'
  ),
  (
    'Incline Cable Fly', 'push', 'A cable fly performed on an incline bench to emphasize the upper chest.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Set an incline bench between two low cable pulleys and lie back, gripping a handle in each hand.
2. Press your arms up and together above your upper chest in an arcing motion.
3. Lower back down under control to a full stretch.$$,
    'Use lighter weight and a shorter range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Wide-Grip Cable Row', 'pull', 'A seated cable row using a wide bar attachment to emphasize the upper back.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit at the cable row station gripping a wide bar attachment.
2. Pull the bar toward your upper chest, leading with your elbows high and wide.
3. Extend back out under control to a full stretch.$$,
    'Reduce the weight and use a shorter range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Single-Arm Cable Row', 'pull', 'A unilateral cable row that lets you focus on each side of the back individually.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit at a low cable station and grip a single handle with one hand, torso upright.
2. Pull the handle toward your ribs, squeezing your shoulder blade back.
3. Extend back out under control, then complete all reps before switching sides.$$,
    'Reduce the weight and use a shorter range of motion.',
    'Increase the weight, or add a pause at full contraction.'
  ),
  (
    'Dumbbell Split Squat', 'legs', 'A stationary split-stance squat holding dumbbells, building single-leg strength.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand in a split stance, one foot well in front of the other, holding a dumbbell in each hand.
2. Lower your back knee toward the floor, keeping your front knee over your ankle.
3. Push through your front heel to return to standing, then complete all reps before switching legs.$$,
    'Use lighter dumbbells or reduce the range of motion.',
    'Increase the weight, or elevate your front foot slightly.'
  ),
  (
    'Banded Lateral Walk', 'legs', 'A hip and glute activation drill stepping sideways against a resistance band.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Loop a resistance band around your legs, just above the knees or ankles.
2. Get into a quarter-squat position and step sideways, keeping tension on the band.
3. Continue stepping in one direction for the target reps, then switch directions.$$,
    'Use a lighter band, or stand more upright.',
    'Use a heavier band, or squat deeper while stepping.'
  ),
  (
    'Cable Y-Raise', 'shoulders', 'A cable version of the Y-raise, keeping constant tension on the shoulders and lower traps.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand facing away from a low cable, gripping the handle with one hand.
2. Raise your arm up and out at a diagonal into a Y position.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Behind-the-Back Cable Curl', 'arms', 'A biceps curl pulling a low cable from behind the body for a unique stretch and contraction.',
    12, 3, 2, 'system', 'approved', true,
    $$1. Stand facing away from a low cable, gripping the handle behind your hip with one hand, palm forward.
2. Curl the handle up toward your shoulder.
3. Lower back down under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a pause at the top.'
  ),
  (
    'Standing Ab Rollout', 'core', 'An advanced progression of the ab wheel rollout performed from standing instead of kneeling.',
    8, 3, 3, 'system', 'approved', true,
    $$1. Stand holding an ab wheel with both hands, feet hip-width apart.
2. Brace your core and roll the wheel forward, lowering your torso toward the floor.
3. Pull back to standing using your core, not your lower back.$$,
    'Master the kneeling ab wheel rollout first, or only roll out partway.',
    'Roll out further, or slow the return phase.'
  ),
  (
    'Seated Cable Twist', 'core', 'A seated rotational core exercise pulling a cable across the body from a stable base.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Sit side-on to a low cable, gripping the handle with both hands at chest height.
2. Rotate your torso away from the machine, keeping your hips square.
3. Return under control, then complete all reps before switching sides.$$,
    'Use lighter weight and a smaller rotation range.',
    'Increase the weight, or slow the return phase.'
  );
