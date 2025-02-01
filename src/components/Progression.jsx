import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import MiniFretboard from './MiniFretboard';
import styles from './Progression.module.css';

const Progression = ({ chords, onRemoveChord, scaleNotes, numFrets }) => {
  console.log('Progression chords:', chords);
  
  return (
    <div className={styles.progression}>
      <h3>Chord Progression</h3>
      <Droppable droppableId="progression">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.chordList}
          >
            {chords.map((chord, index) => {
              console.log('Rendering chord:', chord);
              return (
                <Draggable
                  key={index}
                  draggableId={`chord-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.chordItem}
                    >
                      <div className={styles.chordFretboard}>
                        <MiniFretboard
                          clickedFrets={chord.clickedFrets}
                          scaleNotes={scaleNotes}
                          startFret={chord.startFret}
                          endFret={chord.endFret}
                          numFrets={numFrets}
                        />
                        <div className={styles.chordNumber}>{index + 1}</div>
                      </div>
                      <div className={styles.chordNotes}>
                        {chord.notes ? chord.notes.join(', ') : ''}
                      </div>
                      <button
                        onClick={() => onRemoveChord(index)}
                        className={styles.removeButton}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Progression;