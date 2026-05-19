function ArrangementEditor({
  dc,
  arrangement,
  savedPatterns,
  currentArrangementStep,
  isPlaying,
  addArrangementSection,
  removeArrangementSection,
  updateArrangementSection,
  togglePatternInSection
}) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "12px",
        backgroundColor: "rgba(157, 124, 206, 0.05)",
        border: "1px solid rgba(157, 124, 206, 0.2)",
        borderRadius: "6px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: "bold",
            color: "#9d7cce",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <dc.Icon icon="list-music" style={{ fontSize: "12px" }} />
          ARRANGEMENT EDITOR
        </span>
        <button
          onClick={addArrangementSection}
          style={{
            padding: "4px 10px",
            fontSize: "0.6rem",
            backgroundColor: "rgba(157, 124, 206, 0.2)",
            border: "1px solid rgba(157, 124, 206, 0.4)",
            borderRadius: "3px",
            color: "#9d7cce",
            cursor: "pointer"
          }}
        >
          <dc.Icon icon="plus" style={{ fontSize: "8px" }} /> Add Section
        </button>
      </div>
      {savedPatterns.every((p) => !p.data) && (
        <div
          style={{
            padding: "8px 12px",
            marginBottom: "10px",
            backgroundColor: "rgba(255, 193, 7, 0.1)",
            border: "1px solid rgba(255, 193, 7, 0.3)",
            borderRadius: "4px",
            fontSize: "0.65rem",
            color: "#ffc107",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <dc.Icon icon="alert-triangle" style={{ fontSize: "14px" }} />
          <span>No patterns saved! Save your working patterns (A, B, C, D...) before using arrangement mode.</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {arrangement.map((section, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px",
              backgroundColor: currentArrangementStep === index && isPlaying ? "rgba(78, 205, 196, 0.1)" : "rgba(0, 0, 0, 0.3)",
              border:
                currentArrangementStep === index && isPlaying
                  ? "1px solid rgba(78, 205, 196, 0.5)"
                  : "1px solid rgba(157, 124, 206, 0.1)",
              borderRadius: "4px",
              flexWrap: "wrap"
            }}
          >
            <span style={{ fontSize: "0.6rem", color: "#666", minWidth: "20px" }}>{index + 1}.</span>
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
              {savedPatterns.map((p, i) => (
                <button
                   key={i}
                   onClick={() => togglePatternInSection(index, i)}
                   disabled={!p.data}
                   style={{
                     padding: "3px 8px",
                     fontSize: "0.6rem",
                     backgroundColor: section.patternIds.includes(i) ? "rgba(78, 205, 196, 0.3)" : "rgba(100, 100, 100, 0.1)",
                     border: section.patternIds.includes(i) ? "1px solid rgba(78, 205, 196, 0.5)" : "1px solid rgba(157, 124, 206, 0.2)",
                     borderRadius: "3px",
                     color: section.patternIds.includes(i) ? "#4ecdc4" : p.data ? "#9d7cce" : "#444",
                     cursor: p.data ? "pointer" : "not-allowed",
                     opacity: p.data ? 1 : 0.3,
                     fontWeight: section.patternIds.includes(i) ? "bold" : "normal"
                   }}
                >
                  {String.fromCharCode(65 + i)}
                </button>
              ))}
            </div>
            <span style={{ fontSize: "0.6rem", color: "#666" }}>x</span>
            <input
              type="number"
              min="0"
              max="16"
              value={section.repeat}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  updateArrangementSection(index, "repeat", "");
                } else {
                  updateArrangementSection(index, "repeat", parseInt(val) || 0);
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  updateArrangementSection(index, "repeat", 0);
                }
              }}
              style={{
                padding: "4px 6px",
                fontSize: "0.65rem",
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(157, 124, 206, 0.3)",
                borderRadius: "3px",
                color: "#9d7cce",
                width: "50px"
              }}
            />
            <input
              type="text"
              value={section.name}
              onChange={(e) => updateArrangementSection(index, "name", e.target.value)}
              placeholder="Section name"
              style={{
                padding: "4px 8px",
                fontSize: "0.65rem",
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(157, 124, 206, 0.3)",
                borderRadius: "3px",
                color: "#9d7cce",
                flex: 1,
                minWidth: "100px"
              }}
            />
            <button
              onClick={() => removeArrangementSection(index)}
              disabled={arrangement.length <= 1}
              style={{
                padding: "4px 8px",
                fontSize: "0.6rem",
                backgroundColor: "rgba(255, 107, 107, 0.2)",
                border: "1px solid rgba(255, 107, 107, 0.4)",
                borderRadius: "3px",
                color: "#ff6b6b",
                cursor: arrangement.length > 1 ? "pointer" : "not-allowed",
                opacity: arrangement.length > 1 ? 1 : 0.3
              }}
            >
              <dc.Icon icon="x" style={{ fontSize: "8px" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

return { ArrangementEditor };
