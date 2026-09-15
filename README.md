# 🚀 GhostBusters - AI Code Bloat Janitor

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | GhostBusters |
| **Track** | DevOps |
| **Team Lead** | Priyanshi Bhatt — priyanshibhatt1711@gmail.com |
| **Members** | Vidhi Sutariya, Janki Panchal, Yatri Joshi |

---

## 🎯 Problem Statement

As software teams increasingly adopt AI coding assistants like IBM Bob and GitHub Copilot to accelerate development, a new, dangerous category of technical debt has emerged: **AI-Generated Semantic Code Bloat.**

When AI generates features or refactors code, it often introduces dependencies, configuration flags, or helper functions. However, when those features are later modified or deleted, the associated architectural artifacts are frequently left behind. Over time, enterprise codebases accumulate Ghost Dependencies, Duplicate Logic, and Dead Configurations. Standard linters miss this semantic bloat, causing enterprise teams to deploy unnecessarily heavy, confusing applications.

---

## 💡 Solution

GhostBusters is an enterprise-grade technical debt orchestrator that uses lightning-fast Abstract Syntax Tree (AST) scanning to find ghost dependencies, duplicate logic, and dead configs. It feeds highly-contextual prompts into IBM Bob, allowing Bob's agentic AI to safely execute multi-file refactoring and liquidation.

---

## ✨ Key Features

- **AST Semantic Usage Engine:** Lightning-fast scanning for unused ghost dependencies
- **Duplicate Logic Detector:** Structural AST hashing to find semantically cloned functions
- **Confidence & Risk Engine:** Mathematically scores debt and delegates to Bob's Subagent Jury
- **Interactive Cleanup Dashboard:** Stunning glassmorphism UI with a macOS-style terminal
- **Blast Radius Graph:** Visual Mermaid.js mapping to prove isolated dead code paths

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | TypeScript, JavaScript, HTML, CSS |
| **Frameworks** | React, Vite, Node.js, Express |
| **IBM Technologies** | IBM Bob (Agent Mode), IBM Bob (Subagents) |
| **Databases** | N/A |
| **Other** | TypeScript Compiler API, Mermaid.js |

---

## 📁 Repository Structure

```
├── src/                  # All source code (backend and frontend)
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
│   └── demo-video-link.txt  # Link to demo video
├── presentation/         # Slide deck
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

```bash
# 1. Clone the repo
git clone https://github.com/priyanshibhatt17/bob-ai-hackathon-GhostBusters.git
cd bob-ai-hackathon-GhostBusters

# 2. Start the Backend (AST Scanner)
cd src/backend
npm install
npm start

# 3. Start the Frontend (Dashboard)
# Open a new terminal
cd src/frontend
npm install
npm run dev
```

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📁 **Google Drive (All Assets)** | [**Access Presentation, Video, and Screenshots**](https://drive.google.com/drive/folders/1pBNaEYBnuww2Ij8ncWwGZUiMIskc855S?usp=sharing) |
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/slides.pdf](presentation/) |

---

## ⚠️ Known Limitations

- The "Why Does This Exist" feature and "Blast Radius Graph" currently use mocked Git history data in the UI to demonstrate our vision for GhostBusters V2. Building a real-time Git history temporal engine required massive cloud databases, which was outside the scope of a 24-hour hackathon, but the core AST debt scanner is 100% fully functional.

---

## 🏅 What We're Most Proud Of

We are incredibly proud of how our tool acts as an "MRI Machine" for the codebase. IBM Bob is powerful, but it doesn't know where to look in a 10,000-file repository. Our AST backend scans the entire repository in milliseconds, calculates a mathematical Confidence Score, and dynamically generates surgical prompts that IBM Bob can immediately execute to liquidate the debt.
