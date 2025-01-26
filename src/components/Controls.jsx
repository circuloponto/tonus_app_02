import React, { useState } from 'react';
import { createFretMatrix,createNotesMatrix } from '../matrices.js';

const Controls = ({ numFrets, setNumFrets, setIndexes, setMatrix,createNotesMatrix }) => {
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleNumberClick = (increment) => {
    const newValue = numFrets + increment;
    if (newValue >= 12 && newValue <= 24) {
      setNumFrets(newValue);
      setIndexes(createFretMatrix(newValue, 6));
      setMatrix(createNotesMatrix(newValue, 6));
    }
  };

  return (
    <div className="controls">
      <div className="control-group">
        <div className="fret-display">
          <button 
            className="fret-adjust" 
            onClick={() => handleNumberClick(-1)}
            disabled={numFrets <= 12}
          >
            -
          </button>
          <div className="fret-number">
            <span className="fret-value">{numFrets}</span>
            <span className="fret-label">frets</span>
          </div>
          <button 
            className="fret-adjust" 
            onClick={() => handleNumberClick(1)}
            disabled={numFrets >= 24}
          >
            +
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Controls;
