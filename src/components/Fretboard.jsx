import React from 'react';
import { Note } from '@tonaljs/tonal';

const Fretboard = ({ notes, indexes, onFretClick, clickedFrets, scaleNotes = [] }) => {
  const normalizeNote = (note) => {
    const parsed = Note.get(note);
    return parsed.empty ? note : Note.simplify(parsed.name);
  };

  const isClicked = (stringIndex, fretIndex) => {
    return clickedFrets.some(
      fret => fret.stringIndex === stringIndex && fret.fretIndex === fretIndex
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

  // Log normalized scale notes for debugging
  React.useEffect(() => {
    const normalizedScaleNotes = scaleNotes.map(normalizeNote);
    console.log('Normalized scale notes in Fretboard:', normalizedScaleNotes);
  }, [scaleNotes]);

  return ( 
    <div className="fretboard">
      {notes.map((string, stringIndex) => (
        <div key={`string-${stringIndex}`} className={`string string${stringIndex}`}>
          {string.map((note, fretIndex) => (
            <div className="fret-wrapper" key={`string-${stringIndex}-fret-${fretIndex}`}>
              <div 
                data-index={indexes[stringIndex][fretIndex]}
                className={`fret 
                  ${isClicked(stringIndex, fretIndex) ? 'click-highlighted' : ''}
                  ${isInScale(note) ? 'scale-highlighted' : ''}
                  ${isRoot(note) ? 'root-note' : ''}
                  ${isInScale(note) && isClicked(stringIndex, fretIndex) ? 'scale-click-highlighted' : ''}`} 
                onClick={(e) => onFretClick(e, note, stringIndex, fretIndex)}
              >
                {note}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Fretboard;