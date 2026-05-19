function TrackRow({
  dc,
  track,
  displayPattern,
  currentStep,
  isPlaying,
  mutes,
  solos,
  availableInstruments,
  tracksCount,
  toggleTrack,
  changeInstrument,
  setVolume,
  toggleMute,
  toggleSolo,
  randomizePattern,
  clearPattern,
  removeTrack,
  toggleStep
}) {
  const instInfo = [
    ...availableInstruments.drums,
    ...availableInstruments.synths,
    ...availableInstruments.fx
  ].find((i) => i.id === track.instrument) || { name: track.instrument, icon: "music" };

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        border: !track.enabled
          ? "1px dashed rgba(100, 100, 100, 0.3)"
          : mutes[track.id]
            ? "1px solid rgba(255, 107, 107, 0.4)"
            : solos[track.id]
              ? "1px solid rgba(78, 205, 196, 0.4)"
              : "1px solid rgba(157, 124, 206, 0.2)",
        borderRadius: "6px",
        padding: "10px",
        opacity: !track.enabled ? 0.4 : mutes[track.id] ? 0.6 : 1
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <button
            onClick={() => toggleTrack(track.id)}
            style={{
              padding: "5px 8px",
              fontSize: "0.65rem",
              backgroundColor: track.enabled ? "rgba(78, 205, 196, 0.3)" : "rgba(255, 107, 107, 0.3)",
              border: track.enabled ? "1px solid rgba(78, 205, 196, 0.5)" : "1px solid rgba(255, 107, 107, 0.5)",
              borderRadius: "3px",
              color: track.enabled ? "#4ecdc4" : "#ff6b6b",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: !track.enabled ? "0 0 8px rgba(255, 107, 107, 0.4)" : "none"
            }}
          >
            <dc.Icon icon={track.enabled ? "check" : "x"} style={{ fontSize: "10px" }} />
          </button>
          <select
            value={track.instrument}
            onChange={(e) => changeInstrument(track.id, e.target.value)}
            disabled={!track.enabled}
            style={{
              padding: "5px",
              fontSize: "0.7rem",
              backgroundColor: "#0a0a0a",
              border: "1px solid rgba(157, 124, 206, 0.3)",
              borderRadius: "3px",
              color: track.color,
              cursor: "pointer"
            }}
          >
            <optgroup label="Drums">
              {availableInstruments.drums.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Synths">
              {availableInstruments.synths.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="FX">
              {availableInstruments.fx.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </optgroup>
          </select>
          <dc.Icon icon={instInfo.icon} style={{ fontSize: "16px", color: track.color }} />
          <input
            type="range"
            min="-40"
            max="0"
            value={track.volume}
            onChange={(e) => setVolume(track.id, parseFloat(e.target.value))}
            disabled={!track.enabled}
            style={{ width: "100px" }}
          />
          <span style={{ fontSize: "0.55rem", color: track.color, minWidth: "35px" }}>{track.volume}dB</span>
          <button
            onClick={() => toggleMute(track.id)}
            disabled={!track.enabled}
            style={{
              padding: "4px 8px",
              fontSize: "0.6rem",
              backgroundColor: mutes[track.id] ? "rgba(255, 107, 107, 0.3)" : "rgba(157, 124, 206, 0.1)",
              border: "1px solid rgba(157, 124, 206, 0.3)",
              borderRadius: "3px",
              color: mutes[track.id] ? "#ff6b6b" : "#9d7cce",
              cursor: "pointer"
            }}
          >
            <dc.Icon icon={mutes[track.id] ? "volume-x" : "volume-2"} style={{ fontSize: "10px" }} /> M
          </button>
          <button
            onClick={() => toggleSolo(track.id)}
            disabled={!track.enabled}
            style={{
              padding: "4px 8px",
              fontSize: "0.6rem",
              backgroundColor: solos[track.id] ? "rgba(78, 205, 196, 0.3)" : "rgba(157, 124, 206, 0.1)",
              border: "1px solid rgba(78, 205, 196, 0.3)",
              borderRadius: "3px",
              color: solos[track.id] ? "#4ecdc4" : "#9d7cce",
              cursor: "pointer"
            }}
          >
            <dc.Icon icon="headphones" style={{ fontSize: "10px" }} /> S
          </button>
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => randomizePattern(track.id)}
            disabled={!track.enabled}
            style={{
              padding: "4px 8px",
              fontSize: "0.6rem",
              backgroundColor: "rgba(157, 124, 206, 0.1)",
              border: "1px solid rgba(157, 124, 206, 0.3)",
              borderRadius: "3px",
              color: "#9d7cce",
              cursor: "pointer"
            }}
          >
            <dc.Icon icon="shuffle" style={{ fontSize: "9px" }} />
          </button>
          <button
            onClick={() => clearPattern(track.id)}
            disabled={!track.enabled}
            style={{
              padding: "4px 8px",
              fontSize: "0.6rem",
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              border: "1px solid rgba(255, 107, 107, 0.3)",
              borderRadius: "3px",
              color: "#ff6b6b",
              cursor: "pointer"
            }}
          >
            <dc.Icon icon="trash-2" style={{ fontSize: "9px" }} />
          </button>
          <button
            onClick={() => removeTrack(track.id)}
            disabled={tracksCount <= 1}
            style={{
              padding: "4px 8px",
              fontSize: "0.6rem",
              backgroundColor: "rgba(255, 107, 107, 0.2)",
              border: "1px solid rgba(255, 107, 107, 0.4)",
              borderRadius: "3px",
              color: "#ff6b6b",
              cursor: tracksCount > 1 ? "pointer" : "not-allowed",
              opacity: tracksCount > 1 ? 1 : 0.3
            }}
          >
            <dc.Icon icon="x-circle" style={{ fontSize: "9px" }} />
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "5px" }}>
        {displayPattern.map((active, stepIndex) => (
          <button
            key={stepIndex}
            className="step-button"
            onClick={() => toggleStep(track.id, stepIndex)}
            disabled={!track.enabled}
            style={{
              aspectRatio: "1",
              backgroundColor: active ? track.color : "rgba(255, 255, 255, 0.05)",
              border:
                currentStep === stepIndex && isPlaying
                  ? "2px solid #fff"
                  : active
                    ? `1px solid ${track.color}`
                    : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              cursor: track.enabled ? "pointer" : "not-allowed",
              position: "relative",
              boxShadow: active ? `0 0 8px ${track.color}` : "none",
              opacity: track.enabled ? 1 : 0.3
            }}
          >
            {stepIndex % 4 === 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.45rem",
                  color: "#444",
                  fontWeight: "bold"
                }}
              >
                {stepIndex / 4 + 1}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

return { TrackRow };
