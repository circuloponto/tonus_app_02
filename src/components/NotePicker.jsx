import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from '@react-spring/web';

const NotePicker = ({ onSelectNote, selectedNote }) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const [currentIndex, setCurrentIndex] = useState(notes.indexOf(selectedNote) || 0);
  const [isDragging, setIsDragging] = useState(false);
  const itemWidth = 50;

  const [springs, api] = useSpring(() => ({
    x: 0,
    config: {
      tension: 300,
      friction: 30,
      clamp: true
    }
  }));

  const snapToNote = (deltaX) => {
    const snapThreshold = itemWidth / 2;
    const direction = deltaX > 0 ? -1 : 1;
    
    if (Math.abs(deltaX) > snapThreshold) {
      const nextIndex = (currentIndex + direction + notes.length) % notes.length;
      setCurrentIndex(nextIndex);
      onSelectNote(notes[nextIndex]);
    }
    
    api.start({ 
      x: 0,
      config: {
        tension: 300,
        friction: 30,
        clamp: true
      }
    });
  };

  const handleArrowClick = (direction) => {
    const nextIndex = (currentIndex + direction + notes.length) % notes.length;
    setCurrentIndex(nextIndex);
    onSelectNote(notes[nextIndex]);
    api.start({ x: 0 });
  };

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      setIsDragging(true);
      const boundedDelta = Math.max(Math.min(deltaX, itemWidth), -itemWidth);
      api.start({ x: boundedDelta, immediate: true });
    },
    onSwipedLeft: ({ deltaX }) => {
      setIsDragging(false);
      snapToNote(deltaX);
    },
    onSwipedRight: ({ deltaX }) => {
      setIsDragging(false);
      snapToNote(deltaX);
    },
    onSwipedUp: () => {
      setIsDragging(false);
      api.start({ x: 0 });
    },
    onSwipedDown: () => {
      setIsDragging(false);
      api.start({ x: 0 });
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 10
  });

  useEffect(() => {
    const selectedIndex = notes.indexOf(selectedNote);
    if (selectedIndex !== -1 && selectedIndex !== currentIndex) {
      setCurrentIndex(selectedIndex);
      api.start({ x: 0 });
    }
  }, [selectedNote, currentIndex, notes]);

  return (
    <div className="note-picker-outer">
      <button 
        className="note-picker-arrow left"
        onClick={() => handleArrowClick(-1)}
      >
        ‹
      </button>
      <div className="note-picker-container" {...handlers}>
        <div className="note-picker-window">
          <animated.div 
            className="note-picker"
            style={springs}
          >
            <div className="note-item selected">
              {notes[currentIndex]}
            </div>
          </animated.div>
        </div>
      </div>
      <button 
        className="note-picker-arrow right"
        onClick={() => handleArrowClick(1)}
      >
        ›
      </button>
    </div>
  );
};

export default NotePicker;
