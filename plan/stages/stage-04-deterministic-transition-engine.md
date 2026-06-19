# Stage 4: Deterministic Transition Engine

## Goal
Implement multi-frame emotion transitions driven by deterministic pose interpolation.

## Required Work
- Implement Pose type, interpolation, easing, frame scheduler, renderer, effects renderer, and speech bubble renderer.
- Use deterministicDevPlanner only for test and development wiring.
- Generate and verify five sample transitions:
  - neutral -> shy_love
  - neutral -> hungry
  - neutral -> sleepy
  - neutral -> hurt
  - neutral -> curious

## Stop Condition
Stop and request user approval for the transition previews before Stage 5.

