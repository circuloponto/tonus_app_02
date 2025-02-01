import React, { useState } from 'react';
import './VoiceLeadingCalculator.css';

// Music theory utilities
const noteToNumber = {
  "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3,
  "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8,
  "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11
};

const numberToNote = {
  0: "C", 1: "C#", 2: "D", 3: "Eb", 4: "E", 5: "F",
  6: "F#", 7: "G", 8: "Ab", 9: "A", 10: "Bb", 11: "B"
};

const standardTuning = ["E", "B", "G", "D", "A", "E"]; // high to low

// Voice leading calculation functions
const noteDistance = (note1, note2) => {
  const n1 = noteToNumber[note1];
  const n2 = noteToNumber[note2];
  const diff = Math.abs(n2 - n1);
  const octave = 12;
  return Math.min(diff, octave - diff);
};

const absolutePitch = (note) => {
  const basePitch = noteToNumber[note];
  const octave = 4; // assuming middle octave
  return basePitch + (octave * 12);
};

const hasVoiceCrossing = (chord1, chord2) => {
  const pitches1 = chord1.map(absolutePitch).sort((a, b) => a - b);
  const pitches2 = chord2.map(absolutePitch).sort((a, b) => a - b);
  return !pitches1.every((p, i) => p <= pitches2[i]);
};

const permutations = (arr) => {
  if (arr.length <= 1) return [arr];
  return arr.reduce((perms, item, i) => {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    return perms.concat(
      permutations(rest).map(p => [item, ...p])
    );
  }, []);
};

const findVoiceLeading = (chord1, chord2) => {
  const perms = permutations(chord2)
    .map(perm => {
      const voices = chord1.map((note, i) => [note, perm[i]]);
      const totalDistance = voices.reduce((sum, [n1, n2]) => sum + noteDistance(n1, n2), 0);
      return { voices, totalDistance };
    })
    .filter(({ voices }) => !hasVoiceCrossing(
      voices.map(([n1]) => n1),
      voices.map(([, n2]) => n2)
    ));

  if (perms.length === 0) {
    return {
      voices: chord1.map((note, i) => [note, chord2[i]]),
      totalDistance: -1,
      warning: "No voice leading found without crossing"
    };
  }

  return perms.reduce((best, current) => 
    current.totalDistance < best.totalDistance ? current : best
  );
};

const findBestProgressionVoicing = (chords) => {
  if (chords.length < 2) return { path: chords };

  const initialChord = chords[0];
  const remainingChords = chords.slice(1);
  
  // Generate all possible voicings for each chord
  const chordVoicings = remainingChords.map(chord => permutations(chord));
  
  // Generate all possible paths
  let allPaths = [[initialChord]];
  chordVoicings.forEach(voicings => {
    allPaths = allPaths.flatMap(path => 
      voicings.map(voicing => [...path, voicing])
    );
  });

  // Calculate costs for each path
  const pathsWithDistances = allPaths.map(path => {
    const movementCost = path.slice(1).reduce((total, chord, i) => {
      const prevChord = path[i];
      return total + prevChord.reduce((sum, note, j) => 
        sum + noteDistance(note, chord[j]), 0
      );
    }, 0);

    const crossingCost = path.slice(1).reduce((total, chord, i) => {
      const prevChord = path[i];
      return total + (hasVoiceCrossing(prevChord, chord) ? 5 : 0);
    }, 0);

    return {
      path,
      totalDistance: movementCost + crossingCost,
      movementCost,
      crossingCost
    };
  });

  const bestResult = pathsWithDistances.reduce((best, current) => 
    current.totalDistance < best.totalDistance ? current : best
  );

  return bestResult;
};

// Guitar-specific functions
const noteFretPositions = (stringNote, targetNote) => {
  const stringNum = noteToNumber[stringNote];
  const targetNum = noteToNumber[targetNote];
  return (targetNum - stringNum + 12) % 12;
};

const getFretPositions = (note, string) => {
  const fret = noteFretPositions(string, note);
  return { string: standardTuning.indexOf(string) + 1, fret };
};

const notesToFretPositions = (notes, maxFret = 12) => {
  return notes.flatMap(note => 
    standardTuning.map(string => getFretPositions(note, string))
      .filter(pos => pos.fret <= maxFret)
  );
};

const fretPositionsToNotes = (fretPositions) => {
  return fretPositions.map(({ string, fret }) => {
    const stringNote = standardTuning[string - 1];
    const stringNum = noteToNumber[stringNote];
    const noteNum = (stringNum + fret) % 12;
    return numberToNote[noteNum];
  });
};

const initialChords = [
  ["C", "E", "G"],  // C major
  ["A", "C", "E"],  // A minor
  ["D", "F", "A"]   // D minor
];

