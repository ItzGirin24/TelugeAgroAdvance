# TODO: Update Profile Timeline Rendering

## Current Task: Modify progress timeline in public/profil.html for admin status updates
- [x] Step 1: Update CSS in public/profil.html to support .step-circle.completed and .step-circle.current classes (green bg like .active).
- [x] Step 2: Edit JS template in loadOrderHistory() to render: completed steps (index < currentStep) as ✓ with 'completed' class, current step (index == currentStep) as number with 'current' class, pending (index >) as number with 'pending' class; labels active (<= currentStep); connectors active (< currentStep).
- [x] Step 3: Verify progress-fill width covers up to current step.
- [x] Step 4: Test rendering for statuses: process (only 1 current), packing (1 completed ✓, 2 current), etc.; mobile stacking.
- [x] Step 5: Update TODO.md upon completion and attempt task completion.
