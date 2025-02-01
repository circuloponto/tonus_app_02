import React from 'react';
import { Note } from '@tonaljs/tonal';
import { createFretMatrix, createNotesMatrix } from '../matrices.js';
import styles from './MiniFretboard.module.css';

const MiniFretboard = ({ clickedFrets, scaleNotes = [], startFret, endFret, numFrets = 12 }) => {
  console.log('MiniFretboard props:', { clickedFrets, scaleNotes, startFret, endFret, numFrets });
  
  const notesMatrix = createNotesMatrix(numFrets);
  const indexesMatrix = createFretMatrix(numFrets, 6);

  const normalizeNote = (note) => {
    const parsed = Note.get(note);
    return parsed.empty ? note : Note.simplify(parsed.name);
  };

  // Add one fret to each side of the view range
  const viewStartFret = Math.max(0, startFret - 1);
  const viewEndFret = Math.min(numFrets - 1, endFret + 1);

  console.log('View range:', { viewStartFret, viewEndFret });

  const renderFretboard = () => {
    const fretboardNotes = notesMatrix.map(row => row.slice(viewStartFret, viewEndFret + 1));
    const fretboardIndexes = indexesMatrix.map(row => row.slice(viewStartFret, viewEndFret + 1));

    console.log('Fretboard data:', { 
      fretboardNotes, 
      fretboardIndexes,
      clickedFrets 
    });

    // Normalize scale notes once for comparison
    const normalizedScaleNotes = scaleNotes.map(normalizeNote);

    return (
      <div className={styles.miniFretboard}>
        {fretboardNotes.map((row, stringIndex) => (
          <div key={stringIndex} className={styles.string}>
            {row.map((note, fretIndex) => {
              const absoluteFretIndex = fretIndex + viewStartFret;
              const isClicked = clickedFrets?.some(
                fret => 
                  fret.stringIndex === stringIndex && 
                  fret.fretIndex === absoluteFretIndex
              ) || false;

              // Normalize the current note before comparison
              const normalizedNote = normalizeNote(note);
              const isInScale = normalizedScaleNotes.includes(normalizedNote);
              
              const isInViewRange = absoluteFretIndex >= startFret && absoluteFretIndex <= endFret;

              return (
                <div
                  key={fretIndex}
                  className={`${styles.fret} 
                    ${isClicked ? styles.clicked : ''} 
                    ${isInScale ? styles.inScale : ''} 
                    ${isInViewRange ? styles.inRange : ''}`}
                >
                  <span className={styles.note}>
                    {note}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
        <div className={styles.fretNumbers}>
          {Array.from({ length: viewEndFret - viewStartFret + 1 }, (_, i) => (
            <div key={i} className={styles.fretNumber}>
              {viewStartFret + i}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return renderFretboard();
};

export default MiniFretboard;