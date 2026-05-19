function PatternBank({
  dc,
  savedPatterns,
  justSaved,
  currentPatternIndex,
  arrangementMode,
  currentArrangementStep,
  arrangement,
  handleSaveClick,
  loadPattern,
  clearPatternBank,
  addPatternBank,
  createNewPattern
}) {
  return (
    <div style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center", fontSize: "0.65rem" }}>
      <span style={{ color: "#666" }}>PATTERNS:</span>
      {savedPatterns.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: "3px", alignItems: "center", position: "relative" }}>
          <button
            onClick={(e) => handleSaveClick(i, e)}
            style={{
              padding: "3px 8px",
              fontSize: "0.6rem",
              backgroundColor: justSaved === i ? "rgba(78, 205, 196, 0.5)" : p.data ? "rgba(157, 124, 206, 0.3)" : "rgba(157, 124, 206, 0.1)",
              border: justSaved === i ? "1px solid #4ecdc4" : "1px solid rgba(157, 124, 206, 0.3)",
              borderRadius: "3px",
              color: justSaved === i ? "#4ecdc4" : "#9d7cce",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <dc.Icon icon={justSaved === i ? "check" : "save"} style={{ fontSize: "8px" }} />
          </button>
          <button
            className="pattern-letter-btn"
            onClick={() => loadPattern(i)}
            disabled={!p.data}
            style={{
              padding: "3px 8px",
              fontSize: "0.6rem",
              backgroundColor: currentPatternIndex === i ? "rgba(78, 205, 196, 0.4)" : p.data ? "rgba(157, 124, 206, 0.2)" : "rgba(100, 100, 100, 0.1)",
              border: currentPatternIndex === i ? "2px solid #4ecdc4" : "1px solid rgba(157, 124, 206, 0.3)",
              borderRadius: "3px",
              color: currentPatternIndex === i ? "#4ecdc4" : p.data ? "#9d7cce" : "#444",
              cursor: p.data ? "pointer" : "not-allowed",
              opacity: p.data ? 1 : 0.5,
              fontWeight: currentPatternIndex === i ? "bold" : "normal"
            }}
            title={p.data ? `Click to load Pattern ${String.fromCharCode(65 + i)}` : "No pattern saved yet"}
          >
            {String.fromCharCode(65 + i)}
          </button>
          <button
            onClick={() => clearPatternBank(i)}
            disabled={!p.data}
            style={{
              padding: "3px 6px",
              fontSize: "0.5rem",
              backgroundColor: "rgba(255, 165, 0, 0.1)",
              border: "1px solid rgba(255, 165, 0, 0.3)",
              borderRadius: "3px",
              color: "#ffa500",
              cursor: p.data ? "pointer" : "not-allowed",
              opacity: p.data ? 1 : 0.3
            }}
            title={p.data ? `Clear Pattern ${String.fromCharCode(65 + i)} (keeps slot)` : "No pattern to clear"}
          >
            <dc.Icon icon="trash-2" style={{ fontSize: "7px" }} />
          </button>
          {justSaved === i && (
            <div
              style={{
                position: "absolute",
                top: "-25px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.5rem",
                color: "#4ecdc4",
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                padding: "3px 8px",
                borderRadius: "3px",
                whiteSpace: "nowrap",
                pointerEvents: "none"
              }}
            >
              Saved!
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addPatternBank}
        style={{
          padding: "3px 10px",
          fontSize: "0.6rem",
          backgroundColor: "rgba(78, 205, 196, 0.1)",
          border: "1px solid rgba(78, 205, 196, 0.3)",
          borderRadius: "3px",
          color: "#4ecdc4",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "3px"
        }}
      >
        <dc.Icon icon="plus" style={{ fontSize: "8px" }} /> ADD PATTERN
      </button>
      {!arrangementMode && (
        <button
          onClick={createNewPattern}
          style={{
            padding: "3px 10px",
            fontSize: "0.6rem",
            backgroundColor: "rgba(157, 124, 206, 0.1)",
            border: "1px solid rgba(157, 124, 206, 0.3)",
            borderRadius: "3px",
            color: "#9d7cce",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "3px"
          }}
        >
          <dc.Icon icon="file-plus" style={{ fontSize: "8px" }} /> NEW
        </button>
      )}
      {!arrangementMode && currentPatternIndex !== null && (
        <span style={{ marginLeft: "15px", color: "#4ecdc4", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.6rem" }}>
          <dc.Icon icon="edit-3" style={{ fontSize: "10px" }} />
          Editing Pattern {String.fromCharCode(65 + currentPatternIndex)}
        </span>
      )}
      {!arrangementMode && currentPatternIndex === null && (
        <span
          style={{
            marginLeft: "15px",
            color: "#666",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.6rem",
            fontStyle: "italic"
          }}
        >
          <dc.Icon icon="file-text" style={{ fontSize: "10px" }} />
          Working on new pattern
        </span>
      )}
      {arrangementMode && (
        <span style={{ marginLeft: "15px", color: "#9d7cce", display: "flex", alignItems: "center", gap: "8px" }}>
          <dc.Icon icon="arrow-right" style={{ fontSize: "10px" }} />
          {arrangement[currentArrangementStep]?.name || "N/A"}
          <span style={{ color: "#4ecdc4", fontSize: "0.6rem" }}>
            [{arrangement[currentArrangementStep]?.patternIds?.map((id) => String.fromCharCode(65 + id)).join("+") || "None"}]
          </span>
        </span>
      )}
    </div>
  );
}

return { PatternBank };
