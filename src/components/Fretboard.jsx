import React from 'react';
import { Note } from '@tonaljs/tonal';

const Fretboard = ({ notes, indexes, onFretClick, clickedFrets, scaleNotes = [] }) => {
  const normalizeNote = (note) => {
    const parsed = Note.get(note);
    return parsed.empty ? note : Note.simplify(parsed.name);
  };

  const isHighlighted = (note, index) => {
    const isClicked = clickedFrets.some(fret => 
      fret.stringIndex === index[0] && fret.fretIndex === index[1]
    );
    
    // Normalize both the current note and scale notes for comparison
    const normalizedNote = normalizeNote(note);
    const normalizedScaleNotes = scaleNotes.map(normalizeNote);
    const isInScale = normalizedScaleNotes.includes(normalizedNote);
    
    return {
      'click-highlighted': isClicked && !isInScale,
      'scale-highlighted': isInScale && !isClicked,
      'scale-click-highlighted': isInScale && isClicked
    };
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
                className={`fret ${Object.entries(isHighlighted(note, [stringIndex, fretIndex]))
                  .filter(([_, value]) => value)
                  .map(([className]) => className)
                  .join(' ')}`} 
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