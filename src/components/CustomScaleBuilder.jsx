import React from 'react';

const CustomScaleBuilder = ({ intervals, onIntervalToggle }) => {
  // Array of all possible intervals (0 to 11 semitones)
  const allIntervals = Array.from({ length: 12 }, (_, i) => i);

  const handleClick = (interval) => {
    console.log('Clicked interval:', interval);
    onIntervalToggle(Number(interval));
  };

  return (
    <div className="custom-scale-builder">
      <div className="interval-squares">
        {allIntervals.map((interval) => (
          <button
            key={interval}
            className={`interval-square ${intervals.includes(Number(interval)) ? 'selected' : ''} ${interval === 0 ? 'root' : ''}`}
            onClick={() => handleClick(interval)}
            disabled={interval === 0}
          >
            {interval === 0 ? 'R' : intervals.includes(Number(interval)) ? '×' : interval}
          </button>
        ))}
      </div>
      <div className="interval-labels">
        {allIntervals.map((interval) => (
          <div key={interval} className="interval-label">
            {interval}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomScaleBuilder;
