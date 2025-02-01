import { createFretMatrix } from './matrices.js';

const matrix = createFretMatrix(24, 6);
console.log(JSON.stringify(matrix, null, 2));
