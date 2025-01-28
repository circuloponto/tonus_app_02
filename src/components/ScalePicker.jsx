import React from 'react';

const ScalePicker = ({ selectedScale, onSelectScale, scaleTypes }) => {
  const currentIndex = scaleTypes.findIndex(scale => scale.name === selectedScale);

  const handleArrowClick = (direction) => {
    const newIndex = (currentIndex + direction + scaleTypes.length) % scaleTypes.length;
    onSelectScale(scaleTypes[newIndex].name);
  };

  return (
    <div className="scale-picker">
      <button 
        className="scale-picker-arrow up"
        onClick={() => handleArrowClick(-1)}
      >
        ▲
      </button>
      <div className="scale-picker-display">
        {scaleTypes[currentIndex].label}
      </div>
      <button 
        className="scale-picker-arrow down"
        onClick={() => handleArrowClick(1)}
      >
        ▼
      </button>
    </div>
  );
};

export default ScalePicker;
