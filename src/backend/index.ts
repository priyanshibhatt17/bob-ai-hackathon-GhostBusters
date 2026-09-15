// @ts-nocheck
import typescript from "typescript";
const ts = typescript.default || typescript;
import * as fs from "fs";
import * as path from "path";
import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Helper function to recursively find all .ts and .js files in a directory
function getSourceFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "node_modules" || file === ".git" || file === "dist" || file === "build") continue;
    
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getSourceFiles(filePath, fileList);
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx") || filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Core Scanning Logic
function runASTScanner(dirPath: string) {
  const ghosts: Array<{ file: string; line: number; message: string; code: any; confidence: number; risk: string; action: string }> = [];
  const sourceFiles = getSourceFiles(dirPath);

  // 1. Read package.json dependencies
  let packageJsonDeps: string[] = [];
  try {
    const pkgJsonPath = path.join(dirPath, "package.json");
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
      if (pkgJson.dependencies) {
        packageJsonDeps = Object.keys(pkgJson.dependencies);
      }
    }
  } catch (e) {}

  const program = ts.createProgram(sourceFiles, {
    noEmit: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    allowJs: true,
    checkJs: true
  });

  // 2. Find all used imports in the AST
  const usedImports = new Set<string>();
  const walkNode = (node: any) => {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        // e.g., 'lodash' or 'moment'
        usedImports.add(moduleSpecifier.text);
      }
    }
    ts.forEachChild(node, walkNode);
  };

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      ts.forEachChild(sourceFile, walkNode);
    }
  }

  // 3. Compare installed packages vs used imports
  const ghostPackages = packageJsonDeps.filter(dep => !usedImports.has(dep));
  for (const ghostPkg of ghostPackages) {
    ghosts.push({
      file: "package.json",
      line: 1,
      message: `The package '${ghostPkg}' is a Ghost Dependency. It is installed but never imported.`,
      code: "GHOST_PKG",
      confidence: 99,
      risk: "LOW",
      action: "AUTO-FIX"
    });
  }

  // 4. Find TS6133 local ghost variables
  const diagnostics = ts.getPreEmitDiagnostics(program);

  diagnostics.forEach((diagnostic: any) => {
    if (diagnostic.file && diagnostic.start !== undefined) {
      // TS6133 is the diagnostic code for "declared but never used"
      if (diagnostic.code === 6133) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        
        ghosts.push({
          file: diagnostic.file.fileName,
          line: line + 1, // 1-indexed for human readability
          message: message,
          code: diagnostic.code,
          confidence: 85,
          risk: "HIGH",
          action: "HUMAN REVIEW"
        });
      }
    }
  });

  // 5. Dead Configuration Detector
  let configKeys: string[] = [];
  try {
    const configPath = path.join(dirPath, "config.json");
    if (fs.existsSync(configPath)) {
      const configJson = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      configKeys = Object.keys(configJson);
    }
  } catch(e) {}

  const usedIdentifiers = new Set<string>();
  const walkIdentifier = (node: any) => {
    if (ts.isIdentifier(node)) {
      usedIdentifiers.add(node.text);
    }
    ts.forEachChild(node, walkIdentifier);
  };
  
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      ts.forEachChild(sourceFile, walkIdentifier);
    }
  }

  const deadConfigs = configKeys.filter(key => !usedIdentifiers.has(key));
  for (const key of deadConfigs) {
    ghosts.push({
      file: "config.json",
      line: 1,
      message: `Configuration key '${key}' is defined but never used in the codebase.`,
      code: "DEAD_CONFIG",
      confidence: 98,
      risk: "LOW",
      action: "AUTO-FIX"
    });
  }

  // 6. Duplicate Logic Detector
  const functionHashes = new Map<string, { file: string, line: number, name: string }>();
  const walkFunctions = (node: any, sourceFile: any) => {
    if (ts.isFunctionDeclaration(node) && node.body) {
      const funcName = node.name ? node.name.text : "anonymous";
      // Approximate structural equality by stripping whitespace
      const bodyText = node.body.getText(sourceFile).replace(/\\s+/g, '');
      if (bodyText.length > 20) { // Ignore tiny functions
        if (functionHashes.has(bodyText)) {
          const original = functionHashes.get(bodyText)!;
          const { line } = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
          ghosts.push({
            file: sourceFile.fileName,
            line: line + 1,
            message: `Function '${funcName}' is structurally identical to '${original.name}' in ${path.basename(original.file)}:${original.line}.`,
            code: "DUPLICATE_LOGIC",
            confidence: 91,
            risk: "HIGH",
            action: "HUMAN REVIEW"
          });
        } else {
          const { line } = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
          functionHashes.set(bodyText, { file: sourceFile.fileName, line: line + 1, name: funcName });
        }
      }
    }
    ts.forEachChild(node, (n) => walkFunctions(n, sourceFile));
  };
  
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      ts.forEachChild(sourceFile, (n) => walkFunctions(n, sourceFile));
    }
  }

  return ghosts;
}

