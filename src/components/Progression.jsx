import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MiniFretboardProgression from './MiniFretboardProgression';

const Progression = ({ chords, onRemoveChord, onReorderChords }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    onReorderChords(sourceIndex, destinationIndex);
  };

  const getStyle = (style, snapshot) => {
    if (!style) return {};
    if (!snapshot.isDropAnimating) {
      return style;
    }
    return {
      ...style,
      transform: style.transform,
    };
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="progression-outer">
        <Droppable droppableId="progression" direction="horizontal">
          {(provided) => (
            <div 
              className="progression-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {chords.map((chord, index) => (
                <Draggable 
                  key={`slot-${index}`}
                  draggableId={`slot-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`progression-slot ${!chord ? 'empty' : ''}`}
                      style={getStyle(provided.draggableProps.style, snapshot)}
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
      </div>
    </DragDropContext>
  );
};

export default Progression;
