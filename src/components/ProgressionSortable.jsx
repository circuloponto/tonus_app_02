import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import MiniFretboardProgression from './MiniFretboardProgression';
import styles from './Progression.module.css';

const ProgressionSortable = ({ chords = [], onRemoveChord, onReorderChords }) => {
  // Ensure we always have at least 6 slots
  const slots = [...chords];
  while (slots.length < 6) {
    slots.push(null);
  }

  // Add unique ids for sortable
  const items = slots.map((chord, index) => ({
    id: `slot-${index}`,
    chord
  }));

  const handleSort = (newState) => {
    // Only handle reorder if there's a change
    if (newState.some((item, index) => items[index].id !== item.id)) {
      const sourceIndex = slots.findIndex((_, i) => items[i].id !== newState[i].id);
      const destinationIndex = newState.findIndex(item => items[sourceIndex].id === item.id);
      onReorderChords(sourceIndex, destinationIndex);
    }
  };

  return (
    <div className={styles.progression_wrapper}>
      <ReactSortable 
        list={items}
        setList={handleSort}
        animation={150}
        delayOnTouchOnly={true}
        delay={2}
        className={styles.progression_container}
        filter=".empty"
        dragClass={styles.dragging}
        ghostClass={styles.ghost}
        forceFallback={true}
      >
        {items.map(({ id, chord }, index) => (
          <div
            key={id}
            className={`${styles.progression_slot} ${!chord ? 'empty' : ''}`}
          >
            {chord ? (
              <MiniFretboardProgression
                notes={chord.notes}
                indexes={chord.indexes}
                clickedFrets={chord.clickedFrets}
                scaleNotes={chord.scaleNotes}
                startFret={chord.startFret}
                position={index}
                onRemove={() => onRemoveChord(index)}
              />
            ) : (
              <div className={styles.empty_slot}>
                Empty
              </div>
            )}
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default ProgressionSortable;
