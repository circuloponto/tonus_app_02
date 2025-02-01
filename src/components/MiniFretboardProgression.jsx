import React from 'react';
import MiniFretboard from './MiniFretboard';
import styles from './MiniFretboardProgression.module.css';

const MiniFretboardProgression = ({ progression, scaleNotes, numFrets }) => {
  return (
    <div className={styles.progression}>
      {progression.map((item, index) => (
        <div key={index} className={styles.progressionItem}>
          <MiniFretboard
            clickedFrets={item.clickedFrets}
            scaleNotes={scaleNotes}
            startFret={item.startFret}
            endFret={item.endFret}
            numFrets={numFrets}
          />
          <div className={styles.itemNumber}>{index + 1}</div>
        </div>
      ))}
    </div>
  );
};

export default MiniFretboardProgression;