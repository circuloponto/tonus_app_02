import React, { useState } from 'react';
import Scales from './Scales';
import ChordAnalyzer from './ChordAnalyzer';

const VoiceLeading = ({ onVoiceLeadingModeChange }) => {
  return (
    <div className="voice-leading-controls">
      <button 
        className="voice-lead-button"
        onClick={() => {
          console.log('Voice Lead button clicked');
          onVoiceLeadingModeChange(true);
        }}
      >
        Voice Lead It!
      </button>
    </div>
  );
};

const ModularControls = ({ 
  numFrets, 
  setNumFrets, 
  clickedNotes, 
  onClear,
  onSelectScale,
  isOpen,
  onToggle,
  onVoiceLeadingModeChange
}) => {
  const [currentModule, setCurrentModule] = useState(0);
  
  const modules = [
    {
      label: "Frets",
      component: (
        <div className="fret-controls">
          <label>Number of Frets</label>
          <div className="fret-control">
            <input
              type="range"
              min="12"
              max="24"
              value={numFrets}
              onChange={(e) => setNumFrets(parseInt(e.target.value))}
            />
            <span>{numFrets}</span>
          </div>
        </div>
      )
    },
    {
      label: "Scales",
      component: (
        <Scales onSelectScale={onSelectScale} />
      )
    },
    {
      label: "Chord Analysis",
      component: (
        <ChordAnalyzer notes={clickedNotes} />
      )
    },
    {
      label: "Voice Leading",
      component: <VoiceLeading onVoiceLeadingModeChange={onVoiceLeadingModeChange} />
    }
  ];

  // Update voice leading mode when module changes
  React.useEffect(() => {
    onVoiceLeadingModeChange?.(currentModule === 3);
  }, [currentModule, onVoiceLeadingModeChange]);

  const nextModule = () => {
    setCurrentModule((prev) => (prev + 1) % modules.length);
  };

  const prevModule = () => {
    setCurrentModule((prev) => (prev - 1 + modules.length) % modules.length);
  };

  return (
    <div className={`modular-controls ${isOpen ? 'open' : ''}`}>
      <button className="toggle-controls" onClick={onToggle}>
        {isOpen ? '▼' : '▲'}
      </button>
      {isOpen && (
        <div className="controls-content">
          <button className="module-arrow left" onClick={prevModule}>←</button>
          <div className="module-display">
            <div className="module-label">{modules[currentModule].label}</div>
            <div className="module-component">
              {modules[currentModule].component}
            </div>
          </div>
          <button className="module-arrow right" onClick={nextModule}>→</button>
        </div>
      )}
    </div>
  );
};

export default ModularControls;
