import React, { useState } from 'react'
import './App.css'
import { createFretMatrix,createNotesMatrix } from './matrices.js'
import Fretboard from './components/Fretboard.jsx'
import Controls from './components/Controls.jsx'
import ColorLegend from './components/ColorLegend';
import TeoriaChordAnalyzer from './components/TeoriaChordAnalyzer';
import ChordAnalyzer from './components/ChordAnalyzer';

function App() {
  const notes = [
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#']
  ]
  const [numFrets, setNumFrets] = useState(19)
  const [notesMatrix, setNotesMatrix] = useState(createNotesMatrix(numFrets))
  const [indexes, setIndexes] = useState(createFretMatrix(numFrets, 6))
  const [clickedFrets, setClickedFrets] = useState([])
  const [clickedNotes, setClickedNotes] = useState([]);
  const [scaleNotes, setScaleNotes] = useState([]);
  const [hoveredType, setHoveredType] = useState(null);

  const clearFrets = () => {
    setClickedFrets([]);
    setClickedNotes([]);
  };

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
    const newFret = {
      stringIndex: stringIndex,
      fretIndex: fretIndex
    };

    setClickedFrets(prevFrets => {
      // Check if this fret is already clicked
      const isAlreadyClicked = prevFrets.some(
        fret => fret.stringIndex === newFret.stringIndex && fret.fretIndex === newFret.fretIndex
      );

      if (isAlreadyClicked) {
        // If clicked, remove it
        return prevFrets.filter(
          fret => !(fret.stringIndex === newFret.stringIndex && fret.fretIndex === newFret.fretIndex)
        );
      } else {
        // Remove any existing fret on the same string and add the new one
        const fretsOnOtherStrings = prevFrets.filter(fret => fret.stringIndex !== stringIndex);
        return [...fretsOnOtherStrings, newFret];
      }
    });

    setClickedNotes(prevNotes => {
      if (prevNotes.includes(note)) {
        return prevNotes.filter(n => n !== note);
      } else {
        return [...prevNotes, note];
      }
    });
  }

  const handleScaleSelect = (notes) => {
    setScaleNotes(notes);
    console.log('Selected scale notes:', notes);
  };

  const handleNumFretsChange = (newNumFrets) => {
    setNumFrets(newNumFrets);
    setNotesMatrix(createNotesMatrix(newNumFrets));
    setIndexes(createFretMatrix(newNumFrets, 6));
  };

  const handleHover = (type) => {
    console.log('App hover:', type); // Debug log
    setHoveredType(type);
  };

  return (
    <div className={`container ${hoveredType ? `hover-${hoveredType}` : ''}`}>
      <div className="content">
        <div className="controls-container">
          <Controls 
            numFrets={numFrets}
            setNumFrets={handleNumFretsChange}
            clickedNotes={clickedNotes}
            onClear={clearFrets}
            createNotesMatrix={createNotesMatrix}
            onSelectScale={handleScaleSelect}
          />
        </div>
        <Fretboard 
          notes={notesMatrix} 
          indexes={indexes} 
          onFretClick={handleFretClick} 
          clickedFrets={clickedFrets}
          scaleNotes={scaleNotes} 
        />
        <div className="analyzers">
        {/*   <ChordAnalyzer notes={clickedNotes} /> */}
         {/*  <TeoriaChordAnalyzer notes={clickedNotes} /> */}
        </div>
        <ColorLegend onHover={handleHover} />
      </div>
    </div>
  )
}

export default App
