import React, { useState } from 'react';
import MiniFretboard from './MiniFretboard';
/* import './VoiceLeadingSection.css'; */

const VoiceLeadingSection = ({ onVoiceLeadingCalculated }) => {
  const [selectedChords, setSelectedChords] = useState([]);
  const [miniFretboardPositions, setMiniFretboardPositions] = useState([0, 0, 0, 0, 0]);
  const [selectedMiniFretboard, setSelectedMiniFretboard] = useState(null);

  return (
    <div className="voice-leading-section">
      <div className="mini-fretboards">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="mini-fretboard-container">
            <div className="mini-fretboard-controls">
              <button 
                onClick={() => {
                  const newPositions = [...miniFretboardPositions];
                  newPositions[i] = Math.max(0, miniFretboardPositions[i] - 1);
                  setMiniFretboardPositions(newPositions);
                }}
              >
                ←
              </button>
              <span>Position {miniFretboardPositions[i]}</span>
              <button 
                onClick={() => {
                  const newPositions = [...miniFretboardPositions];
                  newPositions[i] = Math.min(17, miniFretboardPositions[i] + 1);
                  setMiniFretboardPositions(newPositions);
                }}
              >
                →
              </button>
            </div>
            <MiniFretboard
              startFret={miniFretboardPositions[i]}
              notes={selectedChords[i] || []}
              onNoteClick={(string, fret) => {
                if (selectedMiniFretboard === i) {
                  const newChords = [...selectedChords];
                  if (!newChords[i]) newChords[i] = [];
                  
                  // Toggle the note
                  const noteIndex = newChords[i].findIndex(
                    note => note.string === string && note.fret === fret
                  );
                  
                  if (noteIndex === -1) {
                    newChords[i].push({ string, fret });
                  } else {
                    newChords[i].splice(noteIndex, 1);
                  }
                  
                  setSelectedChords(newChords);
                }
              }}
              isSelected={selectedMiniFretboard === i}
              onClick={() => setSelectedMiniFretboard(i)}
            />
          </div>
        ))}
      </div>
      <div className="voice-leading-controls">
        {/* <button 
          className="voice-lead-button"
          onClick={() => {
            const nonEmptyChords = selectedChords.filter(chord => chord && chord.length > 0);
            if (nonEmptyChords.length >= 2) {
              onVoiceLeadingCalculated?.(nonEmptyChords);
            }
          }}
        >
          Voice Lead It!
        </button> */}
        <button
          className="clear-button"
          onClick={() => {
            setSelectedChords([]);
            setSelectedMiniFretboard(null);
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default VoiceLeadingSection;
