# Solution Overview

## The Core Mechanism
**GhostBusters** is a hybrid solution comprising two main components:
1. **The Ghost Scanner (Local Backend):** A Node.js backend that utilizes the TypeScript Compiler API to perform zero-cost AST (Abstract Syntax Tree) parsing across an entire repository. It statically identifies variables, functions, and imports that are declared but never used.
2. **The MCP Server & IBM Bob Integration:** The backend acts as a Model Context Protocol (MCP) server. Instead of feeding thousands of lines of raw code into an LLM (which is expensive and slow), our local scanner finds the "ghosts" first, and then sends a highly optimized, targeted prompt to **IBM Bob** to verify the dead code and propose a safe, multi-file refactor.

## Differentiation from Naive Alternatives
Naive alternatives either rely on basic regex (which breaks easily) or they attempt to paste entire codebases into an LLM context window, resulting in massive API costs and hallucinations. GhostBusters uses deterministic static analysis *first*, and AI *second* for validation, making it extremely fast, accurate, and token-efficient.

## Key Design Decisions
*   **Token-Efficient Strategy (50 Credit Budget):** We specifically designed the architecture to conserve IBM Bob tokens. By doing the heavy lifting locally via the TS Compiler API, Bob is only invoked for the final, critical "Agent Execution" step.
*   **Visual Dashboard:** We built a React/Vite frontend with a clean, minimalistic UI to provide engineers with a clear visual representation of their technical debt before they unleash the AI to clean it up.

## The User Experience
1. A developer enters the path of their repository into the GhostBusters Web Dashboard.
2. The dashboard displays a clean list of all Ghost Dependencies and orphaned code blocks.
3. The developer switches to their IDE, where they ask IBM Bob to run the GhostBusters MCP tool.
4. Bob automatically generates the PR/diffs to safely liquidate the dead code with a single click.
