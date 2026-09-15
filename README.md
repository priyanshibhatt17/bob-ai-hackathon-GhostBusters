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

As teams use AI assistants to generate code quickly, codebases accumulate subtle technical debt like orphaned helper functions and ghost dependencies. Standard linters miss this semantic bloat, causing enterprise teams to deploy unnecessarily heavy, confusing applications.

---

## 💡 Solution

GhostBusters is a hybrid application featuring a web dashboard and an MCP server that intelligently scans code for ghost dependencies. It uses a token-efficient strategy with IBM Bob to verify dead code and propose automated cleanups.

---

## ✨ Key Features

- **Feature 1:** Token-efficient, zero-shot local code scanning for ghost dependencies
- **Feature 2:** Model Context Protocol (MCP) server integration with IBM Bob
- **Feature 3:** Automated execution of multi-file dead code removal
- **Feature 4:** Beautiful visual web dashboard for tracking repository tech debt

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | TypeScript, JavaScript, CSS |
| **Frameworks** | React, Vite, Node.js |
| **IBM Technologies** | IBM Bob, watsonx.ai |
| **Databases** | N/A |
| **Other** | Model Context Protocol (MCP), Esprima |

---

## 📁 Repository Structure

```
├── src/                  # All source code
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

> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

```bash
# 1. Clone the repo
git clone https://github.com/priyanshibhatt17/bob-ai-hackathon-GhostBusters.git
cd bob-ai-hackathon-GhostBusters

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Run the project
npm run dev
```

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/slides.pdf](presentation/) |

---

## ⚠️ Known Limitations

- The static analysis currently focuses heavily on JavaScript/TypeScript environments.
- The MCP server requires a local instance of IBM Bob running in the IDE to accept connections.

---

## 🏅 What We're Most Proud Of

We are most proud of our **50-Credit Token Strategy**. Instead of dumping an entire repository into the LLM context (which is expensive and slow), we built a smart local parsing engine that finds potential dead code first. We only send the final, verified snippets to IBM Bob for remediation. This makes IBM Bob load-bearing but highly cost-efficient!

---
