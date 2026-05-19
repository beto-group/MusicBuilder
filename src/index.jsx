/**
 * MUSIC BUILDER - Index Factory
 * Standard Datacore View Factory with Safe Agent recovery.
 */
async function View({ folderPath, dc }) {
  const Agent = {
    timer: null,
    start: (fPath, onReload) => {
      const cmdFile = fPath + "/data/mcp_commands.json";
      Agent.timer = setInterval(async () => {
        try {
          const adapter = dc.app.vault.adapter;
          if (!(await adapter.exists(cmdFile))) return;
          const content = await adapter.read(cmdFile);
          const cmd = JSON.parse(content);
          if (cmd && cmd.executed === false && cmd.action === "reload") {
            cmd.executed = true;
            cmd.executedAt = new Date().toISOString();
            await adapter.write(cmdFile, JSON.stringify(cmd, null, 2));
            onReload();
          }
        } catch (e) {}
      }, 1000);
      return () => clearInterval(Agent.timer);
    }
  };

  const SafeRoot = () => {
    const [modules, setModules] = dc.useState(null);
    const [error, setError] = dc.useState(null);
    const [key, setKey] = dc.useState(0);

    dc.useEffect(() => {
      return Agent.start(folderPath, () => {
        if (dc.app.workspace.activeLeaf?.rebuildView) {
          dc.app.workspace.activeLeaf.rebuildView();
        } else {
          setKey((k) => k + 1);
        }
      });
    }, []);

    dc.useEffect(() => {
      const load = async () => {
        try {
          const base = folderPath;
          const [
            instruments,
            styles,
            playhead,
            header,
            patternBank,
            arrangement,
            trackRow,
            app
          ] = await Promise.all([
            dc.require(base + "/src/core/Instruments.js"),
            dc.require(base + "/src/core/Styles.js"),
            dc.require(base + "/src/components/Playhead.jsx"),
            dc.require(base + "/src/components/HeaderControls.jsx"),
            dc.require(base + "/src/components/PatternBank.jsx"),
            dc.require(base + "/src/components/ArrangementEditor.jsx"),
            dc.require(base + "/src/components/TrackRow.jsx"),
            dc.require(base + "/src/App.jsx")
          ]);
          setModules({
            Instruments: instruments,
            styles,
            Playhead: playhead.Playhead,
            HeaderControls: header.HeaderControls,
            PatternBank: patternBank.PatternBank,
            ArrangementEditor: arrangement.ArrangementEditor,
            TrackRow: trackRow.TrackRow,
            DJBoothView: app.DJBoothView
          });
        } catch (e) {
          setError(e);
        }
      };
      load();
    }, [key]);

    if (error) {
      return (
        <div style={{ color: "red", padding: "40px", background: "#000", height: "100vh" }}>
          <h2 style={{ color: "#ff4444" }}>Critical Load Error</h2>
          <pre style={{ fontSize: "12px", color: "#ffbbbb" }}>{error.stack}</pre>
        </div>
      );
    }
    if (!modules) {
      return (
        <div style={{ padding: "40px", background: "#000", color: "#666", height: "100vh", fontFamily: "monospace" }}>
          Initializing DJ Booth...
        </div>
      );
    }

    const { DJBoothView, ...rest } = modules;
    return (
      <div id="datacore-component-root" style={{ width: "100%", height: "100%" }}>
        <DJBoothView folderPath={folderPath} dc={dc} {...rest} />
      </div>
    );
  };

  return <SafeRoot />;
}

return { View };
