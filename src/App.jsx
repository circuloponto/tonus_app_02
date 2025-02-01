import React, { useState } from 'react';
import './App.css';
import { createFretMatrix, createNotesMatrix } from './matrices.js';
import Fretboard from './components/Fretboard.jsx';
import ModularControls from './components/ModularControls.jsx';
import ColorLegend from './components/ColorLegend';
import Progression from './components/Progression.jsx';
import { DragDropContext } from 'react-beautiful-dnd';

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
      // Find the first empty slot or append to the end
      const firstEmptyIndex = prev.findIndex(slot => !slot);
      const newProgression = [...prev];
      
      // Ensure chord has the correct structure
      const formattedChord = {
        notes: chord.notes || [],
        indexes: chord.indexes || [],
        clickedFrets: chord.clickedFrets || [],
        scaleNotes: chord.scaleNotes || [],
        startFret: chord.startFret || 0
      };
      
      if (firstEmptyIndex === -1) {
        // No empty slots, append to end
        newProgression.push(formattedChord);
      } else {
        // Fill the first empty slot
        newProgression[firstEmptyIndex] = formattedChord;
      }
      return newProgression;
    });
  };

  const handleRemoveChord = (index) => {
    setProgression(prev => {
      const newProgression = [...prev];
      newProgression[index] = null;
      return newProgression;
    });
  };

  const handleReorderChords = (sourceIndex, destinationIndex) => {
    setProgression(prev => {
      const newProgression = [...prev];
      const [removed] = newProgression.splice(sourceIndex, 1);
      newProgression.splice(destinationIndex, 0, removed);
      return newProgression;
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    handleReorderChords(sourceIndex, destinationIndex);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
            clickedFrets={clickedFrets}
            onFretClick={handleFretClick}
            scaleNotes={scaleNotes} 
            onAddToProgression={handleAddToProgression}
            isVoiceLeadingMode={isVoiceLeadingMode}
          />
          
          {isVoiceLeadingMode ? (
            <Progression 
              chords={progression} 
              onRemoveChord={handleRemoveChord}
              onReorderChords={handleReorderChords}
            />
          ) : (
            <Fretboard 
              notes={notesMatrix} 
              indexes={indexes} 
              onFretClick={handleFretClick} 
              clickedFrets={clickedFrets}
              scaleNotes={scaleNotes} 
            />
          )}
          <ColorLegend onHover={handleHover} />
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
