import React from 'react';
import './ColorLegend.css';

const ColorLegend = ({ onHover }) => {
  const legendItems = [
    { type: 'scale', color: 'rgb(238, 178, 26)', label: 'Scale Notes' },
    { type: 'clicked', color: 'rgb(46, 47, 47)', label: 'Selected Notes' },
    { type: 'both', color: 'rgb(255, 59, 48)', label: 'Selected Scale Notes' }
  ];

  const handleHover = (type) => {
    console.log('Hovering:', type); // Debug log
    onHover(type);
  };

  return (
    <div className="color-legend">
      {legendItems.map(({ type, color, label }) => (
        <div
          key={type}
          className="legend-item"
          onMouseEnter={() => handleHover(type)}
          onMouseLeave={() => handleHover(null)}
        >
          <div 
            className="color-box"
            style={{ backgroundColor: color }}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorLegend;
