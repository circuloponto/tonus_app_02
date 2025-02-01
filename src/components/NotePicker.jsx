import React, { useState } from 'react';
import styles from './NotePicker.module.css';

const NotePicker = ({ onSelectNote, selectedNote }) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const [currentIndex, setCurrentIndex] = useState(notes.indexOf(selectedNote) || 0);

  const handleArrowClick = (direction, e) => {
    e.target.blur(); // Remove focus after click
    const nextIndex = (currentIndex + direction + notes.length) % notes.length;
    setCurrentIndex(nextIndex);
    onSelectNote(notes[nextIndex]);
  };

  return (
    <div className={styles.notePicker}>
      <button 
        className={styles.notePickerArrow}
        onClick={(e) => handleArrowClick(-1, e)}
      >
        ‹
      </button>
      <div className={styles.notePickerDisplay}>
        {notes[currentIndex]}
      </div>
      <button 
        className={styles.notePickerArrow}
        onClick={(e) => handleArrowClick(1, e)}
      >
        ›
      </button>
    </div>
  );
};

export default NotePicker;
