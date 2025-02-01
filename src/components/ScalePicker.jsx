import React from 'react';

const ScalePicker = ({ selectedScale, onSelectScale, scaleTypes }) => {
  const currentIndex = scaleTypes.findIndex(scale => scale.name === selectedScale);

  const handleArrowClick = (direction, e) => {
    e.target.blur(); // Remove focus after click
    const newIndex = (currentIndex + direction + scaleTypes.length) % scaleTypes.length;
    onSelectScale(scaleTypes[newIndex].name);
  };

  return (
    <div className="scale-picker">
      <button 
        className="scale-picker-arrow up"
        onClick={(e) => handleArrowClick(-1, e)}
      >
        <div style={{margin:"-4px 0 0 0"}}>
        ‹

        </div>
      </button>
      <div className="scale-picker-display">
        {scaleTypes[currentIndex].label}
      </div>
      <button 
        className="scale-picker-arrow down"
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
