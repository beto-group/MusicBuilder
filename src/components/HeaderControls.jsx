function HeaderControls({
  dc,
  ready,
  isPlaying,
  togglePlay,
  bpm,
  setBpm,
  swing,
  setSwing,
  masterVolume,
  setMasterVolume,
  arrangementMode,
  setArrangementMode,
  restartSong,
  showExportMenu,
  setShowExportMenu,
  exportSong,
  exportAudio,
  importSong
}) {
  return (
    <div style={{ padding: "15px 30px", borderBottom: "2px solid rgba(157, 124, 206, 0.2)", backgroundColor: "#0a0a0a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <dc.Icon icon="music" style={{ fontSize: "32px", color: "#9d7cce" }} />
          <h1 style={{ margin: 0, fontSize: "1.8rem", color: "#9d7cce", letterSpacing: "4px" }}>DJ BOOTH 888</h1>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
            <span style={{ fontSize: "0.6rem", color: "#666" }}>MASTER</span>
            <input
              type="range"
              min="-40"
              max="0"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              style={{ width: "70px" }}
            />
            <span style={{ fontSize: "0.5rem", color: "#9d7cce" }}>{masterVolume}dB</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
            <span style={{ fontSize: "0.6rem", color: "#666" }}>SWING</span>
            <input
              type="range"
              min="0"
              max="100"
              value={swing}
              onChange={(e) => setSwing(parseFloat(e.target.value))}
              style={{ width: "70px" }}
            />
            <span style={{ fontSize: "0.5rem", color: "#9d7cce" }}>{swing}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
            <span style={{ fontSize: "0.6rem", color: "#666" }}>BPM</span>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <button
                onClick={() => setBpm(Math.max(60, bpm - 5))}
                style={{
                  width: "25px",
                  height: "25px",
                  backgroundColor: "rgba(157, 124, 206, 0.1)",
                  border: "1px solid rgba(157, 124, 206, 0.3)",
                  borderRadius: "3px",
                  color: "#9d7cce",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                -
              </button>
              <span style={{ fontSize: "1.2rem", color: "#9d7cce", fontWeight: "bold", minWidth: "50px", textAlign: "center" }}>
                {bpm}
              </span>
              <button
                onClick={() => setBpm(Math.min(200, bpm + 5))}
                style={{
                  width: "25px",
                  height: "25px",
                  backgroundColor: "rgba(157, 124, 206, 0.1)",
                  border: "1px solid rgba(157, 124, 206, 0.3)",
                  borderRadius: "3px",
                  color: "#9d7cce",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={togglePlay}
            disabled={!ready}
            style={{
              padding: "12px 25px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              color: "#000",
              backgroundColor: isPlaying ? "#ff6b6b" : "#9d7cce",
              border: "none",
              borderRadius: "6px",
              cursor: ready ? "pointer" : "not-allowed",
              opacity: ready ? 1 : 0.5,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <dc.Icon icon={isPlaying ? "square" : "play"} style={{ fontSize: "16px" }} />
            {isPlaying ? "STOP" : "PLAY"}
          </button>
          {arrangementMode && (
            <button
              onClick={restartSong}
              disabled={!ready}
              style={{
                padding: "8px 12px",
                fontSize: "0.7rem",
                backgroundColor: "rgba(78, 205, 196, 0.1)",
                border: "1px solid rgba(78, 205, 196, 0.3)",
                borderRadius: "4px",
                color: "#4ecdc4",
                cursor: ready ? "pointer" : "not-allowed",
                opacity: ready ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <dc.Icon icon="rotate-ccw" style={{ fontSize: "12px" }} /> RESTART
            </button>
          )}
          <button
            onClick={() => setArrangementMode(!arrangementMode)}
            style={{
              padding: "8px 15px",
              fontSize: "0.7rem",
              backgroundColor: arrangementMode ? "rgba(78, 205, 196, 0.3)" : "rgba(157, 124, 206, 0.1)",
              border: "1px solid rgba(157, 124, 206, 0.3)",
              borderRadius: "4px",
              color: arrangementMode ? "#4ecdc4" : "#9d7cce",
              cursor: "pointer"
            }}
          >
            <dc.Icon icon="list" style={{ fontSize: "12px" }} /> {arrangementMode ? "SONG MODE" : "PATTERN MODE"}
          </button>
          <div style={{ borderLeft: "1px solid rgba(157, 124, 206, 0.2)", height: "30px" }} />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              style={{
                padding: "8px 15px",
                fontSize: "0.7rem",
                backgroundColor: showExportMenu ? "rgba(157, 124, 206, 0.3)" : "rgba(157, 124, 206, 0.1)",
                border: "1px solid rgba(157, 124, 206, 0.3)",
                borderRadius: "4px",
                color: "#9d7cce",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <dc.Icon icon="download" style={{ fontSize: "12px" }} /> EXPORT
            </button>
            {showExportMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  right: "0",
                  backgroundColor: "#0a0a0a",
                  border: "1px solid rgba(157, 124, 206, 0.3)",
                  borderRadius: "4px",
                  padding: "8px",
                  zIndex: 1000,
                  minWidth: "160px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
                }}
              >
                <button
                  onClick={exportSong}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "0.65rem",
                    backgroundColor: "rgba(157, 124, 206, 0.1)",
                    border: "1px solid rgba(157, 124, 206, 0.2)",
                    borderRadius: "3px",
                    color: "#9d7cce",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                    textAlign: "left"
                  }}
                >
                  <dc.Icon icon="file-json" style={{ fontSize: "12px" }} /> Export JSON
                </button>
                <button
                  onClick={exportAudio}
                  disabled={!ready}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "0.65rem",
                    backgroundColor: "rgba(157, 124, 206, 0.1)",
                    border: "1px solid rgba(157, 124, 206, 0.2)",
                    borderRadius: "3px",
                    color: ready ? "#9d7cce" : "#666",
                    cursor: ready ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textAlign: "left",
                    opacity: ready ? 1 : 0.5
                  }}
                >
                  <dc.Icon icon="music" style={{ fontSize: "12px" }} /> Export Audio (WebM)
                </button>
              </div>
            )}
          </div>
          <label
            style={{
              padding: "8px 15px",
              fontSize: "0.7rem",
              backgroundColor: "rgba(157, 124, 206, 0.1)",
              border: "1px solid rgba(157, 124, 206, 0.3)",
              borderRadius: "4px",
              color: "#9d7cce",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <dc.Icon icon="upload" style={{ fontSize: "12px" }} /> IMPORT
            <input type="file" accept=".json" onChange={importSong} style={{ display: "none" }} />
          </label>
        </div>
      </div>
    </div>
  );
}

return { HeaderControls };
