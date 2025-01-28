import React, { useState } from 'react';
import { Note } from '@tonaljs/tonal';

const MiniFretboard = ({ notes, indexes, onFretClick, clickedFrets, scaleNotes = [], onAddToProgression }) => {
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

  const handlePrevFrets = () => {
    setStartFret(prev => Math.max(0, prev - 1));
  };

  const handleNextFrets = () => {
    setStartFret(prev => Math.min(maxFret - 4, prev + 1));
  };

  const handleAddToProgression = () => {
    if (clickedFrets.length > 0) {
      onAddToProgression?.({
        notes,
        indexes,
        clickedFrets,
        scaleNotes,
        startFret
      });
    }
  };

  // Log normalized scale notes for debugging
  React.useEffect(() => {
    const normalizedScaleNotes = scaleNotes.map(normalizeNote);
    console.log('Normalized scale notes in Fretboard:', normalizedScaleNotes);
  }, [scaleNotes]);

  return ( 
    <div className="mini-fretboard-container">
      <div className="mini-fretboard-controls">
        <button 
          onClick={handlePrevFrets}
          disabled={startFret === 0}
          className="fret-nav-button"
        >
          ←
        </button>
        <span className="fret-position">Position {startFret}</span>
        <button 
          onClick={handleNextFrets}
          disabled={startFret >= maxFret - 4}
          className="fret-nav-button"
        >
          →
        </button>
      </div>
      <div className="mini-fretboard">
        {notes.map((string, stringIndex) => (
          <div key={`string-${stringIndex}`} className={`string string${stringIndex}`}>
            {string.slice(startFret, startFret + 5).map((note, fretIndex) => (
              <div className="fret-wrapper" key={`string-${stringIndex}-fret-${fretIndex}`}>
                <div 
                  data-index={indexes[stringIndex][startFret + fretIndex]}
                  className={`fret 
                    ${isClicked(stringIndex, fretIndex) ? 'click-highlighted' : ''}
                    ${isInScale(note) ? 'scale-highlighted' : ''}
                    ${isRoot(note) ? 'root-note' : ''}
                    ${isInScale(note) && isClicked(stringIndex, fretIndex) ? 'scale-click-highlighted' : ''}`} 
                  onClick={(e) => onFretClick(e, note, stringIndex, startFret + fretIndex)}
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
        className="add-to-progression-button"
        onClick={handleAddToProgression}
        disabled={clickedFrets.length === 0}
      >
        Add to Progression
      </button>
    </div>
  );
};

export default MiniFretboard;