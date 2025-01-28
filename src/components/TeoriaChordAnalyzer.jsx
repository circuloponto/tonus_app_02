import React, { useState, useEffect } from 'react';
import teoria from 'teoria';

const TeoriaChordAnalyzer = ({ notes }) => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (notes.length > 0) {
      try {
        // Convert notes to teoria note objects
        const teoriaChord = teoria.chord(notes[0]);
        
        // Get intervals relative to root
        const intervals = notes.map(note => {
          const teoriaNote = teoria.note(note);
          const interval = teoria.interval(teoriaChord.root, teoriaNote);
          return interval.toString();
        });

        // Get chord quality and extensions
        const quality = teoriaChord.quality();
        const chordType = teoriaChord.chordType();
        
        setAnalysis({
          root: teoriaChord.root.toString(),
          name: teoriaChord.name,
          quality: quality,
          type: chordType,
          intervals: intervals,
          notes: notes,
          symbol: teoriaChord.symbol
        });
      } catch (error) {
        console.log('Teoria analysis error:', error);
        setAnalysis(null);
      }
    } else {
      setAnalysis(null);
    }
  }, [notes]);

  if (!analysis) {
    return <div className="teoria-analyzer">No chord selected</div>;
  }

  return (
    <div className="teoria-analyzer">
      <h3>Teoria Analysis</h3>
      <div className="teoria-details">
        <p><strong>Root:</strong> {analysis.root}</p>
        <p><strong>Name:</strong> {analysis.name}</p>
        <p><strong>Quality:</strong> {analysis.quality}</p>
        <p><strong>Type:</strong> {analysis.type}</p>
        <p><strong>Symbol:</strong> {analysis.symbol}</p>
        <p><strong>Intervals:</strong> {analysis.intervals.join(', ')}</p>
        <p><strong>Notes:</strong> {analysis.notes.join(', ')}</p>
      </div>
    </div>
  );
};

export default TeoriaChordAnalyzer;
