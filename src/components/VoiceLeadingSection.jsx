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
  const [startFret, setStartFret] = useState(0);
  const [endFret, setEndFret] = useState(4);

  const notesMatrix = createNotesMatrix(numFrets);
  const indexesMatrix = createFretMatrix(numFrets, 6);

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
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

  const renderFretboard = () => {
    const fretboardNotes = notesMatrix.map(row => row.slice(startFret, endFret + 1));
    const fretboardIndexes = indexesMatrix.map(row => row.slice(startFret, endFret + 1));

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
                  {note}
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
    </div>
  );
};

export default VoiceLeadingSection;