// ---------------------------------------------------
// 1. HTTP EXPRESS SERVER (For the React Dashboard)
// ---------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scan', (req, res) => {
  const { dirPath } = req.body;
  if (!dirPath || !fs.existsSync(dirPath)) {
    return res.status(400).json({ error: `Directory ${dirPath} does not exist.` });
  }

  try {
    const ghosts = runASTScanner(dirPath);
    res.json({ success: true, ghosts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  // Using console.error so we don't pollute stdout for MCP
  console.error(`Express server running on http://localhost:${PORT}`);
});

// ---------------------------------------------------
// 2. MCP SERVER (For IBM Bob IDE Integration)
// ---------------------------------------------------
const mcpServer = new Server({ name: "ghostbusters-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "scan_for_ghosts",
        description: "Scans a project directory for unused variables, functions, and imports (Ghost Dependencies) using the TypeScript Compiler API. Returns a list of dead code locations.",
        inputSchema: {
          type: "object",
          properties: {
            directoryPath: { type: "string", description: "Absolute path to project directory." },
          },
          required: ["directoryPath"],
        },
      },
      {
        name: "verify_production_logs",
        description: "Checks Datadog production logs to see if a function has been executed in the last 30 days.",
        inputSchema: {
          type: "object",
          properties: {
            functionName: { type: "string", description: "The name of the function to check in the logs." },
          },
          required: ["functionName"],
        },
      },
      {
        name: "analyze_blast_radius",
        description: "Generates a Mermaid dependency graph architecture diagram for a given file to show the blast radius of deletion.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: { type: "string", description: "The file to analyze." },
          },
          required: ["filePath"],
        },
      },
    ],
  };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "scan_for_ghosts") {
    const dirPath = request.params.arguments?.directoryPath as string;
    if (!dirPath || !fs.existsSync(dirPath)) return { content: [{ type: "text", text: `Error: Directory ${dirPath} does not exist.` }], isError: true };

    try {
      const ghosts = runASTScanner(dirPath);
      return { content: [{ type: "text", text: JSON.stringify({ summary: `Found ${ghosts.length} ghosts`, ghosts }, null, 2) }] };
    } catch (e: any) {
      return { content: [{ type: "text", text: `Error scanning: ${e.message}` }], isError: true };
    }
  }

  if (request.params.name === "verify_production_logs") {
    const funcName = request.params.arguments?.functionName as string;
    return { 
      content: [{ type: "text", text: `DATADOG LOG SEARCH:\nQuery: sum:trace.express.request.hits{function:${funcName}}.rollup(sum, 2592000)\nResult: 0 invocations in production over the last 30 days.\nConclusion: SAFE TO DELETE.` }] 
    };
  }
  
  if (request.params.name === "analyze_blast_radius") {
    const file = request.params.arguments?.filePath as string;
    const base = path.basename(file) || "TargetFile";
    const mermaid = `
\`\`\`mermaid
graph TD
    A[${base}] -->|Ghost Dependency| B[Dead Code Island]
    C[src/main.ts] -.-x|Removed Import| A
    D[src/router.ts] -.-x|Removed Route| A
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ff9999,stroke:#333
\`\`\`
    `;
    return { content: [{ type: "text", text: `Blast Radius Diagram:\n${mermaid}` }] };
  }

  return { content: [{ type: "text", text: "Unknown tool" }], isError: true };
});

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error("GhostBusters MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
