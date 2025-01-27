import React, { useState, useEffect } from 'react';
import NotePicker from './NotePicker';
import { Scale, Note } from '@tonaljs/tonal';

const Scales = ({ onSelectScale }) => {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedScale, setSelectedScale] = useState('major');
  
  const scaleTypes = [
    { name: 'major', label: 'Major' },
    { name: 'minor', label: 'Minor' },
    { name: 'dorian', label: 'Dorian' },
    { name: 'phrygian', label: 'Phrygian' },
    { name: 'lydian', label: 'Lydian' },
    { name: 'mixolydian', label: 'Mixolydian' },
    { name: 'locrian', label: 'Locrian' },
  ];

  const normalizeNote = (note) => {
    // First normalize the note using tonal's Note module
    const parsed = Note.get(note);
    if (!parsed.empty) {
      // Convert to sharp notation
      const normalized = Note.simplify(parsed.name);
      // Handle specific cases where we want sharp instead of flat
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

  useEffect(() => {
    // Get the scale notes using tonal
    const scale = Scale.get(`${selectedRoot} ${selectedScale}`);
    console.log('Raw scale:', scale);
    
    // Normalize each note
    const normalizedNotes = scale.notes.map(normalizeNote);
    console.log('Normalized notes:', normalizedNotes);
    
    onSelectScale(normalizedNotes);
  }, [selectedRoot, selectedScale]);

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
        <select 
          value={selectedScale}
          onChange={(e) => setSelectedScale(e.target.value)}
          className="scale-select"
        >
          {scaleTypes.map(scale => (
            <option key={scale.name} value={scale.name}>
              {scale.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Scales;
