import React, { useMemo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import MiniFretboardProgression from './MiniFretboardProgression';
import { createNotesMatrix } from '../matrices.js';
import styles from './Progression.module.css';

const Progression = ({ chords = [], onRemoveChord, onReorderChords }) => {
  // Create a full notes matrix for reference
  const fullNotesMatrix = useMemo(() => createNotesMatrix(24), []);

  // Ensure we always have 6 slots and assign stable IDs
  const slots = useMemo(() => {
    const result = [...chords];
    while (result.length < 6) {
      result.push(null);
    }
    return result.map((chord, index) => ({
      id: `slot-${index}`,
      chord,
      index
    }));
  }, [chords]);

  return (
    <div className={styles.progression_wrapper}>
      <Droppable droppableId="progression" direction="horizontal" onDragEnd={(result) => onReorderChords(result.destination.index, result.source.index)}>
        {(provided, snapshot) => (
          <div 
            className={styles.progression_container}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {slots.map((slot, index) => (
              <Draggable 
                key={slot.id}
                draggableId={slot.id}
                index={index}
                isDragDisabled={!slot.chord}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${styles.progression_slot} ${!slot.chord ? styles.empty : ''} ${snapshot.isDragging ? styles.dragging : ''}`}
                  >
                    {slot.chord ? (
                      <MiniFretboardProgression
                        notes={fullNotesMatrix}
                        indexes={slot.chord.indexes}
                        clickedFrets={slot.chord.clickedFrets}
                        scaleNotes={slot.chord.scaleNotes}
                        startFret={slot.chord.startFret}
                        position={index}
                        onRemove={() => onRemoveChord(index)}
                      />
                    ) : (
                      <div className={styles.empty_slot}>
                        Empty
                      </div>
                    )}
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
