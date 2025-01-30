import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MiniFretboardProgression from './MiniFretboardProgression';

const Progression = ({ chords = [], onRemoveChord, onReorderChords }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    onReorderChords(sourceIndex, destinationIndex);
  };

  // Ensure we always have at least 6 slots
  const slots = [...chords];
  while (slots.length < 6) {
    slots.push(null);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="progression" direction="horizontal">
        {(provided, snapshot) => (
          <div 
            className="progression-container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {slots.map((chord, index) => (
              <Draggable 
                key={`slot-${index}`}
                draggableId={`slot-${index}`}
                index={index}
                isDragDisabled={!chord}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`progression-slot ${!chord ? 'empty' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                  >
                    {chord ? (
                      <MiniFretboardProgression
                        notes={chord.notes}
                        indexes={chord.indexes}
                        clickedFrets={chord.clickedFrets}
                        scaleNotes={chord.scaleNotes}
                        startFret={chord.startFret}
                        position={index}
                        onRemove={onRemoveChord}
                      />
                    ) : (
                      <div className="empty-slot">
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
    </DragDropContext>
  );
};

export default Progression;
