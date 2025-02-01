import React, { useState } from 'react';
import Fretboard from './Fretboard';
import { createFretMatrix, createNotesMatrix } from '../matrices.js';
import styles from './VoiceLeadingSection.module.css';

const VoiceLeadingSection = ({ 
  clickedFrets, 
  onFretClick, 
  scaleNotes, 
  onAddToProgression,
  numFrets = 19 
}) => {
  const [startFret, setStartFret] = useState(0);
  const [notesMatrix] = useState(createNotesMatrix(numFrets));
  const [indexes] = useState(createFretMatrix(numFrets, 6));

  // Calculate visible frets based on startFret
  const visibleFrets = 12;
  const visibleNotesMatrix = notesMatrix.map(string => 
    string.slice(startFret, startFret + visibleFrets)
  );
  const visibleIndexes = indexes.map(string => 
    string.slice(startFret, startFret + visibleFrets)
  );

  // Adjust clicked frets to match the visible area
  const adjustedClickedFrets = clickedFrets.map(fret => ({
    ...fret,
    fretIndex: fret.fretIndex - startFret
  })).filter(fret => 
    fret.fretIndex >= 0 && fret.fretIndex < visibleFrets
  );

  const handleScroll = (direction) => {
    if (direction === 'left' && startFret > 0) {
      setStartFret(prev => Math.max(0, prev - 1));
    } else if (direction === 'right' && startFret < numFrets - visibleFrets) {
      setStartFret(prev => Math.min(numFrets - visibleFrets, prev + 1));
    }
  };

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
    // Adjust fretIndex to account for scrolling before passing to parent
    onFretClick(e, note, stringIndex, fretIndex + startFret);
  };

  return (
    <div className={styles.voiceLeadingSection}>
      <div className={styles.fretboardContainer}>
        <button 
          className={`${styles.scrollButton} ${styles.leftButton}`}
          onClick={() => handleScroll('left')}
          disabled={startFret === 0}
        >
          ←
        </button>
        
        <div className={styles.fretboardWrapper}>
          <Fretboard
            notes={visibleNotesMatrix}
            indexes={visibleIndexes}
            onFretClick={handleFretClick}
            clickedFrets={adjustedClickedFrets}
            scaleNotes={scaleNotes}
          />
        </div>

        <button 
          className={`${styles.scrollButton} ${styles.rightButton}`}
          onClick={() => handleScroll('right')}
          disabled={startFret >= numFrets - visibleFrets}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default VoiceLeadingSection;