export function VoiceLeadingCalculator() {
  const [state, setState] = useState({
    progression: initialChords,
    maxFret: 12,
    voicedProgression: null,
    calculating: false,
    error: null
  });

  const calculateVoiceLeading = () => {
    setState(prev => ({ ...prev, calculating: true, error: null }));
    
    try {
      // Find best voice leading path
      const result = findBestProgressionVoicing(state.progression);
      
      // Convert each chord in the path to fret positions
      const fretPositions = result.path.map(chord => 
        notesToFretPositions(chord, state.maxFret)
      );

      setState(prev => ({
        ...prev,
        calculating: false,
        voicedProgression: fretPositions
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        calculating: false,
        error: error.message || "Error calculating voice leading"
      }));
    }
  };

  const FretboardDiagram = ({ positions }) => {
    const maxFret = Math.max(...positions.map(pos => pos.fret));
    const stringNames = ["E", "B", "G", "D", "A", "E"];

    return (
      <div className="fretboard">
        <div className="nut" />
        {[1, 2, 3, 4, 5, 6].map(string => (
          <div key={`string-${string}`} className="string">
            {Array.from({ length: maxFret + 1 }, (_, fret) => (
              <div key={`fret-${fret}`} className="fret">
                {fret === 0 && (
                  <div className="open-string">{stringNames[string - 1]}</div>
                )}
                {positions.some(pos => pos.string === string && pos.fret === fret) && (
                  <div className="note" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const TabNotation = ({ positions }) => {
    const stringNames = ["E", "B", "G", "D", "A", "E"];
    
    return (
      <div className="tab-notation">
        {[1, 2, 3, 4, 5, 6].map(string => (
          <div key={`tab-string-${string}`} className="tab-string">
            <span className="string-name">{stringNames[string - 1]}</span>
            <span className="tab-line">
              {positions.find(pos => pos.string === string)?.fret || "-"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const formatPosition = ({ string, fret }) => {
    const stringNames = {
      1: "high E",
      2: "B",
      3: "G",
      4: "D",
      5: "A",
      6: "low E"
    };
    return `String ${string} (${stringNames[string]}), Fret ${fret}`;
  };

  const formatChordPosition = (positions) => {
    return positions
      .sort((a, b) => a.string - b.string)
      .map(formatPosition)
      .join("\n");
  };

  const ChordInput = ({ chordIndex, chord }) => (
    <div className="chord-input">
      {chord.map((note, noteIndex) => (
        <input
          key={`${chordIndex}-${noteIndex}`}
          type="text"
          value={note}
          placeholder="Note"
          onChange={(e) => {
            const newProgression = [...state.progression];
            newProgression[chordIndex][noteIndex] = e.target.value.toUpperCase();
            setState(prev => ({ ...prev, progression: newProgression }));
          }}
        />
      ))}
    </div>
  );

  const MaxFretInput = () => (
    <div className="max-fret-input">
      <label>Max Fret: </label>
      <input
        type="number"
        min={1}
        max={24}
        value={state.maxFret}
        onChange={(e) => setState(prev => ({ 
          ...prev, 
          maxFret: parseInt(e.target.value, 10) 
        }))}
      />
    </div>
  );

  const ProgressionInput = () => (
    <div className="progression-input">
      <h3>Enter Chord Progression</h3>
      <MaxFretInput />
      {state.progression.map((chord, index) => (
        <div key={index} className="chord-container">
          <h4>Chord {index + 1}</h4>
          <ChordInput chordIndex={index} chord={chord} />
        </div>
      ))}
    </div>
  );

  const LoadingIndicator = () => (
    state.calculating ? (
      <div className="loading">
        <div className="spinner" />
        Finding optimal voice leading...
      </div>
    ) : null
  );

  const ErrorDisplay = () => (
    state.error ? <div className="error">{state.error}</div> : null
  );

  const VoiceLeadingResult = () => (
    state.voicedProgression ? (
      <div className="voice-leading-result">
        <h3>Guitar Voice Leading Result</h3>
        {state.voicedProgression.map((positions, index) => (
          <div key={index} className="voiced-chord">
            <div className="chord-number">Chord {index + 1}</div>
            <FretboardDiagram positions={positions} />
            <TabNotation positions={positions} />
            <div className="positions">
              {index > 0 ? "↓\n" : ""}
              {formatChordPosition(positions)}
            </div>
          </div>
        ))}
      </div>
    ) : null
  );

  return (
    <div className="container">
      <h1>Guitar Voice Leading Calculator</h1>
      <p className="description">
        Enter chords using note names (e.g., C, F#, Bb). The calculator will find 
        optimal voice leading positions on the fretboard.
      </p>
      <ProgressionInput />
      <button
        className="calculate"
        onClick={calculateVoiceLeading}
        disabled={state.calculating}
      >
        {state.calculating ? "Calculating..." : "Calculate Voice Leading"}
      </button>
      <ErrorDisplay />
      <LoadingIndicator />
      <VoiceLeadingResult />
    </div>
  );
}
