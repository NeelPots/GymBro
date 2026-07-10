-- Phase 4: expands the exercise library further - more push/pull/legs
-- coverage, plus three brand-new categories (shoulders, arms, cardio).
-- Run this after supabase/seed_library.sql. Mirrors
-- src/lib/adaptive/defaultExercises.ts so local mode and a live project
-- agree. video_url stays null everywhere - see README for how to add real
-- demo videos later.

insert into public.exercises (name, category, description, default_reps, default_sets, difficulty_tier, source, moderation_status, is_public, instructions, easier_variation, harder_variation)
values
  (
    'Decline Bench Press', 'push', 'A barbell press on a decline bench that emphasizes the lower chest.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Set a bench to a slight decline and lock your feet under the pads.
2. Grip the bar slightly wider than shoulder-width and unrack it over your lower chest.
3. Lower the bar under control to your lower chest, then press back up to full extension.$$,
    'Use lighter weight or dumbbells for a more natural pressing path.',
    'Increase the load, add a pause at the chest, or slow the lowering tempo.'
  ),
  (
    'Dumbbell Chest Fly', 'push', 'An isolation move for the chest performed lying on a flat bench with a wide arcing motion.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Lie on a flat bench holding a dumbbell in each hand above your chest, palms facing each other, elbows slightly bent.
2. Lower the dumbbells out to the sides in a wide arc until you feel a stretch across your chest.
3. Bring the dumbbells back together above your chest, squeezing your pecs at the top.$$,
    'Use lighter dumbbells and reduce the range of motion.',
    'Increase the weight, add a pause at the bottom stretch, or try it on an incline bench.'
  ),
  (
    'Cable Crossover', 'push', 'A cable isolation exercise that keeps constant tension on the chest through a full range of motion.',
    12, 3, 2, 'system', 'approved', true,
    $$1. Set both cable pulleys above head height and grip a handle in each hand.
2. Step forward with a slight forward lean and a soft bend in your elbows.
3. Bring your hands together in front of your hips in a wide arcing motion, squeezing your chest at the bottom.$$,
    'Use lighter weight and set the pulleys at chest height for a shorter range.',
    'Increase the weight, or set the pulleys lower and cross your hands over at the bottom.'
  ),
  (
    'Close-Grip Bench Press', 'push', 'A bench press variation with hands closer together that shifts emphasis onto the triceps.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Lie on a flat bench and grip the bar with hands just inside shoulder-width.
2. Unrack the bar and lower it under control to your lower chest, keeping your elbows tucked.
3. Press back up to full extension, focusing on driving through your triceps.$$,
    'Use lighter weight or dumbbells held close together.',
    'Increase the load, add a pause at the chest, or slow the lowering phase.'
  ),
  (
    'Floor Press', 'push', 'A pressing variation performed lying on the floor that limits range of motion and protects the shoulders.',
    8, 3, 1, 'system', 'approved', true,
    $$1. Lie on the floor with knees bent, feet flat, holding a barbell or dumbbells over your chest.
2. Lower your upper arms until your elbows touch the floor, then pause briefly.
3. Press back up to full extension without arching your lower back off the floor.$$,
    'Use lighter weight and focus on a controlled, pain-free range.',
    'Increase the load, add a 2-second pause at the bottom, or use a single arm at a time.'
  ),
  (
    'Machine Chest Press', 'push', 'A guided pressing machine that lets you focus purely on the chest without balancing free weight.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Adjust the seat so the handles line up with your mid-chest.
2. Press the handles forward to full arm extension without locking your elbows out hard.
3. Return under control back to the starting position.$$,
    'Reduce the weight stack and use a partial range of motion.',
    'Increase the weight, slow the return phase, or press one arm at a time.'
  ),
  (
    'Single-Arm Dumbbell Row', 'pull', 'A unilateral rowing exercise that lets you focus on each side of the back individually.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Place one knee and hand on a bench, keeping your back flat and parallel to the floor.
2. Hold a dumbbell in your free hand, arm fully extended toward the floor.
3. Pull the dumbbell up toward your hip, driving your elbow back and squeezing your shoulder blade.
4. Lower back down under control, then complete all reps before switching sides.$$,
    'Use a lighter dumbbell or reduce the range of motion.',
    'Increase the weight, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'T-Bar Row', 'pull', 'A heavy compound row performed with a landmine or T-bar attachment.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Straddle the bar with a chest-supported or hinged torso position, knees slightly bent.
2. Grip the handles and pull the weight up toward your chest, squeezing your shoulder blades together.
3. Lower back down under control without rounding your back.$$,
    'Use lighter weight, or perform it chest-supported on an incline bench for stability.',
    'Increase the load, add a pause at the top, or slow the eccentric.'
  ),
  (
    'Seated Cable Row', 'pull', 'A horizontal pulling exercise on a cable machine that builds mid-back thickness.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit at the cable row station with knees slightly bent, feet braced on the platform.
2. Grip the handle and pull it toward your torso, keeping your back straight and elbows close to your body.
3. Extend your arms back out under control without rounding your lower back.$$,
    'Reduce the weight stack and focus on a shorter, controlled range.',
    'Increase the weight, pause at full contraction, or slow the return.'
  ),
  (
    'Straight-Arm Pulldown', 'pull', 'A lat isolation exercise performed on a cable with straight arms.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Grip a straight bar or rope attached to a high cable, arms extended in front of you.
2. Keeping your arms mostly straight, pull the bar down toward your thighs by engaging your lats.
3. Let the bar return under control to the starting position.$$,
    'Use lighter weight and a smaller range of motion.',
    'Increase the weight, or add a brief pause at the bottom of each rep.'
  ),
  (
    'Barbell Shrugs', 'pull', 'A simple isolation exercise for the trapezius muscles.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a barbell (or dumbbells) in front of your thighs, arms straight.
2. Shrug your shoulders straight up toward your ears as high as you can.
3. Lower back down under control without rolling your shoulders.$$,
    'Use lighter weight and focus on the squeeze at the top.',
    'Increase the load, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'Good Morning', 'pull', 'A hip-hinge exercise with a barbell across the back that strengthens the hamstrings and lower back.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Rest a barbell across your upper back like a squat, feet shoulder-width apart.
2. Keeping a slight bend in your knees and back flat, hinge forward at the hips until your torso is close to parallel with the floor.
3. Drive your hips forward to return to standing.$$,
    'Use light weight or no weight at all, and reduce the range of motion.',
    'Increase the load, or slow the forward hinge for extra time under tension.'
  ),
  (
    'Leg Extension', 'legs', 'A machine isolation exercise that targets the quadriceps directly.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit in the leg extension machine with the pad resting on the front of your lower shins.
2. Extend your legs to straighten them fully, squeezing your quads at the top.
3. Lower back down under control without letting the weight stack slam.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'Seated Leg Curl', 'legs', 'A machine isolation exercise for the hamstrings.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Sit in the leg curl machine with the pad resting against the back of your lower legs.
2. Curl your legs down and back by bending your knees, squeezing your hamstrings.
3. Return to the starting position under control.$$,
    'Reduce the weight and use a smaller range of motion.',
    'Increase the weight, add a pause at full contraction, or slow the return.'
  ),
  (
    'Barbell Hip Thrust', 'legs', 'A glute-focused hip extension exercise performed with your shoulders resting on a bench.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit on the floor with your upper back against a bench, a barbell across your hips.
2. Plant your feet flat, hip-width apart, close to your glutes.
3. Drive through your heels to lift your hips up until your body forms a straight line from shoulders to knees.
4. Lower back down under control without resting the bar on the floor between reps.$$,
    'Use no weight or light weight, and focus on the hip movement pattern.',
    'Increase the load, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'Hack Squat', 'legs', 'A machine-based squat performed on an angled sled that heavily targets the quadriceps.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Position yourself in the hack squat machine with your shoulders and back against the pads.
2. Lower yourself by bending your knees until your thighs are at least parallel to the platform.
3. Drive through your heels to return to the starting position.$$,
    'Reduce the weight and limit the depth of the squat.',
    'Increase the weight, add a pause at the bottom, or slow the descent.'
  ),
  (
    'Sumo Deadlift', 'legs', 'A wide-stance deadlift variation that shifts emphasis onto the inner thighs and glutes.',
    5, 3, 2, 'system', 'approved', true,
    $$1. Stand with a wide stance, toes pointed out, the bar over your mid-foot.
2. Grip the bar inside your knees with a flat back and chest up.
3. Drive through your heels and stand up tall, keeping the bar close to your body.
4. Lower the bar back down by hinging at the hips first.$$,
    'Use lighter weight or a trap bar, and narrow the stance slightly if it feels awkward.',
    'Increase the load, add a pause just off the floor, or slow the lowering phase.'
  ),
  (
    'Romanian Deadlift', 'legs', 'A hip-hinge movement performed with a slight knee bend that targets the hamstrings and glutes.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a barbell or dumbbells in front of your thighs, feet hip-width apart.
2. With a slight bend in your knees, hinge at the hips and lower the weight down your legs, keeping your back flat.
3. Feel a stretch in your hamstrings, then drive your hips forward to return to standing.$$,
    'Use lighter weight and stop the descent higher up, before you feel a strong stretch.',
    'Increase the load, add a pause at the bottom, or slow the lowering phase.'
  ),
  (
    'Front Squat', 'legs', 'A squat variation with the bar racked across the front of your shoulders, emphasizing the quads and upper back.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Rack the bar across the front of your shoulders, elbows up, fingertips supporting the bar.
2. Stand with feet shoulder-width apart and unrack the bar.
3. Squat down keeping your torso upright until your thighs are at least parallel to the floor.
4. Drive through your heels to stand back up.$$,
    'Use lighter weight, or hold the bar in a cross-arm grip if wrist mobility is limited.',
    'Increase the load, add a pause at the bottom, or slow the descent.'
  ),
  (
    'Pistol Squat', 'legs', 'A demanding single-leg bodyweight squat that builds serious strength and balance.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Stand on one leg with the other leg extended straight out in front of you.
2. Slowly lower yourself down by bending your standing knee, keeping the extended leg off the floor.
3. Go as low as you can with control, then drive back up to standing.
4. Complete all reps on one side before switching legs.$$,
    'Hold onto a doorframe or TRX straps for balance and assistance, or squat to a low box.',
    'Hold a weight at your chest, or slow the lowering phase further.'
  ),
  (
    'Overhead Press (Barbell)', 'shoulders', 'A standing barbell press that builds raw shoulder strength.',
    6, 3, 2, 'system', 'approved', true,
    $$1. Grip the bar just outside shoulder-width and rest it on your front shoulders.
2. Brace your core and press the bar straight overhead until your arms are fully extended.
3. Lower back down under control to the starting position.$$,
    'Use lighter weight, or perform the press seated for more stability.',
    'Increase the load, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'Arnold Press', 'shoulders', 'A dumbbell press variation with a rotating grip that works all three heads of the shoulder.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit or stand holding dumbbells in front of your shoulders, palms facing you.
2. Press the dumbbells overhead while rotating your palms to face forward.
3. Reverse the rotation as you lower back down to the starting position.$$,
    'Use lighter dumbbells and reduce the rotation range.',
    'Increase the weight, or slow both the press and the lowering phase.'
  ),
  (
    'Lateral Raise', 'shoulders', 'An isolation exercise for the side delts that builds shoulder width.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a dumbbell in each hand at your sides, a slight bend in your elbows.
2. Raise both arms out to the sides until they reach shoulder height.
3. Lower back down under control without swinging the weight.$$,
    'Use lighter dumbbells and a smaller range of motion.',
    'Increase the weight, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'Front Raise', 'shoulders', 'An isolation exercise that targets the front delts.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a dumbbell in each hand in front of your thighs.
2. Raise one or both arms straight in front of you to shoulder height.
3. Lower back down under control and repeat.$$,
    'Use lighter dumbbells or alternate arms instead of raising both together.',
    'Increase the weight, or hold at the top briefly each rep.'
  ),
  (
    'Rear Delt Fly', 'shoulders', 'An isolation move for the rear delts and upper back that supports posture.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Hinge forward at the hips holding a dumbbell in each hand, arms hanging with a slight bend in the elbows.
2. Raise both arms out to the sides, squeezing your shoulder blades together.
3. Lower back down under control.$$,
    'Use lighter dumbbells and a smaller range of motion.',
    'Increase the weight, or add a pause at the top of each rep.'
  ),
  (
    'Upright Row', 'shoulders', 'A vertical pulling exercise that targets the side delts and traps.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a barbell or dumbbells in front of your thighs, hands shoulder-width apart.
2. Pull the weight straight up toward your chin, leading with your elbows.
3. Lower back down under control to the starting position.$$,
    'Use lighter weight and stop the pull at chest height.',
    'Increase the weight, or add a pause at the top of each rep.'
  ),
  (
    'Machine Shoulder Press', 'shoulders', 'A guided pressing machine that isolates the shoulders without balance demands.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Adjust the seat so the handles line up with your shoulders.
2. Press the handles straight up until your arms are extended without locking out hard.
3. Return under control back to the starting position.$$,
    'Reduce the weight stack and use a partial range of motion.',
    'Increase the weight, slow the return phase, or press one arm at a time.'
  ),
  (
    'Handstand Push-up', 'shoulders', 'An advanced calisthenics press performed upside-down against a wall that builds serious shoulder strength.',
    5, 3, 3, 'system', 'approved', true,
    $$1. Kick up into a handstand against a wall, hands shoulder-width apart.
2. Bend your elbows to slowly lower the top of your head toward the floor.
3. Press back up through your hands to full arm extension.$$,
    'Work pike push-ups first, or reduce the range of motion using a folded mat under your head.',
    'Perform them freestanding away from the wall, or add a deficit using parallettes.'
  ),
  (
    'Barbell Curl', 'arms', 'The classic mass-building exercise for the biceps.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a barbell with an underhand grip, hands shoulder-width apart.
2. Curl the bar up toward your shoulders, keeping your elbows pinned to your sides.
3. Lower back down under control to full arm extension.$$,
    'Use lighter weight, an EZ-bar, or dumbbells for a more comfortable wrist position.',
    'Increase the load, add a pause at the top, or slow the lowering phase.'
  ),
  (
    'Dumbbell Curl', 'arms', 'A biceps isolation exercise performed with a dumbbell in each hand.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand or sit holding a dumbbell in each hand, arms fully extended, palms facing forward.
2. Curl one or both dumbbells up toward your shoulders, keeping your elbows still.
3. Lower back down under control to full extension.$$,
    'Use lighter dumbbells or alternate arms one at a time.',
    'Increase the weight, or slow the lowering phase significantly.'
  ),
  (
    'Hammer Curl', 'arms', 'A curl variation with a neutral grip that also targets the forearms.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand holding a dumbbell in each hand, palms facing each other.
2. Curl the dumbbells up toward your shoulders while keeping your palms facing in.
3. Lower back down under control.$$,
    'Use lighter dumbbells or alternate arms.',
    'Increase the weight, or add a pause at the top of each rep.'
  ),
  (
    'Preacher Curl', 'arms', 'A curl performed with your arms braced on a preacher bench, isolating the biceps and removing momentum.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Sit at a preacher bench with your upper arms resting flat on the pad, holding a barbell or dumbbells.
2. Curl the weight up toward your shoulders, keeping your upper arms pressed into the pad.
3. Lower back down under control to just short of full lockout.$$,
    'Use lighter weight and stop short of full extension at the bottom.',
    'Increase the load, or add a pause at the top of each rep.'
  ),
  (
    'Triceps Pushdown (Cable)', 'arms', 'A cable isolation exercise that targets the triceps.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand facing a cable machine with a bar or rope attached at the top.
2. Grip the attachment with elbows tucked at your sides.
3. Push the attachment down until your arms are fully extended, squeezing your triceps.
4. Let it return under control without letting your elbows drift forward.$$,
    'Reduce the weight stack and keep your elbows firmly pinned to your sides.',
    'Increase the weight, add a pause at the bottom, or slow the return.'
  ),
  (
    'Skull Crushers', 'arms', 'A lying triceps extension performed with a barbell or dumbbells.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Lie on a flat bench holding a barbell or dumbbells above your chest, arms extended.
2. Bend your elbows to lower the weight toward your forehead, keeping your upper arms still.
3. Extend your arms back up to the starting position.$$,
    'Use lighter weight and reduce the range of motion.',
    'Increase the load, or slow the lowering phase for extra time under tension.'
  ),
  (
    'Overhead Triceps Extension', 'arms', 'A triceps isolation exercise performed with the weight overhead.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Stand or sit holding a single dumbbell with both hands overhead, arms extended.
2. Bend your elbows to lower the dumbbell behind your head.
3. Extend your arms back up to full extension, keeping your elbows pointed forward.$$,
    'Use a lighter dumbbell and reduce the range of motion.',
    'Increase the weight, or perform it single-arm for extra stability demand.'
  ),
  (
    'Triceps Kickback', 'arms', 'An isolation exercise for the triceps performed in a hinged position.',
    12, 3, 1, 'system', 'approved', true,
    $$1. Hinge forward at the hips holding a dumbbell in one hand, upper arm parallel to the floor.
2. Extend your arm straight back until it's fully extended, squeezing your triceps.
3. Bend your elbow to return to the starting position, then repeat before switching arms.$$,
    'Use a lighter dumbbell and reduce the range of motion.',
    'Increase the weight, or add a pause at full extension each rep.'
  ),
  (
    'Bicycle Crunch', 'core', 'A dynamic core exercise that combines a twist with alternating leg movement.',
    20, 3, 1, 'system', 'approved', true,
    $$1. Lie on your back with hands behind your head, knees bent and lifted.
2. Bring one elbow toward the opposite knee while extending the other leg out.
3. Alternate sides in a smooth pedaling motion.$$,
    'Slow the pace down significantly, or keep the extended leg bent slightly.',
    'Increase the pace, or add a pause at each twisted position.'
  ),
  (
    'V-Up', 'core', 'A full-range core exercise that folds your body into a V shape.',
    12, 3, 2, 'system', 'approved', true,
    $$1. Lie flat on your back with arms extended overhead and legs straight.
2. Simultaneously lift your legs and upper body, reaching your hands toward your feet.
3. Lower back down under control to the starting position.$$,
    'Bend your knees as you lift, or alternate lifting one leg at a time (a "tuck-up").',
    'Hold a light weight in your hands, or add a pause at the top of each rep.'
  ),
  (
    'Toe Touches', 'core', 'A simple upper-ab focused crunch reaching for your toes.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Lie on your back with legs extended straight up toward the ceiling.
2. Reach your hands up toward your toes, lifting your shoulders off the floor.
3. Lower back down under control.$$,
    'Bend your knees slightly, or reduce the range of the reach.',
    'Hold a light weight in your hands, or slow the tempo further.'
  ),
  (
    'Bird Dog', 'core', 'A stability-focused core exercise performed on all fours.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Start on your hands and knees, hands under shoulders, knees under hips.
2. Extend one arm forward and the opposite leg back, keeping your hips and back level.
3. Return to the start and repeat on the other side.$$,
    'Extend only the arm or only the leg at a time, not both together.',
    'Add a pause at full extension, or add light ankle/wrist weights.'
  ),
  (
    'Pallof Press', 'core', 'An anti-rotation core exercise performed with a cable or band.',
    10, 3, 1, 'system', 'approved', true,
    $$1. Stand sideways to a cable or anchored band at chest height, holding the handle with both hands at your chest.
2. Press the handle straight out in front of you, resisting the pull rotating your torso.
3. Bring it back to your chest under control, then complete all reps before switching sides.$$,
    'Use a lighter resistance and stand closer to the anchor point.',
    'Increase the resistance, or add a pause at full extension each rep.'
  ),
  (
    'Reverse Crunch', 'core', 'A lower-ab focused crunch that lifts the hips off the floor.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Lie on your back with knees bent 90 degrees, shins parallel to the floor.
2. Curl your hips up off the floor toward your chest, using your lower abs.
3. Lower back down under control without swinging your legs.$$,
    'Reduce the range of motion, or keep your feet lightly touching the floor between reps.',
    'Straighten your legs toward the ceiling, or slow the tempo further.'
  ),
  (
    'Burpees', 'cardio', 'A full-body cardio exercise combining a squat, plank, push-up, and jump.',
    10, 3, 2, 'system', 'approved', true,
    $$1. Start standing, then squat down and place your hands on the floor.
2. Kick your feet back into a plank position, optionally adding a push-up.
3. Jump your feet back toward your hands, then explode up into a jump.$$,
    'Remove the push-up and the jump, stepping back instead of kicking.',
    'Add a push-up and a tuck jump at the top, or increase the pace.'
  ),
  (
    'Kettlebell Swing', 'cardio', 'A hip-hinge power exercise that builds cardio conditioning and posterior chain strength.',
    15, 3, 1, 'system', 'approved', true,
    $$1. Stand with feet shoulder-width apart, holding a kettlebell with both hands in front of you.
2. Hinge at the hips to swing the kettlebell back between your legs.
3. Drive your hips forward explosively to swing the kettlebell up to chest height.$$,
    'Use a lighter kettlebell and focus on the hip hinge pattern first.',
    'Use a heavier kettlebell, or swing to overhead height (American swing).'
  ),
  (
    'Farmer''s Walk', 'cardio', 'A loaded carry exercise that builds grip, core, and full-body conditioning.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Pick up a heavy dumbbell or kettlebell in each hand, standing tall with shoulders back.
2. Walk forward for the target distance or time, keeping your core braced.
3. Set the weights down under control at the end.$$,
    'Use lighter weights or walk for a shorter distance.',
    'Increase the weight, walk further, or carry a single weight on one side for an added core challenge.'
  ),
  (
    'Box Jump', 'cardio', 'An explosive plyometric exercise jumping onto an elevated box or platform.',
    8, 3, 2, 'system', 'approved', true,
    $$1. Stand facing a sturdy box, feet shoulder-width apart.
2. Bend your knees and swing your arms back, then explode up and forward onto the box.
3. Land softly with both feet, then step back down (don't jump down).$$,
    'Use a lower box, or step up instead of jumping.',
    'Use a higher box, or add a pause before each jump to remove momentum.'
  ),
  (
    'Sled Push', 'cardio', 'A loaded pushing exercise that builds leg power and conditioning.',
    20, 3, 2, 'system', 'approved', true,
    $$1. Load a sled with an appropriate weight and grip the handles at hip or shoulder height.
2. Drive forward in short, powerful steps, keeping your chest up and core braced.
3. Push for the target distance, then reset and repeat.$$,
    'Use lighter weight and push for a shorter distance.',
    'Increase the weight, or push for a longer distance at a faster pace.'
  ),
  (
    'Jump Rope', 'cardio', 'A classic cardio exercise that builds coordination and conditioning.',
    60, 3, 1, 'system', 'approved', true,
    $$1. Hold the rope handles at hip height and swing it over your head and under your feet.
2. Jump just high enough to clear the rope, landing softly on the balls of your feet.
3. Keep a steady rhythm for the target time.$$,
    'Practice without the rope first (just the jumping motion), or go at a slower pace.',
    'Increase the pace, or add double-unders (rope passes twice per jump).'
  ),
  (
    'Rowing Machine (Cardio)', 'cardio', 'A full-body, low-impact cardio exercise on a rowing ergometer.',
    60, 3, 1, 'system', 'approved', true,
    $$1. Strap your feet in and grip the handle with arms extended, knees bent.
2. Drive through your legs first, then lean back slightly and pull the handle to your ribs.
3. Reverse the sequence smoothly to return to the starting position.$$,
    'Reduce the resistance/damper setting and row at an easy, steady pace.',
    'Increase the resistance, or row at a faster pace for the target time.'
  ),
  (
    'Battle Ropes', 'cardio', 'A high-intensity conditioning exercise using heavy ropes anchored at one end.',
    30, 3, 1, 'system', 'approved', true,
    $$1. Stand with feet shoulder-width apart, holding one end of the rope in each hand.
2. Whip the ropes up and down alternately as hard and fast as you can.
3. Keep your core braced and knees slightly bent throughout the set.$$,
    'Slow the pace, or shorten the work interval.',
    'Increase the pace, use a double-wave pattern, or add a squat between waves.'
  );
