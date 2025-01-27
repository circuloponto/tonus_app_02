import React, { useState, useEffect } from 'react';
import NotePicker from './NotePicker';
import ScalePicker from './ScalePicker';
import CustomScaleBuilder from './CustomScaleBuilder';
import { Scale, Note } from '@tonaljs/tonal';

const Scales = ({ onSelectScale }) => {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedScale, setSelectedScale] = useState('custom');
  const [customIntervals, setCustomIntervals] = useState([0]); // Root note is always selected
  
  const scaleTypes = [
    { name: 'custom', label: 'Custom' },
    { name: 'major', label: 'Major' },
    { name: 'minor', label: 'Minor' },
    { name: 'dorian', label: 'Dorian' },
    { name: 'phrygian', label: 'Phrygian' },
    { name: 'lydian', label: 'Lydian' },
    { name: 'mixolydian', label: 'Mixolydian' },
    { name: 'locrian', label: 'Locrian' },
  ];

  const normalizeNote = (note) => {
    const parsed = Note.get(note);
    if (!parsed.empty) {
      const normalized = Note.simplify(parsed.name);
      const flatToSharp = {
        'Bb': 'A#',
        'Db': 'C#',
        'Eb': 'D#',
        'Gb': 'F#',
        'Ab': 'G#'
      };
      return flatToSharp[normalized] || normalized;
    }
    return note;
  };

  const handleIntervalToggle = (interval) => {
    if (interval === 0) return; // Can't toggle root note
    setCustomIntervals(prev => 
      prev.includes(interval)
        ? prev.filter(i => i !== interval)
        : [...prev, interval].sort((a, b) => a - b)
    );
  };

  useEffect(() => {
    if (selectedScale === 'custom') {
      // Generate chromatic scale starting from root
      const chromaticScale = Scale.get(`${selectedRoot} chromatic`).notes;
      
      // Use intervals to pick notes from chromatic scale
      const scaleNotes = customIntervals.map(interval => 
        normalizeNote(chromaticScale[interval])
      );
      
      onSelectScale(scaleNotes);
    } else {
      // Use tonal for predefined scales
      const scale = Scale.get(`${selectedRoot} ${selectedScale}`);
      const normalizedNotes = scale.notes.map(normalizeNote);
      onSelectScale(normalizedNotes);
    }
  }, [selectedRoot, selectedScale, customIntervals]);

  return (
    <div className="scales-section">
      <div className="scale-controls">
        <label>Root Note</label>
        <NotePicker 
          selectedNote={selectedRoot}
          onSelectNote={setSelectedRoot}
        />
      </div>
      <div className="scale-controls">
        <label>Scale Type</label>
        <ScalePicker
          selectedScale={selectedScale}
          onSelectScale={setSelectedScale}
          scaleTypes={scaleTypes}
        />
        {selectedScale === 'custom' && (
          <CustomScaleBuilder
            intervals={customIntervals}
            onIntervalToggle={handleIntervalToggle}
          />
        )}
      </div>
    </div>
  );
};

export default Scales;
