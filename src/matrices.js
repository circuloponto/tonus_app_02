export const notes = [
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
  ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
  ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
  ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
];

export const indexes = [
  [96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115],
  [77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96],
  [58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77],
  [39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58],
  [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
];

const intervals = {
  0: 'unison',
  1: 'b2',
  2: 'M2',
  3: 'b3',
  4: 'M3',
  5: 'P4',
  6: 'b5',
  7: 'P5',
  8: 'b6',
  9: 'M6',
  10: 'b7',
  11: 'M7',
  12: 'P8',
  13: 'b9',
  14: 'M9',
  15: 'b10',
  16: 'M10',
  17: 'P11',
  18: 'b12',
  19: 'M12',
  20: 'b13',
  21: 'M13',
};

export const createFretMatrix = (numFrets, numStrings) => {
  const matrix = [];
  for (let i = 0; i < numStrings; i++) {
    const row = [];
    const startIndex = i * (numFrets + 1);
    for (let j = 0; j <= numFrets; j++) {
      row.push(startIndex + j);
    }
    matrix.push(row);
  }
  return matrix;
};

export const createNotesMatrix = (numFrets) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const stringStartNotes = ['E', 'B', 'G', 'D', 'A', 'E']; // Standard tuning, from high E to low E

  const matrix = stringStartNotes.map(startNote => {
    const startIndex = notes.indexOf(startNote);
    const stringNotes = [];
    
    for (let fret = 0; fret <= numFrets; fret++) {
      const noteIndex = (startIndex + fret) % 12;
      stringNotes.push(notes[noteIndex]);
    }
    
    return stringNotes;
  });

  return matrix;
};