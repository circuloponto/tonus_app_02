import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Fretboard from './components/Fretboard';
import ModularControls from './components/ModularControls';
import Progression from './components/Progression';
import { createFretMatrix, createNotesMatrix } from './matrices.js';
import styles from './App.module.css';

function App() {
  const [numFrets, setNumFrets] = useState(24);
  const [clickedFrets, setClickedFrets] = useState([]);
  const [clickedNotes, setClickedNotes] = useState([]);
  const [scaleNotes, setScaleNotes] = useState([]);
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isVoiceLeadingMode, setIsVoiceLeadingMode] = useState(false);
  const [chords, setChords] = useState([]);

  const notesMatrix = createNotesMatrix(numFrets);
  const indexesMatrix = createFretMatrix(numFrets, 6);

  const handleFretClick = (e, note, stringIndex, fretIndex) => {
    const isAlreadyClicked = clickedFrets.some(
      fret => fret.stringIndex === stringIndex && fret.fretIndex === fretIndex
    );

    if (isAlreadyClicked) {
      setClickedFrets(prev => prev.filter(
        fret => !(fret.stringIndex === stringIndex && fret.fretIndex === fretIndex)
      ));
      setClickedNotes(prev => prev.filter(n => n !== note));
    } else {
      setClickedFrets(prev => [...prev, { stringIndex, fretIndex }]);
      setClickedNotes(prev => [...prev, note]);
    }
  };

  const handleClear = () => {
    setClickedFrets([]);
    setClickedNotes([]);
  };

  const handleAddToProgression = (chord) => {
    setChords(prev => [...prev, chord]);
  };

  const handleRemoveChord = (index) => {
    setChords(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorderChords = (sourceIndex, destinationIndex) => {
    const reorderedChords = Array.from(chords);
    const [removed] = reorderedChords.splice(sourceIndex, 1);
    reorderedChords.splice(destinationIndex, 0, removed);
    setChords(reorderedChords);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    handleReorderChords(result.source.index, result.destination.index);
  };

  return (
    <div className={styles.container}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.fretboardContainer}>
          <Fretboard
            notes={notesMatrix}
            indexes={indexesMatrix}
            onFretClick={handleFretClick}
            clickedFrets={clickedFrets}
            scaleNotes={scaleNotes}
          />
        </div>

        <Progression
          chords={chords}
          onRemoveChord={handleRemoveChord}
          onReorderChords={handleReorderChords}
        />

        <ModularControls
          numFrets={numFrets}
          setNumFrets={setNumFrets}
          clickedNotes={clickedNotes}
          onClear={handleClear}
          onSelectScale={setScaleNotes}
          isOpen={isControlsOpen}
          onToggle={() => setIsControlsOpen(!isControlsOpen)}
          onVoiceLeadingModeChange={setIsVoiceLeadingMode}
          clickedFrets={clickedFrets}
          onFretClick={handleFretClick}
          scaleNotes={scaleNotes}
          onAddToProgression={handleAddToProgression}
          isVoiceLeadingMode={isVoiceLeadingMode}
        />
      </DragDropContext>
    </div>
  );
}

export default App;