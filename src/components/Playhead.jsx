export function Playhead({ isPlaying, currentStep, trackCount }) {
  if (!isPlaying || currentStep < 0 || trackCount === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(30px + (${currentStep} * ((100% - 60px) / 16)))`,
        top: "0",
        height: "100%",
        width: "3px",
        backgroundColor: "rgba(78, 205, 196, 0.9)",
        boxShadow: "0 0 15px rgba(78, 205, 196, 0.8), 0 0 30px rgba(78, 205, 196, 0.4)",
        pointerEvents: "none",
        zIndex: 1000,
        transition: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-5px",
          left: "-5px",
          width: "13px",
          height: "13px",
          backgroundColor: "rgba(78, 205, 196, 1)",
          borderRadius: "50%",
          boxShadow: "0 0 20px rgba(78, 205, 196, 1)"
        }}
      />
    </div>
  );
}
