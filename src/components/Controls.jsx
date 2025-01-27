import React, { useState } from 'react';
import { createFretMatrix, createNotesMatrix } from '../matrices.js';
import ChordAnalyzer from './ChordAnalyzer';
import Scales from './Scales';

const Controls = ({ numFrets, setNumFrets, clickedNotes, onClear, createNotesMatrix, onSelectScale }) => {
  const handleNumberClick = (increment) => {
    const newValue = Math.max(1, Math.min(24, numFrets + increment));
    setNumFrets(newValue);
  };

  return (
    <div className="controls">
      <div className="fret-controls">
        <label>
          Number of Frets
        </label>
        <div className="fret-number-controls">
          <button
            className="control-button"
            onClick={() => handleNumberClick(-1)}
            disabled={numFrets <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="24"
            value={numFrets}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= 24) {
                setNumFrets(value);
              }
            }}
          />
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

      <ChordAnalyzer 
        notes={clickedNotes || []}
        createNotesMatrix={createNotesMatrix}
      />
      
      <Scales onSelectScale={onSelectScale} />
    </div>
  );
}

export default Controls;
