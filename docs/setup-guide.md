# Setup Guide

This guide will walk you through setting up both the Frontend Dashboard and the Backend MCP Server for GhostBusters.

## Prerequisites
*   **Node.js**: v20 or higher (v24 recommended).
*   **npm**: v10 or higher.
*   **IBM Bob**: Installed in your IDE (VS Code).

## Environment Variables
This project requires no complex API keys, as it leverages your local IBM Bob IDE credentials. However, an `.env.example` file is provided in `src/.env.example`.

```env
# src/.env.example
PORT=5173
VITE_API_URL=http://localhost:3000
```

## Installation & Running

### 1. The Frontend Dashboard
Run these commands to start the visual dashboard:

```bash
cd src/frontend
npm install
npm run dev
```
*   **Verification:** Open your browser and navigate to `http://localhost:5173`. You should see the GhostBusters UI.

### 2. The Backend MCP Server
Run these commands to compile and start the Ghost Scanner:

```bash
cd src/backend
npm install
npm run build
npm run start
```
*   **Verification:** The console should output `GhostBusters MCP Server running on stdio`.

## Troubleshooting Common Errors

| Error Message | Cause | Solution |
|---|---|---|
| `memory allocation of X bytes failed` | Vite/Rust backend ran out of memory. | Restart your terminal and run `npm run dev` again. |
| `Cannot find module 'typescript'` | Dependencies were not fully installed. | Run `npm install` inside the `src/backend` folder again. |
| `Address already in use` | Port 5173 or 3000 is occupied. | Kill the process using the port, or change the port in `vite.config.ts`. |
