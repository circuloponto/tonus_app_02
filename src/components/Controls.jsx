import React, { useState } from 'react';
import { createFretMatrix,createNotesMatrix } from '../matrices.js';
import ChordAnalyzer from './ChordAnalyzer';

const Controls = ({ numFrets, setNumFrets, setIndexes, setMatrix, createNotesMatrix, clickedNotes, onClear }) => {
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleNumberClick = (increment) => {
    const newNumFrets = numFrets + increment;
    if (newNumFrets >= 0 && newNumFrets <= 24) {
      setNumFrets(newNumFrets);
      setIndexes(createFretMatrix(newNumFrets, 6));
      setMatrix(createNotesMatrix(newNumFrets));
    }
  };

  return (
    <div className="controls">
      <div className="control-group">
      <div className="numOfFrets">Frets</div>
        <div className="fret-controls">
         
          <button
            className="control-button"
            onClick={() => handleNumberClick(-1)}
            disabled={numFrets <= 0}
          >
            -
          </button>
          <span className="fret-number">{numFrets}</span>
          <button
            className="control-button"
            onClick={() => handleNumberClick(1)}
            disabled={numFrets >= 24}
          >
            +
          </button>
        </div>
        <button
          className="control-button clear-button"
          onClick={onClear}
        >
          Clear Frets
        </button>
      </div>
      <ChordAnalyzer notes={clickedNotes} />
    </div>
  );
};

export default Controls;
