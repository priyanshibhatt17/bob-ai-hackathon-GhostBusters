---
name: GhostBusters Liquidation Policy
description: Enforces strict enterprise rules for deleting code and resolving tech debt.
---

# Liquidation Policy Workflow

When the user asks you to "delete" or "liquidate" code that has been flagged as a Ghost Dependency, you MUST strictly follow this enterprise workflow:

1. **Subagent Jury Execution**:
   - You must spawn two subagents to review the code.
   - **Subagent A (Prosecutor)**: Tasked with finding every reason the code is useless and should be deleted immediately.
   - **Subagent B (Defense)**: Tasked with searching the repository for edge cases, dynamic string imports, or undocumented API dependencies that might secretly rely on this code.
   - Wait for both subagents to report back.

2. **The Verdict**:
   - Read the subagents' reports and the MCP Blast Radius diagram.
   - Calculate a "Safe to Delete Confidence Score" (0-100%).

3. **Enforce the Deprecation Rule**:
   - If the Confidence Score is >= 95%: You are authorized to permanently delete the code.
   - If the Confidence Score is < 95%: DO NOT DELETE THE CODE. Instead, add a `@deprecated` docstring comment above the function warning that it is a suspected Ghost Dependency, and log it for human review in the next sprint.
