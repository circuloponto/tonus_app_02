import React from 'react';
import { Note } from '@tonaljs/tonal';
import styles from './Progression.module.css';

const MiniFretboardProgression = ({ notes, indexes, clickedFrets, scaleNotes = [], startFret = 0, position, onRemove }) => {
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

  const visibleFrets = 5;

  return (
    <div className={styles.mini_fretboard_container}>
      <button 
        className={styles.remove_button} 
        onClick={() => onRemove(position)}
      >
        ×
      </button>
      <div className={styles.fret_numbers}>
        {Array.from({ length: visibleFrets }, (_, i) => (
          <div key={i} className={styles.fret_number}>
            {startFret + i}
          </div>
        ))}
      </div>
      <div className={styles.mini_fretboard}>
        {notes.map((string, stringIndex) => (
          <div key={`string-${stringIndex}`} className={styles.string}>
            {string.slice(startFret, startFret + visibleFrets).map((note, fretIndex) => (
              <div 
                className={styles.fret_wrapper} 
                key={`string-${stringIndex}-fret-${fretIndex}`}
              >
                <div 
                  className={`${styles.fret}
                    ${isClicked(stringIndex, fretIndex) ? styles.clicked : ''}
                    ${isInScale(note) ? styles.scale : ''}
                    ${isRoot(note) ? styles.root : ''}
                    ${isInScale(note) && isClicked(stringIndex, fretIndex) ? styles.scale_clicked : ''}`}
                >
                  {note}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniFretboardProgression;
