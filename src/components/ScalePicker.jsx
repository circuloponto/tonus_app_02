import React from 'react';
import styles from './ScalePicker.module.css';

const ScalePicker = ({ selectedScale, onSelectScale, scaleTypes }) => {
  const currentIndex = scaleTypes.findIndex(scale => scale.name === selectedScale);

  const handleArrowClick = (direction, e) => {
    e.target.blur(); // Remove focus after click
    const newIndex = (currentIndex + direction + scaleTypes.length) % scaleTypes.length;
    onSelectScale(scaleTypes[newIndex].name);
  };

  return (
    <div className={styles.scalePicker}>
      <button 
        className={styles.scalePickerArrow}
        onClick={(e) => handleArrowClick(-1, e)}
      >
        <div style={{margin:"-4px 0 0 0"}}>
        ‹

        </div>
      </button>
      <div className={styles.scalePickerDisplay}>
        {scaleTypes[currentIndex].label}
      </div>
      <button 
        className={styles.scalePickerArrow}
        onClick={(e) => handleArrowClick(1, e)}
      >
        <div style={{margin:"-4px 0 0 0"}}>
        ›

        </div>
      </button>
    </div>
  );
};

export default ScalePicker;
