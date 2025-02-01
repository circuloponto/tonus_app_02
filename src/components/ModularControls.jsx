import React, { useState } from 'react';
import Scales from './Scales';
import ChordAnalyzer from './ChordAnalyzer';
import { createFretMatrix, createNotesMatrix } from '../matrices.js';
import { Scale } from '@tonaljs/tonal';
import VoiceLeadingSection from './VoiceLeadingSection';
import styles from './ModularControls.module.css';

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
  const [currentModule, setCurrentModule] = useState(0);

  const modules = [
    {
      title: "Fret Controls",
      component: (
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
      )
    },
    {
      title: "Scale Builder",
      component: (
        <div className={styles.section}>
          <Scales onSelectScale={(notes) => onSelectScale(notes)} />
        </div>
      )
    },
    {
      title: "Selected Notes",
      component: (
        <div className={styles.section}>
          <label>Selected Notes:</label>
          <div className={styles.selectedNotes}>
            {clickedNotes.length > 0 ? clickedNotes.join(', ') : 'None'}
          </div>
          <div className={styles.buttonSection}>
            <button onClick={onClear} className={styles.clearButton}>
              Clear Selection
            </button>
            <button 
              onClick={() => {
                if (clickedFrets.length > 0) {
                  const startFret = Math.min(...clickedFrets.map(fret => fret.fretIndex));
                  const endFret = Math.max(...clickedFrets.map(fret => fret.fretIndex));
                  onAddToProgression({
                    notes: clickedNotes,
                    indexes: clickedFrets,
                    clickedFrets: clickedFrets,
                    scaleNotes: scaleNotes,
                    startFret: Math.max(0, startFret - 1),
                    endFret: Math.min(numFrets - 1, endFret + 1)
                  });
                  onClear();
                }
              }} 
              className={styles.addButton}
              disabled={clickedFrets.length === 0}
            >
              Add to Progression
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Voice Leading",
      component: (
        <div className={styles.section}>
          <label>
            <input
              type="checkbox"
              onChange={(e) => onVoiceLeadingModeChange(e.target.checked)}
              checked={isVoiceLeadingMode}
            />
            Voice Leading Mode
          </label>
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
      )
    }
  ];

  const nextModule = () => {
    setCurrentModule((prev) => (prev + 1) % modules.length);
  };

  const prevModule = () => {
    setCurrentModule((prev) => (prev - 1 + modules.length) % modules.length);
  };

  return (
    <div className={`${styles.controls} ${isOpen ? styles.open : ''}`}>
      <button className={styles.toggleButton} onClick={onToggle}>
        {isOpen ? '▼' : '▲'}
      </button>
      
      <div className={styles.controlsContent}>
        <div className={styles.moduleNavigation}>
          <button onClick={prevModule} className={styles.navButton}>←</button>
          <h3 className={styles.moduleTitle}>{modules[currentModule].title}</h3>
          <button onClick={nextModule} className={styles.navButton}>→</button>
        </div>
        <div className={styles.moduleContent}>
          {modules[currentModule].component}
        </div>
      </div>
    </div>
  );
};

export default ModularControls;