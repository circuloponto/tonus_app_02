import React, { useState } from 'react';
import Scales from './Scales';
import ChordAnalyzer from './ChordAnalyzer';
import MiniFretboard from './MiniFretboard';
import { createFretMatrix, createNotesMatrix } from '../matrices.js';
import Select from 'react-select';
import { Scale } from '@tonaljs/tonal';
import VoiceLeadingSection from './VoiceLeadingSection';
import styles from './ModularControls.module.css';

const VoiceLeading = ({ onVoiceLeadingModeChange, clickedFrets, onFretClick, scaleNotes, onAddToProgression, numFrets }) => {
  const [startFret, setStartFret] = useState(0);
  const notesMatrix = createNotesMatrix(numFrets);
  const indexesMatrix = createFretMatrix(numFrets, 6);

  // Extract just the clicked notes from the matrix
  const clickedNotesMatrix = notesMatrix.map((string, stringIndex) => 
    string.filter((_, fretIndex) => 
      clickedFrets.some(fret => 
        fret.stringIndex === stringIndex && fret.fretIndex === fretIndex
      )
    )
  );

  return (
    <div className="voice-leading-section">
      <div className="control-group">
        <MiniFretboard 
          notes={notesMatrix} 
          indexes={indexesMatrix}
          onFretClick={onFretClick} 
          clickedFrets={clickedFrets}
          scaleNotes={scaleNotes}
          onAddToProgression={(chord) => {
            onAddToProgression({
              ...chord,
              notes: clickedNotesMatrix
            });
          }}
        />
      </div>
      <div className="control-group">
        <button 
          className="voice-lead-button"
          onClick={() => onVoiceLeadingModeChange(true)}
        >
          Voice Lead It!
        </button>
      </div>
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
  onVoiceLeadingModeChange,
  clickedFrets,
  onFretClick,
  scaleNotes,
  onAddToProgression,
  isVoiceLeadingMode
}) => {
  const [selectedScale, setSelectedScale] = useState(null);

  const scales = Scale.names().map(name => ({
    value: name,
    label: name
  }));

  const handleScaleChange = (selectedOption) => {
    setSelectedScale(selectedOption);
    if (selectedOption) {
      const scale = Scale.get(`C ${selectedOption.value}`);
      onSelectScale(scale.notes);
    } else {
      onSelectScale([]);
    }
  };

  const handleAddToProgression = () => {
    if (clickedFrets.length > 0) {
      const startFret = Math.min(...clickedFrets.map(fret => fret.fretIndex));
      onAddToProgression({
        notes: clickedNotes,
        indexes: clickedFrets,
        clickedFrets: clickedFrets,
        scaleNotes: scaleNotes,
        startFret: startFret
      });
      onClear(); // Clear the fretboard after adding
    }
  };

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
      label: "Scale Builder",
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
      component: <VoiceLeading 
        onVoiceLeadingModeChange={onVoiceLeadingModeChange} 
        clickedFrets={clickedFrets} 
        onFretClick={onFretClick} 
        scaleNotes={scaleNotes} 
        onAddToProgression={onAddToProgression}
        numFrets={numFrets}
      />
    }
  ];

  // Update voice leading mode when module changes
  React.useEffect(() => {
    onVoiceLeadingModeChange?.(modules[3].label === "Voice Leading");
  }, [modules, onVoiceLeadingModeChange]);

  const nextModule = () => {
    // Not implemented
  };

  const prevModule = () => {
    // Not implemented
  };

  return (
    <div className={`${styles.controls} ${isOpen ? styles.open : ''}`}>
      <button className={styles.toggleButton} onClick={onToggle}>
        {isOpen ? '▼' : '▲'}
      </button>
      
      <div className={styles.controlsContent}>
        <div className={styles.section}>
          <label>Number of Frets:</label>
          <input
            type="number"
            value={numFrets}
            onChange={(e) => setNumFrets(parseInt(e.target.value))}
            min="12"
            max="24"
          />
        </div>

        <div className={styles.section}>
          <label>Select Scale:</label>
          <Select
            value={selectedScale}
            onChange={handleScaleChange}
            options={scales}
            isClearable
            className={styles.scaleSelect}
          />
        </div>

        <div className={styles.section}>
          <label>Selected Notes:</label>
          <div className={styles.selectedNotes}>
            {clickedNotes.length > 0 ? clickedNotes.join(', ') : 'None'}
          </div>
        </div>

        <div className={styles.buttonSection}>
          <button onClick={onClear} className={styles.clearButton}>
            Clear Selection
          </button>
          <button 
            onClick={handleAddToProgression} 
            className={styles.addButton}
            disabled={clickedFrets.length === 0}
          >
            Add to Progression
          </button>
        </div>

        <div className={styles.section}>
          <label>
            <input
              type="checkbox"
              onChange={(e) => onVoiceLeadingModeChange(e.target.checked)}
              checked={isVoiceLeadingMode}
            />
            Voice Leading Mode
          </label>
        </div>

        {isVoiceLeadingMode && (
          <div className={styles.voiceLeadingSection}>
            <VoiceLeadingSection
              clickedFrets={clickedFrets}
              onFretClick={onFretClick}
              scaleNotes={scaleNotes}
              onAddToProgression={onAddToProgression}
              numFrets={numFrets}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModularControls;
