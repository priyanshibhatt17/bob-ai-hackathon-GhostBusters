# Solution Overview

**GhostBusters** is an enterprise-grade technical debt orchestrator that identifies, scores, and liquidates AI-generated code bloat. 

We solve the problem of "invisible technical debt" by separating the analysis phase from the execution phase. IBM Bob is an incredibly powerful AI agent, but it lacks the ability to instantaneously scan a 10,000-file repository to find hidden debt on its own. **GhostBusters acts as the MRI Machine, while IBM Bob acts as the Surgeon.**

## How It Works

1. **The AST Scanning Engine:**
   GhostBusters runs a lightning-fast, local Node.js backend powered by the TypeScript Compiler API. It traverses the Abstract Syntax Tree (AST) of the target repository to map every dependency, function, and configuration key.

2. **The Intelligence Layer:**
   - **Ghost Package Detection:** Cross-references `package.json` against the global AST to mathematically prove which libraries have zero execution paths.
   - **Dead Config Detection:** Scans `config.json` and traces keys across the entire directory structure.
   - **Duplicate Logic Hashing:** Physically strips whitespace and hashes the internal structure of functions to detect cloned code blocks, even if they have different names.

3. **The Confidence & Risk Engine:**
   Automatic code deletion is dangerous. GhostBusters assigns a mathematical Confidence Score and Risk Category to every finding:
   - *Ghost Packages:* **99% Confidence, Low Risk.** (Safe for Auto-Fix).
   - *Duplicate Logic:* **85% Confidence, High Risk.** (Requires human review or subagent investigation).

4. **IBM Bob Orchestration:**
   GhostBusters features a stunning, macOS-inspired Interactive Cleanup Dashboard. Instead of attempting to modify the filesystem directly, GhostBusters generates highly-contextual, surgical prompts. When the developer clicks "Auto-Fix via Bob", the exact coordinates of the technical debt are copied to the clipboard. The developer pastes this into the IBM Bob IDE, allowing Bob's agentic AI to safely execute the multi-file refactoring and dependency pruning.

By pairing lightning-fast static analysis with IBM Bob's advanced agentic capabilities, GhostBusters ensures that enterprise codebases remain lean, secure, and free of AI-generated bloat.
