import React from 'react';
import { Note } from '@tonaljs/tonal';

const MiniFretboardProgression = ({ notes, indexes, clickedFrets, scaleNotes = [], startFret, position, onRemove }) => {
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
    <div className="mini-fretboard-progression-container">
      <div className="mini-fretboard">
        {notes.map((string, stringIndex) => (
          <div key={`string-${stringIndex}`} className={`string string${stringIndex}`}>
            {string.slice(startFret, startFret + 5).map((note, fretIndex) => (
              <div className="fret-wrapper" key={`string-${stringIndex}-fret-${fretIndex}`}>
                <div 
                  data-index={indexes[stringIndex][startFret + fretIndex]}
                  className={`fret static
                    ${isClicked(stringIndex, fretIndex) ? 'click-highlighted' : ''}
                    ${isInScale(note) ? 'scale-highlighted' : ''}
                    ${isRoot(note) ? 'root-note' : ''}
                    ${isInScale(note) && isClicked(stringIndex, fretIndex) ? 'scale-click-highlighted' : ''}`}
                >
                  {note}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="fret-numbers">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="fret-number">
            {startFret + i}
          </div>
        ))}
      </div>
      <button 
        className="remove-chord-button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(position);
        }}
        title="Remove chord"
      >
        ×
      </button>
    </div>
  );
};

export default MiniFretboardProgression;
