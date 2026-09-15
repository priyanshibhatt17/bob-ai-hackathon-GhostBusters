# Setup & Run Guide

Follow these simple steps to run the GhostBusters platform locally and test the IBM Bob integration.

## Prerequisites
- Node.js (v18+)
- npm
- IBM Bob IDE (or VS Code with the IBM Bob extension installed)

## 1. Start the Backend Engine
The backend engine powers the AST (Abstract Syntax Tree) scanner. 

```bash
# Navigate to the backend directory
cd src/backend

# Install dependencies (including typescript and express)
npm install

# Start the Node.js API server
npm start
```
*The server will start on `http://localhost:3000`.*

## 2. Start the Frontend Dashboard
The frontend is a Vite-powered React application.

```bash
# Open a new terminal and navigate to the frontend directory
cd src/frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The UI will be accessible at `http://localhost:5173`.*

## 3. How to Test the Project
We have included a mock repository specifically designed to test the AST scanners.

1. Open `http://localhost:5173` in your browser.
2. In the target path input box, enter the absolute path to the dummy project:
   `<YOUR_ABSOLUTE_PATH>/dummy-project` (e.g. `D:\IBM BOB\dummy-project`).
3. Click **Lookup**.
4. Review the Codebase Health Dashboard and click "View Blast Radius Map" to see the visual dependencies.

## 4. Testing the IBM Bob Integration
1. Click the green **"Auto-Fix via Bob"** button on one of the errors (this copies an orchestrated prompt to your clipboard).
2. Open the **IBM Bob IDE** and open the `dummy-project` folder.
3. If prompted, click **"Trust this folder"** in the blue banner at the top of the IDE to enable Bob's agentic features.
4. Open the IBM Bob Chat panel.
5. Paste the prompt and press Enter. 
6. Watch as IBM Bob safely removes the ghost dependencies and dead code from your filesystem!
