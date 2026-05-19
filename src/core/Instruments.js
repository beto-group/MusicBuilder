const availableInstruments = {
  drums: [
    { id: "kick", name: "Kick Drum", icon: "drum" },
    { id: "snare", name: "Snare", icon: "circle-dot" },
    { id: "hihat", name: "Hi-Hat", icon: "disc" },
    { id: "openhat", name: "Open Hat", icon: "disc-2" },
    { id: "clap", name: "Clap", icon: "hand" },
    { id: "rim", name: "Rimshot", icon: "circle" },
    { id: "tom", name: "Tom", icon: "hexagon" },
    { id: "cowbell", name: "Cowbell", icon: "bell" }
  ],
  synths: [
    { id: "bass", name: "Bass Synth", icon: "wave-square" },
    { id: "lead", name: "Lead Synth", icon: "zap" },
    { id: "pad", name: "Pad Synth", icon: "cloud" },
    { id: "pluck", name: "Pluck Synth", icon: "music" },
    { id: "arp", name: "Arpeggiator", icon: "activity" }
  ],
  fx: [
    { id: "noise", name: "Noise FX", icon: "sparkles" },
    { id: "riser", name: "Riser", icon: "trending-up" },
    { id: "impact", name: "Impact", icon: "zap-off" }
  ]
};

function createInstrument(Tone, type, masterVolumeNode) {
  if (!masterVolumeNode) return null;

  switch (type) {
    case "kick":
      return new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
      }).connect(masterVolumeNode);
    case "snare":
      return new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
      }).connect(masterVolumeNode);
    case "hihat":
      return new Tone.MetalSynth({
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }).connect(masterVolumeNode);
    case "openhat":
      return new Tone.MetalSynth({
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.4, release: 0.3 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }).connect(masterVolumeNode);
    case "clap":
      return new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0 }
      }).connect(masterVolumeNode);
    case "rim":
      return new Tone.MetalSynth({
        frequency: 400,
        envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
        harmonicity: 8,
        modulationIndex: 16
      }).connect(masterVolumeNode);
    case "tom":
      return new Tone.MembraneSynth({
        pitchDecay: 0.08,
        octaves: 4,
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.8 }
      }).connect(masterVolumeNode);
    case "cowbell":
      return new Tone.MetalSynth({
        frequency: 540,
        envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
        harmonicity: 2.5,
        modulationIndex: 20
      }).connect(masterVolumeNode);
    case "bass":
      return new Tone.MonoSynth({
        oscillator: { type: "sawtooth" },
        filter: { Q: 2, type: "lowpass", rolloff: -24 },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.8 },
        filterEnvelope: { attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.5, baseFrequency: 80, octaves: 4 }
      }).connect(masterVolumeNode);
    case "lead":
      return new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.4 }
      }).connect(masterVolumeNode);
    case "pad":
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.5, decay: 0.2, sustain: 0.7, release: 2 }
      }).connect(masterVolumeNode);
    case "pluck":
      return new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.9
      }).connect(masterVolumeNode);
    case "arp":
      return new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
      }).connect(masterVolumeNode);
    case "noise":
      return new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.1, decay: 0.5, sustain: 0.2, release: 1 }
      }).connect(masterVolumeNode);
    case "riser":
      return new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 2, decay: 0.5, sustain: 0.5, release: 2 }
      }).connect(masterVolumeNode);
    case "impact":
      return new Tone.NoiseSynth({
        noise: { type: "brown" },
        envelope: { attack: 0.001, decay: 0.8, sustain: 0, release: 0 }
      }).connect(masterVolumeNode);
    default:
      return null;
  }
}

function playNote(instrument, instrumentType, Tone, time, stepIndex) {
  try {
    const isDrum = ["kick", "snare", "hihat", "openhat", "clap", "rim", "tom", "cowbell", "noise", "riser", "impact"].includes(instrumentType);
    if (isDrum) {
      if (instrumentType === "kick") instrument.triggerAttackRelease("C1", "8n", time);
      else if (instrumentType === "tom") instrument.triggerAttackRelease("G1", "8n", time);
      else if (instrumentType === "cowbell") instrument.triggerAttackRelease("32n", time);
      else instrument.triggerAttackRelease("16n", time);
    } else {
      const notes = {
        bass: ["C2", "E2", "G2", "A2"],
        lead: ["C4", "E4", "G4", "B4", "D5"],
        pluck: ["C3", "E3", "G3", "B3", "C4"],
        arp: ["C5", "E5", "G5", "C6"]
      };
      const noteSet = notes[instrumentType] || ["C3", "E3", "G3"];
      if (instrumentType === "pad") {
        const chords = [["C3", "E3", "G3"], ["A2", "C3", "E3"], ["F2", "A2", "C3"], ["G2", "B2", "D3"]];
        const chord = chords[Math.floor(stepIndex / 4) % 4];
        instrument.triggerAttackRelease(chord, "2n", time);
      } else {
        const note = noteSet[stepIndex % noteSet.length];
        instrument.triggerAttackRelease(note, "8n", time);
      }
    }
  } catch (e) {
    console.warn("[Instruments] Playback warning:", e.message);
  }
}

export { availableInstruments, createInstrument, playNote };
