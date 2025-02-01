import React, { useState } from 'react';
import { createFretMatrix, createNotesMatrix } from '../matrices.js';
import styles from './VoiceLeadingSection.module.css';

const VoiceLeadingSection = ({
  clickedFrets,
  onFretClick,
  scaleNotes,
  onAddToProgression,
  numFrets
}) => {
  console.log('VoiceLeadingSection props:', { clickedFrets, scaleNotes, numFrets });
  
  const [startFret, setStartFret] = useState(0);
  const [endFret, setEndFret] = useState(4);

  const notesMatrix = createNotesMatrix(numFrets);
  const indexesMatrix = createFretMatrix(numFrets, 6);

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
    console.log('Clicking fret:', { note, stringIndex, fretIndex, startFret });
    onFretClick(e, note, stringIndex, fretIndex + startFret);
  };

  const handlePrevious = () => {
    if (startFret > 0) {
      setStartFret(prev => prev - 1);
      setEndFret(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (endFret < numFrets) {
      setStartFret(prev => prev + 1);
      setEndFret(prev => prev + 1);
    }
  };

  const handleAddToProgression = () => {
    // Get notes from clicked frets
    const notes = clickedFrets.map(fret => {
      const row = notesMatrix[fret.stringIndex];
      return row[fret.fretIndex];
    });

    console.log('Adding to progression:', {
      clickedFrets,
      startFret,
      endFret,
      notes,
      notesMatrix: notesMatrix.map(row => row.slice(0, 5))  // Just show first 5 frets
    });

    onAddToProgression({
      clickedFrets,
      startFret,
      endFret,
      notes
    });
  };

  const renderFretboard = () => {
    const fretboardNotes = notesMatrix.map(row => row.slice(startFret, endFret + 1));
    const fretboardIndexes = indexesMatrix.map(row => row.slice(startFret, endFret + 1));

    console.log('Rendering fretboard:', {
      startFret,
      endFret,
      fretboardNotes,
      clickedFrets
    });

    return (
      <div className={styles.miniFretboard}>
        {fretboardNotes.map((row, stringIndex) => (
          <div key={stringIndex} className={styles.string}>
            {row.map((note, fretIndex) => {
              const isClicked = clickedFrets.some(
                fret => 
                  fret.stringIndex === stringIndex && 
                  fret.fretIndex === (fretIndex + startFret)
              );
              const isInScale = scaleNotes.includes(note);

              return (
                <div
                  key={fretIndex}
                  className={`${styles.fret} ${isClicked ? styles.clicked : ''} ${isInScale ? styles.inScale : ''}`}
                  onClick={(e) => handleFretClick(e, note, stringIndex, fretIndex)}
                >
                  <span className={styles.note}>
                    {note}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.voiceLeadingSection}>
      <div className={styles.navigation}>
        <button onClick={handlePrevious} disabled={startFret === 0}>
          ◀
        </button>
        <span>Frets {startFret} - {endFret}</span>
        <button onClick={handleNext} disabled={endFret === numFrets}>
          ▶
        </button>
      </div>
      {renderFretboard()}
      <button 
        className={styles.addButton}
        onClick={handleAddToProgression}
        disabled={clickedFrets.length === 0}
      >
        Add to Progression
      </button>
    </div>
  );
};

export default VoiceLeadingSection;