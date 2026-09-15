# Problem Statement

## The Audience Affected
Modern enterprise software teams, Site Reliability Engineers (SREs), and DevOps engineers.

## Why Existing Solutions Don't Solve It
With the rapid adoption of AI coding assistants, developers are generating code faster than ever. However, AI often generates multiple iterations of a solution, leaving behind "Ghost Dependencies"—unused package imports, orphaned helper functions, and dead logic. Standard linters (like ESLint) only check basic syntax on a per-file basis. They do not understand the structural, semantic context of an entire repository to safely identify and remove this complex code bloat.

## Quantified Pain
When ghost dependencies accumulate:
- **Build times** increase unnecessarily due to unused packages being bundled.
- **Cloud computing costs** rise.
- **Developer cognitive load** skyrockets, as engineers spend hours reading and deciphering "dead code" during high-stress incident responses, assuming it does something important.

## Why This Problem Matters Now
As AI continues to write a larger percentage of our global software, AI-induced code bloat is becoming a massive source of silent technical debt. We need an intelligent, context-aware "janitor" to keep our repositories clean and maintainable.
