import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
import * as fs from "fs";
import * as path from "path";

// Define the MCP Server
const server = new Server(
  {
    name: "ghostbusters-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to recursively find all .ts and .js files in a directory
function getSourceFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    // skip common irrelevant directories
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

// Handler to list available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "scan_for_ghosts",
        description: "Scans a project directory for unused variables, functions, and imports (Ghost Dependencies) using the TypeScript Compiler API. Returns a list of dead code locations to be analyzed by the AI.",
        inputSchema: {
          type: "object",
          properties: {
            directoryPath: {
              type: "string",
              description: "The absolute path to the project directory to scan.",
            },
          },
          required: ["directoryPath"],
        },
      },
    ],
  };
});

// Handler for tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "scan_for_ghosts") {
    const dirPath = request.params.arguments?.directoryPath as string;
    
    if (!dirPath || !fs.existsSync(dirPath)) {
      return {
        content: [{ type: "text", text: `Error: Directory ${dirPath} does not exist.` }],
        isError: true,
      };
    }

    try {
      const sourceFiles = getSourceFiles(dirPath);
      
      // Initialize TS Program with strict flags to find unused code
      const program = ts.createProgram(sourceFiles, {
        noEmit: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        allowJs: true,
        checkJs: true
      });

      const diagnostics = ts.getPreEmitDiagnostics(program);
      const ghosts: Array<{ file: string; line: number; message: string; code: number }> = [];

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
              code: diagnostic.code
            });
          }
        }
      });

      const summary = `Scanned ${sourceFiles.length} files. Found ${ghosts.length} ghost dependencies/unused variables.`;
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ summary, ghosts }, null, 2)
          }
        ],
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `Error scanning directory: ${e.message}` }],
        isError: true,
      };
    }
  }

  return {
    content: [{ type: "text", text: "Unknown tool" }],
    isError: true,
  };
});

// Start the server over STDIO
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GhostBusters MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
