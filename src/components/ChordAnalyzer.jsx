import React, { useState, useEffect } from 'react';
import { Chord } from '@tonaljs/tonal';

const ChordAnalyzer = ({ notes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chordNames, setChordNames] = useState([]);

  useEffect(() => {
    console.log('Notes received by ChordAnalyzer:', notes);
    console.log('Notes type:', typeof notes, Array.isArray(notes));
    console.log('Individual note types:', notes.map(note => typeof note));
    
    const detected = notes.length > 0 ? Chord.detect(notes) : [];
    console.log('Chord.detect input:', notes);
    console.log('Chord.detect output:', detected);
    
    setChordNames(detected);
    setCurrentIndex(0);
  }, [notes]);

  const nextChord = () => {
    if (chordNames.length > 0) {
      setCurrentIndex((currentIndex + 1) % chordNames.length);
    }
  };

  const prevChord = () => {
    if (chordNames.length > 0) {
      setCurrentIndex((currentIndex - 1 + chordNames.length) % chordNames.length);
    }
  };

  return (
    <div className="chord-display">
      <div className="chord-navigation">
        <button 
          onClick={prevChord} 
          disabled={chordNames.length <= 1}
          className="chord-nav-button"
        >
          ←
        </button>
        <span className="chord-name">
          {chordNames.length > 0 ? chordNames[currentIndex] : 'No chord detected'}
        </span>
        <button 
          onClick={nextChord} 
          disabled={chordNames.length <= 1}
          className="chord-nav-button"
        >
          →
        </button>
      </div>
      {chordNames.length > 1 && (
        <div className="chord-count">
          {currentIndex + 1} of {chordNames.length}
        </div>
      )}
    </div>
  );
};

export default ChordAnalyzer;
