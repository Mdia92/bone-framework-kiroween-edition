# MCP Filesystem Integration

## Purpose
This project uses the Model Context Protocol (MCP) to extend Kiro's capabilities by providing **live access to project files and documentation** through a filesystem MCP server.

## Why MCP?
MCP allows Kiro to dynamically read project files, browse directories, and search for content **on-demand** during conversations, rather than relying solely on pre-indexed context. This is especially useful for:

- Reading runbooks, SOPs, and documentation as they evolve
- Accessing configuration files and environment variables
- Browsing the skeleton framework structure to understand architecture
- Searching across multiple apps (`incident-exorcist`, `onboarding-ritual`) for patterns

## Configuration
The MCP filesystem server is configured in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\diamo\\Downloads\\bone-framework_-kiroween-edition"
      ],
      "disabled": false,
      "autoApprove": [
        "read_file",
        "list_directory",
        "search_files"
      ]
    }
  }
}
```

### Server Details
- **Server**: `@modelcontextprotocol/server-filesystem` (official MCP filesystem server)
- **Scope**: Points to the root of this repository
- **Auto-approved tools**: `read_file`, `list_directory`, `search_files` (safe read-only operations)

## Usage in Kiro Chat

You can now ask Kiro to use MCP tools explicitly:

### Examples
- "Use the filesystem MCP tools to read `docs/ARCHITECTURE.md` before answering"
- "Use MCP to list all files in the `apps/` directory"
- "Search the project using MCP for references to 'pipeline validation'"
- "Read the incident-exorcist API file via MCP and explain its structure"

### Benefits for The Skeleton Crew
1. **Live Documentation**: As runbooks and SOPs are added to `docs/`, Kiro can read them without re-indexing
2. **Cross-App Analysis**: Compare implementations across `incident-exorcist` and `onboarding-ritual` dynamically
3. **Configuration Awareness**: Read `.env.local`, `tsconfig.json`, or other configs on-demand
4. **Future-Proof**: When new "bodies" (apps) are added, MCP can discover and analyze them immediately

## Verification
To verify the MCP server is working:
1. Check the MCP Server view in Kiro's feature panel
2. Look for the "filesystem" server with status "connected"
3. Try: "Use MCP to list the contents of the packages/bone-framework directory"

## Notes
- The server runs via `npx`, so no installation is required (downloads on first use)
- Read-only operations are auto-approved for safety
- The server automatically reconnects if the config changes
