import React from 'react';
import styles from './Fretboard.module.css';

const Fretboard = ({ notes, indexes, onFretClick, clickedFrets, scaleNotes }) => {
  return (
    <div className={styles.fretboardContainer}>
      <div className={styles.fretboard}>
        {notes.map((row, stringIndex) => (
          <div key={stringIndex} className={styles.string}>
            {row.map((note, fretIndex) => {
              const isClicked = clickedFrets.some(
                fret => 
                  fret.stringIndex === stringIndex && 
                  fret.fretIndex === fretIndex
              );
              const isInScale = scaleNotes.includes(note);

              return (
                <div
                  key={fretIndex}
                  className={`${styles.fret} ${isClicked ? styles.clicked : ''} ${isInScale ? styles.inScale : ''}`}
                  onClick={(e) => onFretClick(e, note, stringIndex, fretIndex)}
                >
                  {note}
                  {fretIndex > 0 && stringIndex === 0 && (
                    <span className={styles.fretNumber}>{fretIndex}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fretboard;