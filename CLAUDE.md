@AGENTS.md
# Execution Rules

- **Zero Mid-Task Interruption:** Do not pause during execution to ask clarifying questions or confirmation.
- **Front-Load Questions:** If details are missing when a prompt is given, ask ALL necessary questions up front in your initial response before taking any action.
- **Plan File:** Once questions are answered, write a step-by-step task execution plan to `TASK_PLAN.md` in the workspace root.
- **Autonomous Build:** Execute the entire `TASK_PLAN.md` from start to finish. Make reasonable default technical choices for any minor ambiguities instead of stopping to ask.