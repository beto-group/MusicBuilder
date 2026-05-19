const { useState, useEffect, useRef } = dc;

function DJBoothView({
  dc,
  folderPath,
  Instruments,
  styles,
  Playhead,
  HeaderControls,
  PatternBank,
  ArrangementEditor,
  TrackRow
}) {
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [swing, setSwing] = useState(0);
  const [masterVolume, setMasterVolume] = useState(-10);
  const [currentArrangementStep, setCurrentArrangementStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const performanceMonitorRef = useRef({ lastTime: 0, frameCount: 0, avgFrameTime: 0 });

  const { availableInstruments } = Instruments;

  // START WITH 8 TRACKS (4 enabled, 4 disabled)
  const [tracks, setTracks] = useState([
    { id: "track1", enabled: true, instrument: "kick", color: "#ff6b6b", volume: -10 },
    { id: "track2", enabled: true, instrument: "snare", color: "#4ecdc4", volume: -15 },
    { id: "track3", enabled: true, instrument: "hihat", color: "#ffe66d", volume: -20 },
    { id: "track4", enabled: true, instrument: "bass", color: "#a8dadc", volume: -12 },
    { id: "track5", enabled: false, instrument: "lead", color: "#9d7cce", volume: -14 },
    { id: "track6", enabled: false, instrument: "pad", color: "#b19cd9", volume: -18 },
    { id: "track7", enabled: false, instrument: "clap", color: "#fb5607", volume: -12 },
    { id: "track8", enabled: false, instrument: "noise", color: "#8ecae6", volume: -10 }
  ]);

  const [patterns, setPatterns] = useState({
    track1: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    track2: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    track3: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    track4: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    track5: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    track6: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    track7: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    track8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });

  const [mutes, setMutes] = useState({
    track1: false, track2: false, track3: false, track4: false,
    track5: false, track6: false, track7: false, track8: false
  });

  const [solos, setSolos] = useState({
    track1: false, track2: false, track3: false, track4: false,
    track5: false, track6: false, track7: false, track8: false
  });

  const [arrangement, setArrangement] = useState([
    { patternIds: [0], repeat: 2, name: "Intro" },
    { patternIds: [1], repeat: 4, name: "Main" },
    { patternIds: [2], repeat: 2, name: "Break" },
    { patternIds: [1], repeat: 4, name: "Main" },
    { patternIds: [3], repeat: 2, name: "Outro" }
  ]);

  const [savedPatterns, setSavedPatterns] = useState([
    { name: "Pattern A", data: null },
    { name: "Pattern B", data: null },
    { name: "Pattern C", data: null },
    { name: "Pattern D", data: null }
  ]);

  const [arrangementMode, setArrangementMode] = useState(false);
  const arrangementProgressRef = useRef({ sectionIndex: 0, repeatCount: 0, loopCount: 0 });
  const arrangementRef = useRef(arrangement);
  const currentPatternRef = useRef(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [justSaved, setJustSaved] = useState(null);
  const lastSaveTimeRef = useRef(0);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(null);

  // Refs for live data to avoid restarting audio loops
  const patternsRef = useRef(patterns);
  const tracksRef = useRef(tracks);
  const mutesRef = useRef(mutes);
  const solosRef = useRef(solos);
  const savedPatternsRef = useRef(savedPatterns);
  const currentStepRef = useRef(-1);

  const instrumentsRef = useRef(null);
  const loopRef = useRef(null);
  const masterRef = useRef(null);
  const [isFullTab, setIsFullTab] = useState(true);
  const containerRef = useRef(null);
  const stateRefs = useRef({}).current;
  const instanceId = useRef(Math.random().toString(36).substr(2, 5)).current;
  const uniqueWrapperClass = `djbooth-wrapper-${instanceId}`;

  function findNearestAncestorWithClass(element, className) {
    if (!element) return null;
    let current = element.parentNode;
    while (current) {
      if (current.classList && current.classList.contains(className)) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  }

  function findDirectChildByClass(parent, className) {
    if (!parent) return null;
    for (const child of parent.children) {
      if (child.classList && child.classList.contains(className)) {
        return child;
      }
    }
    return null;
  }

  // Handle Immersive Full-Pane Reparenting
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isFullTab) return;
    const targetPaneContent = findNearestAncestorWithClass(container, "workspace-leaf-content");
    if (!targetPaneContent) {
      setIsFullTab(false);
      return;
    }
    const styleId = `impeccable-status-music-builder`;
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .status-bar, .view-footer, .workspace-leaf-content-footer { 
            display: none !important; 
        }
      `;
      document.head.appendChild(styleEl);
    }

    const contentWrapper = findDirectChildByClass(targetPaneContent, "view-content") || targetPaneContent;
    stateRefs.originalParent = container.parentNode;
    stateRefs.placeholder = document.createElement("div");
    stateRefs.placeholder.style.display = "none";
    container.parentNode.insertBefore(stateRefs.placeholder, container);
    stateRefs.parentPositionInfo = {
      element: contentWrapper,
      original: window.getComputedStyle(contentWrapper).position
    };
    if (stateRefs.parentPositionInfo.original === "static") {
      contentWrapper.style.position = "relative";
    }
    contentWrapper.appendChild(container);
    Object.assign(container.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "9998",
      overflow: "auto"
    });
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();

      if (stateRefs.placeholder?.parentNode) {
        stateRefs.placeholder.parentNode.replaceChild(container, stateRefs.placeholder);
      }
      if (stateRefs.parentPositionInfo?.element) {
        stateRefs.parentPositionInfo.element.style.position =
          stateRefs.parentPositionInfo.original === "static" ? "" : stateRefs.parentPositionInfo.original;
      }
      container.removeAttribute("style");
      Object.keys(stateRefs).forEach((key) => (stateRefs[key] = null));
    };
  }, [isFullTab]);

  // Load Tone.js Dynamic Script CDN
  useEffect(() => {
    if (window.Tone) {
      setReady(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/tone";
      script.onload = () => setReady(true);
      document.body.appendChild(script);
    }
  }, []);

  // Update Transport swing and BPM
  useEffect(() => {
    if (ready && window.Tone) {
      window.Tone.Transport.bpm.value = bpm;
      window.Tone.Transport.swing = swing / 100;
    }
  }, [bpm, swing, ready]);

  // Update Master Gain Volume Node
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.volume.value = masterVolume;
    }
  }, [masterVolume]);

  // Keep live refs in sync
  useEffect(() => { patternsRef.current = patterns; }, [patterns]);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);
  useEffect(() => { mutesRef.current = mutes; }, [mutes]);
  useEffect(() => { solosRef.current = solos; }, [solos]);
  useEffect(() => { savedPatternsRef.current = savedPatterns; }, [savedPatterns]);
  useEffect(() => { arrangementRef.current = arrangement; }, [arrangement]);

  // Sync individual track volumes dynamically
  useEffect(() => {
    if (!instrumentsRef.current) return;
    tracks.forEach((track) => {
      const inst = instrumentsRef.current[track.id];
      if (inst) inst.volume.value = track.volume;
    });
  }, [tracks]);

  // Initialize and Dispose Instrument Voice Node Chains
  useEffect(() => {
    if (!ready || !window.Tone) return;

    const Tone = window.Tone;

    if (instrumentsRef.current) {
      Object.values(instrumentsRef.current).forEach((inst) => {
        if (inst && inst.dispose) {
          try {
            inst.dispose();
          } catch (e) {
            console.warn("[DJ Booth] Error disposing instrument:", e);
          }
        }
      });
    }

    if (masterRef.current) {
      try {
        masterRef.current.dispose();
      } catch (e) {
        console.warn("[DJ Booth] Error disposing master:", e);
      }
    }

    masterRef.current = new Tone.Volume(masterVolume).toDestination();
    instrumentsRef.current = {};

    tracks.forEach((track) => {
      if (track.enabled) {
        const inst = Instruments.createInstrument(Tone, track.instrument, masterRef.current);
        if (inst) {
          inst.volume.value = track.volume;
          instrumentsRef.current[track.id] = inst;
        }
      }
    });

    Tone.Transport.bpm.value = bpm;

    return () => {
      if (instrumentsRef.current) {
        Object.values(instrumentsRef.current).forEach((inst) => {
          if (inst && inst.dispose) {
            try { inst.dispose(); } catch (e) {}
          }
        });
        instrumentsRef.current = null;
      }
      if (masterRef.current) {
        try {
          masterRef.current.dispose();
          masterRef.current = null;
        } catch (e) {}
      }
    };
  }, [ready, tracks]);

  // Main Audio step looping thread hook
  useEffect(() => {
    if (!ready || !window.Tone || !isPlaying) return;

    const Tone = window.Tone;
    let step = 0;
    let frameCount = 0;
    arrangementProgressRef.current = { sectionIndex: 0, repeatCount: 0, loopCount: 0 };
    currentPatternRef.current = 0;

    loopRef.current = new Tone.Loop((time) => {
      const stepIndex = step % 16;
      const prevStep = currentStepRef.current;
      currentStepRef.current = stepIndex;

      if (prevStep !== stepIndex) {
        Tone.Draw.schedule(() => {
          setCurrentStep(stepIndex);
        }, time);
      }

      const currentTracks = tracksRef.current;
      const currentMutes = mutesRef.current;
      const currentSolos = solosRef.current;
      const currentPatterns = patternsRef.current;
      const currentSavedPatterns = savedPatternsRef.current;
      const anySolo = Object.values(currentSolos).some((s) => s);

      if (arrangementMode && stepIndex === 0 && step > 0) {
        const progress = arrangementProgressRef.current;
        progress.loopCount++;

        const currentArrangement = arrangementRef.current;
        if (!currentArrangement || currentArrangement.length === 0) return;

        const section = currentArrangement[progress.sectionIndex];
        const repeatCount = section?.repeat > 0 ? section.repeat : 1;

        if (section && progress.loopCount >= repeatCount) {
          const oldSectionIndex = progress.sectionIndex;
          progress.sectionIndex++;
          progress.loopCount = 0;

          if (progress.sectionIndex >= currentArrangement.length) {
            progress.sectionIndex = 0;
          }

          if (oldSectionIndex !== progress.sectionIndex) {
            const nextSecIndex = progress.sectionIndex;
            Tone.Draw.schedule(() => {
              setCurrentArrangementStep(nextSecIndex);
            }, time);
          }
        }
      }

      const instruments = instrumentsRef.current;
      if (!instruments) return;

      if (arrangementMode) {
        const currentArrangement = arrangementRef.current;
        if (!currentArrangement || currentArrangement.length === 0) return;

        const section = currentArrangement[arrangementProgressRef.current.sectionIndex];
        if (section && section.patternIds && section.patternIds.length > 0) {
          section.patternIds.forEach((patternId) => {
            const savedPattern = currentSavedPatterns[patternId];
            if (!savedPattern?.data) return;

            const patternTracks = savedPattern.data.tracks || [];
            patternTracks.forEach((track) => {
              if (!track.enabled) return;
              if (currentMutes[track.id]) return;
              if (anySolo && !currentSolos[track.id]) return;

              const patternData = savedPattern.data.patterns?.[track.id];
              if (patternData && patternData[stepIndex]) {
                let inst = instruments[track.id];
                if (!inst) {
                  inst = Instruments.createInstrument(Tone, track.instrument, masterRef.current);
                  if (inst) {
                    inst.volume.value = track.volume;
                    instruments[track.id] = inst;
                  }
                }
                if (inst) {
                  Instruments.playNote(inst, track.instrument, Tone, time, stepIndex);
                }
              }
            });
          });
        }
      } else {
        // Pattern mode: play working buffer
        currentTracks.forEach((track) => {
          if (!track.enabled) return;
          if (currentMutes[track.id]) return;
          if (anySolo && !currentSolos[track.id]) return;

          const patternData = currentPatterns[track.id];
          if (patternData && patternData[stepIndex]) {
            const inst = instruments[track.id];
            if (inst) {
              Instruments.playNote(inst, track.instrument, Tone, time, stepIndex);
            }
          }
        });
      }

      step++;
      frameCount++;

      if (step > 16000) {
        step = step % 16;
      }


      if (frameCount > 1600) {
        frameCount = 0;
        if (typeof window !== "undefined" && window.gc) {
          window.gc();
        }
      }
    }, "16n");

    loopRef.current.start(0);
    Tone.Transport.start();

    return () => {
      if (loopRef.current) {
        try {
          loopRef.current.stop();
          loopRef.current.dispose();
          loopRef.current = null;
        } catch (e) {}
      }
      try {
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
      } catch (e) {}
      step = 0;
      frameCount = 0;
    };
  }, [isPlaying, ready, arrangementMode, arrangement]);

  const togglePlay = async () => {
    if (!ready) return;
    if (!isPlaying) {
      await Tone.start();
      arrangementProgressRef.current = { sectionIndex: 0, repeatCount: 0, loopCount: 0 };
      setCurrentArrangementStep(0);
    } else {
      setCurrentStep(-1);
      currentStepRef.current = -1;
    }
    setIsPlaying(!isPlaying);
  };

  const restartSong = () => {
    if (!ready) return;
    arrangementProgressRef.current = { sectionIndex: 0, repeatCount: 0, loopCount: 0 };
    setCurrentArrangementStep(0);
    setCurrentStep(-1);
  };

  const toggleStep = (trackId, stepIndex) => {
    setPatterns((prev) => {
      const newPattern = prev[trackId].map((val, i) => (i === stepIndex ? (val ? 0 : 1) : val));
      const newPatterns = { ...prev, [trackId]: newPattern };
      patternsRef.current = newPatterns;
      return newPatterns;
    });
    if (currentPatternIndex !== null) {
      setCurrentPatternIndex(null);
    }
  };

  const toggleTrack = (trackId) => {
    setTracks((prev) => {
      const updated = prev.map((t) => (t.id === trackId ? { ...t, enabled: !t.enabled } : t));
      tracksRef.current = updated;
      return updated;
    });
  };

  const addTrack = () => {
    const colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8dadc", "#9d7cce", "#b19cd9", "#fb5607", "#8ecae6", "#95e1d3", "#f38181", "#aa96da", "#fcbad3"];
    const trackNumbers = tracks.map((t) => {
      const match = t.id.match(/track(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const nextNumber = Math.max(...trackNumbers, 0) + 1;
    const newTrackId = `track${nextNumber}`;

    const newTrack = {
      id: newTrackId,
      enabled: true,
      instrument: "kick",
      color: colors[tracks.length % colors.length],
      volume: -12
    };

    setTracks((prev) => [...prev, newTrack]);
    setPatterns((prev) => ({ ...prev, [newTrackId]: Array(16).fill(0) }));
    setMutes((prev) => ({ ...prev, [newTrackId]: false }));
    setSolos((prev) => ({ ...prev, [newTrackId]: false }));
  };

  const removeTrack = (trackId) => {
    const usedInPatterns = [];
    savedPatterns.forEach((pattern, index) => {
      if (pattern.data?.patterns?.[trackId]) {
        const hasActiveSteps = pattern.data.patterns[trackId].some((step) => step === 1);
        if (hasActiveSteps) {
          usedInPatterns.push(String.fromCharCode(65 + index));
        }
      }
    });

    if (usedInPatterns.length > 0) {
      const patternList = usedInPatterns.join(", ");
      const message = `WARNING: ${trackId} is used in Pattern${
        usedInPatterns.length > 1 ? "s" : ""
      } ${patternList}!\n\nDeleting this track will remove it from ${
        usedInPatterns.length > 1 ? "these patterns" : "this pattern"
      }.\n\nAre you sure you want to proceed?`;

      if (!confirm(message)) {
        return;
      }
    }

    setTracks((prev) => {
      const filtered = prev.filter((t) => t.id !== trackId);
      tracksRef.current = filtered;
      return filtered;
    });
    setPatterns((prev) => {
      const newPatterns = { ...prev };
      delete newPatterns[trackId];
      patternsRef.current = newPatterns;
      return newPatterns;
    });
    setMutes((prev) => {
      const newMutes = { ...prev };
      delete newMutes[trackId];
      mutesRef.current = newMutes;
      return newMutes;
    });
    setSolos((prev) => {
      const newSolos = { ...prev };
      delete newSolos[trackId];
      solosRef.current = newSolos;
      return newSolos;
    });

    if (usedInPatterns.length > 0) {
      setSavedPatterns((prev) => {
        const updated = prev.map((pattern) => {
          if (pattern.data) {
            const newData = { ...pattern.data };
            if (newData.patterns?.[trackId]) delete newData.patterns[trackId];
            if (newData.tracks) newData.tracks = newData.tracks.filter((t) => t.id !== trackId);
            if (newData.mutes?.[trackId]) {
              const nm = { ...newData.mutes };
              delete nm[trackId];
              newData.mutes = nm;
            }
            if (newData.solos?.[trackId]) {
              const ns = { ...newData.solos };
              delete ns[trackId];
              newData.solos = ns;
            }
            return { ...pattern, data: newData };
          }
          return pattern;
        });
        savedPatternsRef.current = updated;
        return updated;
      });
    }
  };

  const changeInstrument = (trackId, instrumentId) => {
    setTracks((prev) => prev.map((t) => (t.id === trackId ? { ...t, instrument: instrumentId } : t)));
  };

  const setVolume = (trackId, vol) => {
    setTracks((prev) => prev.map((t) => (t.id === trackId ? { ...t, volume: vol } : t)));
  };

  const clearPattern = (trackId) => {
    setPatterns((prev) => {
      const newPatterns = { ...prev, [trackId]: Array(16).fill(0) };
      patternsRef.current = newPatterns;
      return newPatterns;
    });
    if (currentPatternIndex !== null) setCurrentPatternIndex(null);
  };

  const randomizePattern = (trackId) => {
    setPatterns((prev) => {
      const newPatterns = {
        ...prev,
        [trackId]: Array(16).fill(0).map(() => (Math.random() > 0.6 ? 1 : 0))
      };
      patternsRef.current = newPatterns;
      return newPatterns;
    });
    if (currentPatternIndex !== null) setCurrentPatternIndex(null);
  };

  const toggleMute = (trackId) => {
    setMutes((prev) => {
      const updated = { ...prev, [trackId]: !prev[trackId] };
      mutesRef.current = updated;
      return updated;
    });
  };

  const toggleSolo = (trackId) => {
    setSolos((prev) => {
      const updated = { ...prev, [trackId]: !prev[trackId] };
      solosRef.current = updated;
      return updated;
    });
  };

  const savePattern = (index) => {
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 100) return;
    lastSaveTimeRef.current = now;

    const snapshot = {
      tracks: tracks.map((track) => ({ ...track })),
      patterns: {},
      mutes: { ...mutes },
      solos: { ...solos }
    };

    tracks.forEach((track) => {
      snapshot.patterns[track.id] = [...patterns[track.id]];
    });

    setSavedPatterns((prev) => {
      const newPatterns = [...prev];
      newPatterns[index] = {
        name: newPatterns[index]?.name || `Pattern ${String.fromCharCode(65 + index)}`,
        data: snapshot
      };
      savedPatternsRef.current = newPatterns;
      return newPatterns;
    });

    setCurrentPatternIndex(index);
    setJustSaved(index);
    setTimeout(() => { setJustSaved(null); }, 800);
  };

  const loadPattern = (index) => {
    const saved = savedPatterns[index];
    if (!saved?.data) return;

    if (saved.data.tracks) {
      const restoredTracks = saved.data.tracks.map((track) => ({ ...track }));
      setTracks(restoredTracks);
      tracksRef.current = restoredTracks;
    }
    if (saved.data.patterns) {
      const restoredPatterns = { ...saved.data.patterns };
      setPatterns(restoredPatterns);
      patternsRef.current = restoredPatterns;
    }
    if (saved.data.mutes) {
      setMutes(saved.data.mutes);
      mutesRef.current = saved.data.mutes;
    }
    if (saved.data.solos) {
      setSolos(saved.data.solos);
      solosRef.current = saved.data.solos;
    }
    setCurrentPatternIndex(index);
  };

  const createNewPattern = () => {
    const clearedPatterns = {};
    tracks.forEach((track) => {
      clearedPatterns[track.id] = Array(16).fill(0);
    });
    setPatterns(clearedPatterns);
    setTracks((prev) => prev.map((t) => ({ ...t, enabled: true })));
    setCurrentPatternIndex(null);
  };

  const handleSaveClick = (index, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setTimeout(() => { savePattern(index); }, 0);
  };

  const addPatternBank = () => {
    const nextLetter = String.fromCharCode(65 + savedPatterns.length);
    setSavedPatterns((prev) => [...prev, { name: `Pattern ${nextLetter}`, data: null }]);
  };

  const clearPatternBank = (index) => {
    setSavedPatterns((prev) => {
      const newPatterns = [...prev];
      newPatterns[index] = {
        name: newPatterns[index]?.name || `Pattern ${String.fromCharCode(65 + index)}`,
        data: null
      };
      savedPatternsRef.current = newPatterns;
      return newPatterns;
    });
    if (currentPatternIndex === index) {
      setCurrentPatternIndex(null);
    }
  };

  // Sync arrangement step displays
  useEffect(() => {
    if (!arrangementMode) return;
    if (isPlaying) return;

    const section = arrangement[currentArrangementStep];
    if (section && section.patternIds && section.patternIds.length > 0) {
      const firstPatternId = section.patternIds[0];
      const saved = savedPatternsRef.current[firstPatternId];
      if (!saved?.data) return;
      loadPattern(firstPatternId);
    }
  }, [currentArrangementStep, arrangementMode, isPlaying]);

  const addArrangementSection = () => {
    setArrangement((prev) => [...prev, { patternIds: [0], repeat: 2, name: `Section ${prev.length + 1}` }]);
  };

  const removeArrangementSection = (index) => {
    if (arrangement.length <= 1) return;
    setArrangement((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArrangementSection = (index, field, value) => {
    setArrangement((prev) =>
      prev.map((section, i) => (i === index ? { ...section, [field]: value } : section))
    );
  };

  const togglePatternInSection = (sectionIndex, patternId) => {
    setArrangement((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;
        const patternIds = [...section.patternIds];
        const idIndex = patternIds.indexOf(patternId);
        if (idIndex >= 0) {
          patternIds.splice(idIndex, 1);
          if (patternIds.length === 0) patternIds.push(patternId);
        } else {
          patternIds.push(patternId);
          patternIds.sort((a, b) => a - b);
        }
        return { ...section, patternIds };
      })
    );
  };

  const exportSong = () => {
    const songData = {
      version: "1.0",
      bpm,
      swing,
      masterVolume,
      tracks: tracks.map((t) => ({
        id: t.id,
        enabled: t.enabled,
        instrument: t.instrument,
        color: t.color,
        volume: t.volume
      })),
      patterns,
      savedPatterns,
      arrangement,
      mutes,
      solos,
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(songData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `djbooth-song-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAudio = async () => {
    if (!ready || !window.Tone || !masterRef.current) return;
    setShowExportMenu(false);

    try {
      let totalBars = 0;
      if (arrangementMode) {
        arrangement.forEach((section) => {
          totalBars += section.repeat;
        });
      } else {
        totalBars = 4;
      }

      const duration = (totalBars * 4 * 60) / bpm;
      const recorder = new Tone.Recorder();
      masterRef.current.connect(recorder);

      await Tone.start();
      await recorder.start();

      const anySolo = Object.values(solos).some((s) => s);
      let step = 0;
      const progress = { sectionIndex: 0, loopCount: 0 };

      const recordLoop = new Tone.Loop((time) => {
        const stepIndex = step % 16;

        if (arrangementMode && stepIndex === 0 && step > 0) {
          progress.loopCount++;
          const section = arrangement[progress.sectionIndex];
          if (section && progress.loopCount >= section.repeat) {
            progress.sectionIndex++;
            progress.loopCount = 0;
            if (progress.sectionIndex >= arrangement.length) {
              return;
            }
          }
        }

        const instruments = instrumentsRef.current;
        if (!instruments) return;

        if (arrangementMode) {
          const section = arrangement[progress.sectionIndex];
          if (section && section.patternIds && section.patternIds.length > 0) {
            section.patternIds.forEach((patternId) => {
              const savedPattern = savedPatterns[patternId];
              if (!savedPattern?.data) return;

              const patternTracks = savedPattern.data.tracks || [];
              patternTracks.forEach((track) => {
                if (!track.enabled) return;
                if (mutes[track.id]) return;
                if (anySolo && !solos[track.id]) return;

                const patternData = savedPattern.data.patterns?.[track.id];
                if (patternData && patternData[stepIndex]) {
                  let inst = instruments[track.id];
                  if (!inst) {
                    inst = Instruments.createInstrument(Tone, track.instrument, masterRef.current);
                    if (inst) {
                      inst.volume.value = track.volume;
                      instruments[track.id] = inst;
                    }
                  }
                  if (inst) {
                    Instruments.playNote(inst, track.instrument, Tone, time, stepIndex);
                  }
                }
              });
            });
          }
        } else {
          tracks.forEach((track) => {
            if (!track.enabled) return;
            if (mutes[track.id]) return;
            if (anySolo && !solos[track.id]) return;

            const patternData = patterns[track.id];
            if (patternData && patternData[stepIndex]) {
              const inst = instruments[track.id];
              if (inst) {
                Instruments.playNote(inst, track.instrument, Tone, time, stepIndex);
              }
            }
          });
        }

        step++;

        if (arrangementMode && progress.sectionIndex >= arrangement.length) {
          setTimeout(() => {
            recordLoop.stop();
            Tone.Transport.stop();
          }, 100);
        } else if (!arrangementMode && step >= totalBars * 16) {
          setTimeout(() => {
            recordLoop.stop();
            Tone.Transport.stop();
          }, 100);
        }
      }, "16n");

      recordLoop.start(0);
      Tone.Transport.start();

      setTimeout(async () => {
        try {
          recordLoop.stop();
          Tone.Transport.stop();

          const recording = await recorder.stop();
          const url = URL.createObjectURL(recording);
          const link = document.createElement("a");
          link.href = url;
          link.download = `djbooth-audio-${Date.now()}.webm`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);

          recordLoop.dispose();
          console.log("Audio exported successfully!");
        } catch (err) {
          console.error("Export error:", err);
          alert("Export failed. Please try again.");
        }
      }, duration * 1000 + 500);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Please try again.");
    }
  };

  const importSong = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const songData = JSON.parse(e.target.result);

        if (songData.version && songData.tracks) {
          setBpm(songData.bpm || 120);
          setSwing(songData.swing || 0);
          setMasterVolume(songData.masterVolume || -10);
          setTracks(songData.tracks || []);
          setPatterns(songData.patterns || {});
          setSavedPatterns(songData.savedPatterns || []);
          setArrangement(songData.arrangement || []);
          setMutes(songData.mutes || {});
          setSolos(songData.solos || {});
          console.log("Song loaded successfully!");
        }
      } catch (error) {
        console.error("Error loading song:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  if (!isFullTab) {
    return (
      <div
        ref={containerRef}
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          border: "1px dashed rgba(157, 124, 206, 0.3)",
          borderRadius: "8px",
          backgroundColor: "#0a0a0a"
        }}
      >
        <dc.Icon icon="music" style={{ fontSize: "48px", color: "#9d7cce" }} />
        <p style={{ margin: 0, color: "#666" }}>DJ Booth in compact mode</p>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#9d7cce",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
          onClick={() => setIsFullTab(true)}
        >
          Enter Full Tab
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <style>{styles.css}</style>
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "monospace",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        className={`${uniqueWrapperClass} djbooth-wrapper`}
      >
        <div
          className="exit-icon"
          style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", zIndex: 10 }}
          onClick={() => setIsFullTab(false)}
        >
          <dc.Icon icon="x" style={{ fontSize: "20px", color: "#aaa" }} />
        </div>

        <HeaderControls
          dc={dc}
          ready={ready}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          bpm={bpm}
          setBpm={setBpm}
          swing={swing}
          setSwing={setSwing}
          masterVolume={masterVolume}
          setMasterVolume={setMasterVolume}
          arrangementMode={arrangementMode}
          setArrangementMode={setArrangementMode}
          restartSong={restartSong}
          showExportMenu={showExportMenu}
          setShowExportMenu={setShowExportMenu}
          exportSong={exportSong}
          exportAudio={exportAudio}
          importSong={importSong}
        />

        <div style={{ padding: "0 30px" }}>
          <PatternBank
            dc={dc}
            savedPatterns={savedPatterns}
            justSaved={justSaved}
            currentPatternIndex={currentPatternIndex}
            arrangementMode={arrangementMode}
            currentArrangementStep={currentArrangementStep}
            arrangement={arrangement}
            handleSaveClick={handleSaveClick}
            loadPattern={loadPattern}
            clearPatternBank={clearPatternBank}
            addPatternBank={addPatternBank}
            createNewPattern={createNewPattern}
          />

          {arrangementMode && (
            <ArrangementEditor
              dc={dc}
              arrangement={arrangement}
              savedPatterns={savedPatterns}
              currentArrangementStep={currentArrangementStep}
              isPlaying={isPlaying}
              addArrangementSection={addArrangementSection}
              removeArrangementSection={removeArrangementSection}
              updateArrangementSection={updateArrangementSection}
              togglePatternInSection={togglePatternInSection}
            />
          )}
        </div>

        <div
          className="djbooth-scroll"
          style={{
            flex: 1,
            padding: "15px 30px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "relative"
          }}
        >
          <Playhead isPlaying={isPlaying} currentStep={currentStep} trackCount={tracks.length} />

          {tracks.map((track) => {
            const displayPattern = (() => {
              if (arrangementMode) {
                const section = arrangement[currentArrangementStep];
                if (section && section.patternIds && section.patternIds.length > 0) {
                  let merged = new Array(16).fill(0);
                  section.patternIds.forEach((patternId) => {
                    const savedPattern = savedPatterns[patternId];
                    if (savedPattern?.data?.patterns?.[track.id]) {
                      savedPattern.data.patterns[track.id].forEach((val, i) => {
                        if (val) merged[i] = 1;
                      });
                    }
                  });
                  return merged;
                }
              }
              return patterns[track.id] || Array(16).fill(0);
            })();

            const patternHash = displayPattern.join("");

            return (
              <TrackRow
                key={`${track.id}-${track.enabled}-${patternHash}`}
                dc={dc}
                track={track}
                displayPattern={displayPattern}
                currentStep={currentStep}
                isPlaying={isPlaying}
                mutes={mutes}
                solos={solos}
                availableInstruments={availableInstruments}
                tracksCount={tracks.length}
                toggleTrack={toggleTrack}
                changeInstrument={changeInstrument}
                setVolume={setVolume}
                toggleMute={toggleMute}
                toggleSolo={toggleSolo}
                randomizePattern={randomizePattern}
                clearPattern={clearPattern}
                removeTrack={removeTrack}
                toggleStep={toggleStep}
              />
            );
          })}

          <button
            onClick={addTrack}
            style={{
              padding: "12px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              backgroundColor: "rgba(157, 124, 206, 0.1)",
              border: "2px dashed rgba(157, 124, 206, 0.4)",
              borderRadius: "6px",
              color: "#9d7cce",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s"
            }}
          >
            <dc.Icon icon="plus-circle" style={{ fontSize: "16px" }} />
            Add Track
          </button>
        </div>

        <div
          style={{
            padding: "10px 30px",
            borderTop: "1px solid rgba(157, 124, 206, 0.1)",
            backgroundColor: "#0a0a0a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ fontSize: "0.65rem", color: "#555" }}>
            {ready ? "Audio Engine Ready" : "Loading Tone.js..."}
          </div>
          <div style={{ fontSize: "0.55rem", color: "#444", display: "flex", gap: "12px" }}>
            <span>{tracks.filter((t) => t.enabled).length} Active Tracks</span>
            <span>16 Steps</span>
            <span>{bpm} BPM</span>
            {arrangementMode && isPlaying && (
              <span style={{ color: "#4ecdc4" }}>
                Section: {currentArrangementStep + 1}/{arrangement.length}
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#666" }}>Powered by Tone.js</div>
        </div>
      </div>
    </div>
  );
}

return { DJBoothView };
