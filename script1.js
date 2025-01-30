
// function createRandomGrid(){
//     let grid = new Array(9).fill(null).map( () => new Array(9).fill(0));
//     let columnGrid = [];
//     let startX, startY;

//     function getColumn(j){
//         for(let i = 0; i < 9; i++){
//             columnGrid[i] = grid[i][j];        
//         }
//         return columnGrid;
//     }
//     function getInnerGrid(x, y){
//         startX = Math.floor(x / 3) * 3;
//         startY = Math.floor(y / 3) * 3;
//     }

//     function isValid(x, y, newRand){
//         getInnerGrid(x, y);
//         let validRow = !grid.includes(newRand);
//         let validCol = !getColumn(y).includes(newRand);
//         let validGri = true;

//         for(let i = startX; i < startX + 3; i++){
//             for(let j = startY; j < startY + 3; j++){
//                 if(grid[i][j] === newRand){
//                     validGri = false;
//                 }
//             }
//         }
//         return validRow && validCol && validGri;
//     }

//     for(let i = 0; i < 9; i++){
//         for(let j = 0; j < 9; j++){
//             let attempts = 0;
//             do{
//                 let newRand = Math.floor(Math.random() * 9) + 1;    
//                 if(isValid(i, j, newRand)){
//                     grid[i][j] = newRand;
//                     attempts = 1000;
//                 }
//                 attempts++;
//             }while(attempts < 100);
//         }
//     }

//     console.log(grid);

// }

// createRandomGrid();

function countSudokuSolutions(board) {
    let solutions = 0;

    // Helper function to check if placing a number is valid
    function isValid(board, row, col, num) {
        // Check the row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }

        // Check the column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }

        // Check the 3x3 subgrid
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }

        return true;
    }

    // Helper function to solve the Sudoku using backtracking
    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) { // Find an empty cell
                    for (let num = 1; num <= 9; num++) { // Try numbers 1-9
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num; // Place the number

                            solve(board); // Recursively solve the next cell

                            board[row][col] = 0; // Backtrack
                        }
                    }
                    return; // If no valid number is found, return to backtrack
                }
            }
        }

        // If the board is completely filled, count it as a solution
        solutions++;
    }

    solve(board);
    return solutions;
}

// Example Usage:
let sudokuBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

console.log("Number of solutions:", countSudokuSolutions(sudokuBoard));
