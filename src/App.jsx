import React, { useState } from 'react'
import './App.css'
import { createFretMatrix,createNotesMatrix } from './matrices.js'
import Fretboard from './components/Fretboard.jsx'
import Controls from './components/Controls.jsx'

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
        // If not clicked, add it
        return [...prevFrets, newFret];
      }
    });

    setClickedNotes(prevNotes => {
      const newNotes = [...prevNotes];
      const noteIndex = newNotes.indexOf(note);
      
      if (noteIndex === -1) {
        newNotes.push(note);
      } else {
        newNotes.splice(noteIndex, 1);
      }
      
      return newNotes;
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

  return (
    <div className="container">
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
      </div>
    </div>
  )
}

export default App
