import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './Progression.module.css';

const Progression = ({ chords, onRemoveChord }) => {
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
            {chords.map((chord, index) => (
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
                    <div className={styles.chordNotes}>
                      {chord.notes.join(', ')}
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Progression;