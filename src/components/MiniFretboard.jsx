import React, { useState } from 'react';
import { Note } from '@tonaljs/tonal';

const MiniFretboard = ({ notes, indexes, onFretClick, clickedFrets, scaleNotes = [], onAddToProgression, renderExtraButton }) => {
  const [startFret, setStartFret] = useState(0);
  const maxFret = 24;

  const normalizeNote = (note) => {
    const parsed = Note.get(note);
    return parsed.empty ? note : Note.simplify(parsed.name);
  };

  const isClicked = (stringIndex, fretIndex) => {
    return clickedFrets.some(
      fret => fret.stringIndex === stringIndex && fret.fretIndex === (startFret + fretIndex)
    );
  };

  const isInScale = (note) => {
    const normalizedScaleNotes = scaleNotes.map(normalizeNote);
    const normalizedNote = normalizeNote(note);
    return normalizedScaleNotes.includes(normalizedNote);
  };

  const isRoot = (note) => {
    const normalizedScaleNotes = scaleNotes.map(normalizeNote);
    const normalizedNote = normalizeNote(note);
    return normalizedScaleNotes.length > 0 && normalizedNote === normalizedScaleNotes[0];
  };

  return (
    <div className="mini-fretboard-container">
      <div className="mini-fretboard">
        {[...Array(6)].map((_, stringIndex) => (
          <div key={stringIndex} className="string">
            {[...Array(5)].map((_, fretIndex) => {
              const note = notes[stringIndex][startFret + fretIndex];
              return (
                <div
                  key={fretIndex}
                  className={`fret ${isClicked(stringIndex, fretIndex) ? 'clicked' : ''} 
                    ${isInScale(note) ? 'in-scale' : ''} 
                    ${isRoot(note) ? 'root' : ''}`}
                  onClick={(e) => onFretClick?.(e, note, stringIndex, startFret + fretIndex)}
                >
                  <span className="note-name">{note}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mini-fretboard-controls">
        <button
          className="fret-nav-button"
          onClick={() => setStartFret(prev => Math.max(0, prev - 1))}
          disabled={startFret === 0}
        >
          ←
        </button>
        <span className="fret-position">Fret {startFret}</span>
        <button
          className="fret-nav-button"
          onClick={() => setStartFret(prev => Math.min(maxFret - 4, prev + 1))}
          disabled={startFret === maxFret - 4}
        >
          →
        </button>
      </div>
      
      {renderExtraButton?.()}
      
      {onAddToProgression && (
        <button
          className="add-to-progression"
          onClick={() => onAddToProgression({
            notes,
            indexes,
            clickedFrets,
            scaleNotes,
            startFret
          })}
          disabled={clickedFrets.length === 0}
        >
          Add to Progression
        </button>
      )}
    </div>
  );
};

export default MiniFretboard;