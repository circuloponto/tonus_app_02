import { useState } from 'react'
import './App.css'
import { createFretMatrix,createNotesMatrix } from './matrices.js'
import Fretboard from './components/Fretboard.jsx'
import Controls from './components/Controls.jsx'

function App() {
  const notes = [
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#','B'],
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F','F#'],
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#','D'],
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#','A'],
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#','E'],
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#','B'],
  ];

  const [numFrets, setNumFrets] = useState(19);
  const [notesMatrix, setMatrix] = useState(notes)
  const [indexes, setIndexes] = useState(createFretMatrix(numFrets, 6))
  const [clickedFrets, setClickedFrets] = useState([])
  const [clickedNotes, setClickedNotes] = useState([]);

  const clearFrets = () => {
    setClickedFrets([]);
    setClickedNotes([]);
  };

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
    console.log('Fret clicked:', note, 'String:', stringIndex, 'Fret:', fretIndex);
    const fretId = `string${stringIndex}-fret-${fretIndex}`;

    // Handle fret highlighting
    setClickedFrets(prevClickedFrets => {
      const updatedFrets = prevClickedFrets.filter(id => {
        const stringPart = id.split('-')[0];
        return stringPart !== `string${stringIndex}`;
      });

      // If the fret was already clicked, just remove it
      if (prevClickedFrets.includes(fretId)) {
        console.log('Removing fret:', fretId);
        return updatedFrets;
      } else {
        console.log('Adding fret:', fretId);
        return [...updatedFrets, fretId];
      }
    });

    // Handle notes collection
    setClickedNotes(prevNotes => {
      // Check if this string already has a note
      const existingFret = clickedFrets.find(id => id.startsWith(`string${stringIndex}`));
      
      // If we're clicking an already selected fret, remove its note
      if (existingFret && fretId === existingFret) {
        const newNotes = prevNotes.filter(n => n !== note);
        console.log('Removing note:', note, 'Updated notes:', newNotes);
        return newNotes;
      }
      
      // If we're clicking a new fret on this string, replace the old note
      const notesWithoutString = prevNotes.filter(n => {
        const oldFret = clickedFrets.find(id => id.startsWith(`string${stringIndex}`));
        if (!oldFret) return true;
        const [,, oldFretNum] = oldFret.split('-');
        return n !== notesMatrix[stringIndex][oldFretNum];
      });
      
      // Add the new note if we're not removing it
      // Instead of sorting, we'll maintain the order based on string index
      const newNotes = [...notesWithoutString];
      if (!existingFret || fretId !== existingFret) {
        // Find the correct position to insert the note based on string index
        const insertIndex = clickedFrets.filter(id => {
          const [, , fretNum] = id.split('-');
          return parseInt(id.match(/string(\d+)/)[1]) > stringIndex;
        }).length;
        newNotes.splice(insertIndex, 0, note);
        console.log('Adding note:', note, 'at position:', insertIndex, 'Updated notes:', newNotes);
      }
      return newNotes;
    });
  }
  console.log('createNotesMatrix(24)',createNotesMatrix(24))
  return (
    <>
      <div className="container">
        <div className="content">
          <Controls 
            numFrets={numFrets}
            setNumFrets={setNumFrets}
            setIndexes={setIndexes}
            setMatrix={setMatrix}
            clickedNotes={clickedNotes}
            onClear={clearFrets}
            createNotesMatrix={createNotesMatrix}
          />
          <Fretboard notes={notesMatrix} indexes={indexes} onFretClick={handleFretClick} clickedFrets={clickedFrets} />
        </div>
      </div>
    </>
  )
}

export default App
