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

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
    console.log('Fret clicked:', note, 'String:', stringIndex, 'Fret:', fretIndex);
    const fretId = `string${stringIndex}-fret-${fretIndex}`;

    setClickedFrets(prevClickedFrets => {
      const updatedFrets = prevClickedFrets.filter(id => {
        const stringPart = id.split('-')[0];
        return stringPart !== `string${stringIndex}`;
      });

      if (prevClickedFrets.includes(fretId)) {
        return updatedFrets;
      } else {
        return [...updatedFrets, fretId];
      }
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
            createNotesMatrix={createNotesMatrix}
          />
          <Fretboard notes={notesMatrix} indexes={indexes} onFretClick={handleFretClick} clickedFrets={clickedFrets} />
        </div>
      </div>
    </>
  )
}

export default App
