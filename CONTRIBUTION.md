# Contribution Standards

This document outlines the architectural guidelines and design principles required for contributing to the MUSIC BUILDER codebase.

## Architectural Pillars

1. **Zero-Dependency Core**: All libraries and external scripts must be loaded dynamically at runtime (e.g., Tone.js dynamic script inclusion). Do not declare npm packaging requirements that would require external installations.
2. **Modular Coordination**: Monolithic files exceeding 500 lines are prohibited. Organize files under `src/core/` (logic & styles), `src/components/` (pure layout units), and `src/App.jsx` (parent coordinate states).
3. **Audio Thread Isolation**: Keep step trigger loops lightweight. Avoid state updates on every 16th beat unless they directly affect layout markers (like the Playhead). Keep audio processing detached from rendering delays.
4. **Anti-Bleed Styling**: All components must restrict styles to their respective namespaces or unique wrapper classes (e.g., `.djbooth-scroll`) to prevent style spillover into Obsidian workspace panes.

## Development Workflow & Caching

- **Hot Module Replacement (HMR)**: The component uses a dynamic watchdog daemon to monitor `data/mcp_commands.json` inside the root directory. To trigger a live reload of the leaf, dispatch a reload payload:
  ```json
  {
    "action": "reload",
    "executed": false
  }
  ```
- **Audit Checklist**: Before submitting a PR or release tag:
  - Run case-insensitive sensitivity scans ("Beto Clean") for local volumes (`/Volumes/`, `/Users/`) or usernames (`blackbird`).
  - Verify that no emojis are present in any of the UI panels or Markdown headers.
