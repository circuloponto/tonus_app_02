import React, { useState } from 'react';
import './App.css';
import { createFretMatrix, createNotesMatrix } from './matrices.js';
import Fretboard from './components/Fretboard.jsx';
import MiniFretboard from './components/MiniFretboard.jsx';
import ModularControls from './components/ModularControls.jsx';
import ColorLegend from './components/ColorLegend';
import Progression from './components/Progression.jsx';

function App() {
  const [numFrets, setNumFrets] = useState(19);
  const [notesMatrix, setNotesMatrix] = useState(createNotesMatrix(numFrets));
  const [indexes, setIndexes] = useState(createFretMatrix(numFrets, 6));
  const [clickedFrets, setClickedFrets] = useState([]);
  const [clickedNotes, setClickedNotes] = useState([]);
  const [scaleNotes, setScaleNotes] = useState([]);
  const [hoveredType, setHoveredType] = useState(null);
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isVoiceLeadingMode, setIsVoiceLeadingMode] = useState(false);
  const [progression, setProgression] = useState([]);

  const clearFrets = () => {
    setClickedFrets([]);
    setClickedNotes([]);
  };

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
    console.log('Clicked note:', note, 'at string:', stringIndex, 'fret:', fretIndex);
    
    const newFret = {
      stringIndex: stringIndex,
      fretIndex: fretIndex
    };

    setClickedFrets(prevFrets => {
      const isAlreadyClicked = prevFrets.some(
        fret => fret.stringIndex === newFret.stringIndex && fret.fretIndex === newFret.fretIndex
      );

      if (isAlreadyClicked) {
        console.log('Removing note:', note);
        return prevFrets.filter(
          fret => !(fret.stringIndex === newFret.stringIndex && fret.fretIndex === newFret.fretIndex)
        );
      } else {
        console.log('Adding note:', note);
        const fretsOnOtherStrings = prevFrets.filter(fret => fret.stringIndex !== stringIndex);
        return [...fretsOnOtherStrings, newFret];
      }
    });

    setClickedNotes(prevNotes => {
      if (prevNotes.includes(note)) {
        const newNotes = prevNotes.filter(n => n !== note);
        console.log('Updated clicked notes after removal:', newNotes);
        return newNotes;
      } else {
        const newNotes = [...prevNotes, note];
        console.log('Updated clicked notes after addition:', newNotes);
        return newNotes;
      }
    });
  };

  const handleScaleSelect = (notes) => {
    setScaleNotes(notes);
  };

  const handleNumFretsChange = (newNumFrets) => {
    setNumFrets(newNumFrets);
    setNotesMatrix(createNotesMatrix(newNumFrets));
    setIndexes(createFretMatrix(newNumFrets, 6));
  };

  const handleHover = (type) => {
    setHoveredType(type);
  };

  const handleAddToProgression = (chord) => {
    setProgression(prev => {
      const firstEmptyIndex = prev.findIndex(slot => !slot);
      if (firstEmptyIndex === -1 && prev.length < 6) {
        return [...prev, chord];
      } else if (firstEmptyIndex !== -1) {
        const newProgression = [...prev];
        newProgression[firstEmptyIndex] = chord;
        return newProgression;
      }
      return prev;
    });
  };

  const handleRemoveChord = (index) => {
    setProgression(prev => {
      const newProgression = [...prev];
      newProgression[index] = null;
      // Compact the array by moving all chords to the left
      const compacted = newProgression.filter(chord => chord);
      // Fill the remaining slots with null
      while (compacted.length < 6) {
        compacted.push(null);
      }
      return compacted;
    });
  };

  const handleReorderChords = (sourceIndex, destinationIndex) => {
    setProgression(prev => {
      // Create a compact array of non-null chords
      const compactChords = prev.filter(chord => chord);
      
      // Perform the reorder on the compact array
      const [removed] = compactChords.splice(sourceIndex, 1);
      compactChords.splice(destinationIndex, 0, removed);
      
      // Fill the remaining slots with null
      while (compactChords.length < 6) {
        compactChords.push(null);
      }
      
      return compactChords;
    });
  };

  return (
    <div className={`container ${hoveredType ? `hover-${hoveredType}` : ''} ${isVoiceLeadingMode ? 'voice-leading-mode' : ''}`}>
      <div className="content">
        <ModularControls 
          numFrets={numFrets}
          setNumFrets={handleNumFretsChange}
          clickedNotes={clickedNotes}
          onClear={clearFrets}
          onSelectScale={handleScaleSelect}
          isOpen={isControlsOpen}
          onToggle={() => setIsControlsOpen(!isControlsOpen)}
          onVoiceLeadingModeChange={setIsVoiceLeadingMode}
        />
        
        {isVoiceLeadingMode ? (
          <>
            <MiniFretboard 
              notes={createNotesMatrix(24)} 
              indexes={createFretMatrix(24, 6)} 
              onFretClick={handleFretClick} 
              clickedFrets={clickedFrets}
              scaleNotes={scaleNotes}
              onAddToProgression={handleAddToProgression}
            />
            <Progression 
              chords={progression} 
              onRemoveChord={handleRemoveChord}
              onReorderChords={handleReorderChords}
            />
          </>
        ) : (
          <>
            <Fretboard 
              notes={notesMatrix} 
              indexes={indexes} 
              onFretClick={handleFretClick} 
              clickedFrets={clickedFrets}
              scaleNotes={scaleNotes} 
            />
            <ColorLegend />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
