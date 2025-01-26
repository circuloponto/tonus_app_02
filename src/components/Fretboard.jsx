import React from 'react';

const Fretboard = ({ notes, indexes, onFretClick, clickedFrets }) => {
  console.log('indexes',indexes)
  return ( 
    <div className="fretboard">
      {notes.map((string, stringIndex) => (
        <div key={`string-${stringIndex}`} className={`string string${stringIndex}`}>
          {string.map((note, fretIndex) => {
            const fretId = `string${stringIndex}-fret-${fretIndex}`;
            const isClickHighlighted = clickedFrets.includes(fretId);
            
            return (
              <div className="fret-wrapper" key={`string-${stringIndex}-fret-${fretIndex}`}>
                <div 
                  data-index={indexes[stringIndex][fretIndex]}
                  className={`fret ${isClickHighlighted ? 'click-highlighted' : ''}`} 
                  onClick={(e) => onFretClick(e, note, stringIndex, fretIndex)}
                >
                  {note}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Fretboard;