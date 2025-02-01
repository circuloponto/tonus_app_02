import React from 'react';
import styles from './CustomScaleBuilder.module.css';

const CustomScaleBuilder = ({ intervals, onIntervalToggle }) => {
  // Array of all possible intervals (0 to 11 semitones)
  const allIntervals = Array.from({ length: 12 }, (_, i) => i);

  const handleClick = (interval) => {
    console.log('Clicked interval:', interval);
    onIntervalToggle(Number(interval));
  };

  const getButtonClass = (interval) => {
    let className = styles.intervalSquare;
    if (intervals.includes(Number(interval))) {
      className += ' ' + styles.selected;
    }
    if (interval === 0) {
      className += ' ' + styles.root;
    }
    return className;
  };

  return (
    <div className={styles.customScaleBuilder}>
      <div className={styles.intervalSquares}>
        {allIntervals.map((interval) => (
          <button
            key={interval}
            className={getButtonClass(interval)}
            onClick={() => handleClick(interval)}
          >
            {intervals.includes(Number(interval)) ? '×' : interval}
          </button>
        ))}
      </div>
      <div className={styles.intervalLabels}>
        {allIntervals.map((interval) => (
          <div key={interval} className={styles.intervalLabel}>
            {interval}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomScaleBuilder;
