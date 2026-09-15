# Architecture

GhostBusters operates on a hybrid architecture, splitting the responsibilities between a lightning-fast local static analysis engine and a cloud-powered AI execution agent (IBM Bob).

## Data Flow Diagram

The following Mermaid diagram illustrates how user input flows from the web dashboard, through our local AST scanning engine, and finally into the IBM Bob Agent for safe code liquidation.

```mermaid
graph TD
    %% User Inputs
    User((Developer)) -->|Enters Target Path| Frontend
    
    %% Frontend Components
    subgraph "GhostBusters Dashboard (React/Vite)"
        Frontend[Web UI]
        Dashboard[Codebase Health Dashboard]
        UX[Investigation Cards / Blast Radius Graph]
        Frontend --> Dashboard
        Frontend --> UX
    end

    %% Backend Engine
    subgraph "GhostBusters Engine (Node.js)"
        API[Express API]
        AST[TypeScript Compiler AST Parser]
        DuplicateHash[Duplicate Logic Hasher]
        Confidence[Confidence & Risk Engine]
        
        API --> AST
        API --> DuplicateHash
        AST --> Confidence
        DuplicateHash --> Confidence
    end
    
    %% Connections
    Frontend -->|POST /api/scan| API
    Confidence -->|JSON Payload| Dashboard
    
    %% Orchestration
    Dashboard -->|Copies Contextual Prompt| Clipboard[System Clipboard]
    Clipboard -->|Paste| IBMBob[IBM Bob IDE Extension]
    
    %% AI Execution
    subgraph "Execution Layer"
        IBMBob --> AgentMode[IBM Bob Agent Mode]
        IBMBob --> SubagentJury[IBM Bob Subagent Jury]
        
        AgentMode -->|npm uninstall / rm| Filesystem[(Local Filesystem)]
        SubagentJury -->|Human Review & Approval| Filesystem
    end
```

## System Components

1. **GhostBusters Dashboard (Frontend):** A React/Vite application utilizing glassmorphism CSS. It visually renders the technical debt in an accessible format and generates the highly-contextual AI prompts required for IBM Bob.
2. **GhostBusters Engine (Backend):** A Node.js/Express server that acts as the "MRI Machine." It uses the TypeScript Compiler API to physically read and map the Abstract Syntax Tree of the target repository, calculating mathematical Confidence Scores for each piece of debt.
3. **Execution Layer (IBM Bob):** Our system delegates all actual file modifications and package uninstalls to IBM Bob. This ensures that the codebase is protected by Bob's safe rollback and intelligent testing capabilities.
