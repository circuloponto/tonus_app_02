import React, { useState } from 'react';
import './App.css';
import { createFretMatrix, createNotesMatrix } from './matrices.js';
import Fretboard from './components/Fretboard.jsx';
import ModularControls from './components/ModularControls.jsx';
import ColorLegend from './components/ColorLegend';

function App() {
  const [numFrets, setNumFrets] = useState(19);
  const [notesMatrix, setNotesMatrix] = useState(createNotesMatrix(numFrets));
  const [indexes, setIndexes] = useState(createFretMatrix(numFrets, 6));
  const [clickedFrets, setClickedFrets] = useState([]);
  const [clickedNotes, setClickedNotes] = useState([]);
  const [scaleNotes, setScaleNotes] = useState([]);
  const [hoveredType, setHoveredType] = useState(null);
  const [isControlsOpen, setIsControlsOpen] = useState(true);

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

  return (
    <div className={`container ${hoveredType ? `hover-${hoveredType}` : ''}`}>
      <div className="content">
        <ModularControls 
          numFrets={numFrets}
          setNumFrets={handleNumFretsChange}
          clickedNotes={clickedNotes}
          onClear={clearFrets}
          onSelectScale={handleScaleSelect}
          isOpen={isControlsOpen}
          onToggle={() => setIsControlsOpen(!isControlsOpen)}
        />
        <Fretboard 
          notes={notesMatrix} 
          indexes={indexes} 
          onFretClick={handleFretClick} 
          clickedFrets={clickedFrets}
          scaleNotes={scaleNotes} 
        />
        <div className="bottom-controls">
          <ColorLegend onHover={handleHover} />
          <button className="clear-button" onClick={clearFrets}>
            Clear Fretboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
