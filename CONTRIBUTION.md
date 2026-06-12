# Contribution Guidelines — MusicBuilder

Welcome! This component is part of the BetoOS Datacore library. Please adhere to the following architectural standards.

## Codebase Architecture

The module utilizes a split-file structure to guarantee legibility, testability, and isolated execution scopes:

```text
MusicBuilder/
├── MUSIC BUILDER.md       # Obsidian entry point
├── METADATA.md            # Component manifest
├── README.md              # Documentation
├── CONTRIBUTION.md        # This file
├── LICENSE.md             # MIT license
├── data/
│   └── mcp_commands.json  # External watch/reload trigger
├── assets/
│   ├── image/
│   │   ├── preview_1.webp # Static preview image 1
│   │   └── preview_2.webp # Static preview image 2
│   └── videos/
│       └── preview.gif    # Interactive walkthrough GIF
└── src/
    ├── index.jsx          # Event-driven code watch & reload daemon
    ├── App.jsx            # coordinator React file coordinating states, transport, and arrangement
    ├── components/
    │   ├── ArrangementEditor.jsx # Multi-pattern timeline editor
    │   ├── HeaderControls.jsx    # BPM, volume, swing, and panel controls
    │   ├── PatternBank.jsx       # Preset slot manager
    │   ├── Playhead.jsx          # Playhead indicator
    │   └── TrackRow.jsx          # Step grid and tracks
    ├── core/
    │   ├── Instruments.js # Synthesizer nodes
    │   └── Styles.js      # Encapsulated CSS layout tokens and stylesheets
    └── utils/
        └── loadScript.js  # Script loader utility
```

## Developer Standards

1. **Strict Zero Emojis**: All UI elements, buttons, headers, and control indicators must use Lucide vector icons (`<dc.Icon>`) or plain text. Emojis are reserved strictly for documentation.
2. **Path Safety**: Do not hardcode absolute path strings (e.g. `/Volumes/` or `file:///`). Always resolve vault directories dynamically.
3. **No-Polling Code Watcher**: The index bootstrapper registers an event listener with `app.vault.on("modify")` targeting files under `MusicBuilder/src/`. This triggers an instant reload of the component's React view when source code modifications are saved, bypassing background CPU polling entirely.
4. **HMR Command System**: To force a code reload or command watch directory path change remotely via MCP agents, write the reload payload to `data/mcp_commands.json`.
5. **Zero-Dependency Core**: All libraries and external scripts must be loaded dynamically at runtime (e.g., Tone.js dynamic script inclusion). Do not declare npm packaging requirements that would require external installations.
6. **Audio Thread Isolation**: Keep step trigger loops lightweight. Avoid state updates on every 16th beat unless they directly affect layout markers (like the Playhead). Keep audio processing detached from rendering delays.
7. **Anti-Bleed Styling**: All components must restrict styles to their respective namespaces or unique wrapper classes to prevent style spillover into Obsidian workspace panes.
