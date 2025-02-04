const mainTableSudoku = document.querySelector('#mainTableSudoku');
mainTableSudoku.style.borderCollapse = 'collapse';
const newGameOptions = document.querySelector('#newGameOptions');
const newGameContainer = document.querySelector('#newGameContainer');
const timerBox = document.querySelector('#timerCounter'); 
const numPad = document.querySelector('#numPad');
const numPadBtn = numPad.querySelectorAll('button');
const numPadArray = Array.from(numPadBtn);
let index = 0;
let currentCell = [10, 10];

let completeTable = new Array(9).fill(null).map(() => Array(9).fill(0));    

newGameOptions.style.visibility = 'hidden';

const levelGame = {
    level: ["easy", "medium", "hard", "expert"],
    levelCellsToRemove: [[32, 45], [46, 49], [50, 53], [53, 70]]
};

for(let i = 0; i < 9; i++){
    const newRow = document.createElement('tr');
    mainTableSudoku.appendChild(newRow);
    for(let j = 0; j < 9; j++){
        const newCell = document.createElement('td');
        newCell.style.border = '1px solid#696969';
        newCell.style.height = '60px';
        newCell.style.width = '60px';
        newCell.classList.add("sudoku-cell");
        if( (j+1) % 3 === 0){
            newCell.style.borderRight = '2px solid white';
        }
        newRow.appendChild(newCell);
    }
    if((i+1) % 3 === 0){
        newRow.style.borderBottom = '2px solid white';
    }
}

const sudokuCells = document.querySelectorAll(".sudoku-cell"); // Use querySelectorAll to select all cells

function hoverEffectCells() {
    sudokuCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            if( cell.parentElement.rowIndex !== currentCell[0] &&  cell.cellIndex !== currentCell[1]){
                cell.style.backgroundColor = "#ffffff4b"; // Semi-transparent white
            }
        });

        cell.addEventListener('mouseleave', () => {
            if( cell.parentElement.rowIndex !== currentCell[0] &&  cell.cellIndex !== currentCell[1]){
                cell.style.backgroundColor = "#ffffff00"; // Fully transparent    
            }
        });
    });
}

function handleCellClick(){
    sudokuCells.forEach(cell => {
        cell.addEventListener('click', () => {
            cell.style.backgroundColor = "#ffffffa1";
        });
        cell.addEventListener('mouseup', () => {
            cell.style.backgroundColor = "#ffffff00";
        });
    });
}
function handleNewGameContainer(){
    newGameContainer.addEventListener("mouseenter", () => {
        newGameOptions.style.opacity = "1";
        newGameOptions.style.visibility = "visible";
        newGameOptions.style.transform = "translateY(0)";
        newGameOptions.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out, visibility 0s";
    });

    //newGameContainer.addEventListener("mouseleave", () => {
        newGameOptions.addEventListener("mouseleave", () => {
            newGameOptions.style.opacity = "0";
            newGameOptions.style.transform = "translateY(100%)";
            newGameOptions.style.transition = "transform 0.5s ease-in, opacity 0.5s ease-in, visibility 0s linear 0.5s";
        });
        
    //});
}

document.addEventListener("DOMContentLoaded", () =>{
    hoverEffectCells();
    handleCellClick();
});



handleNewGameContainer();



class allSudokuTables{
    constructor(mistakes, totalTime){
        this.completeTableSudoku = new Array(9).fill(null).map(() => new Array(9).fill(0));
        this.gridToSolve = new Array(9).fill(null).map(() => new Array(9).fill(0));
        this.mistakes = mistakes;
        this.startTime = new Date(); 
        this.finalTime = null;
        this.totalTime = null;
        this.inProcessSudokuGrid = new Array(9).fill(null).map(() => new Array(9).fill(0));
        this.solutionsLeft = [];
        this.allSolutions = [];
    }

    setGrid(newGrid){
        if(Array.isArray(newGrid) && newGrid.length === 9 && newGrid.every(row => Array.isArray(row) && row.length === 9)){
            this.completeTableSudoku = newGrid;
        }else console.log("Invalid grid format. It must be a 9x9 matrix");
    }
    displayGrid(){
        console.log(this.completeTableSudoku);
    }
};

let currentSudokuTable = new allSudokuTables();



function generateTable(){
    let grid = new Array(9).fill(null).map( () => new Array(9).fill(0));

    function shuffle(array){
        for(let i = array.length - 1; i >= 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function isValid(x, y, num) {
        // Check row
        for (let j = 0; j < 9; j++) {
            if (grid[x][j] === num) return false;
        }
        // Check column
        for (let i = 0; i < 9; i++) {
            if (grid[i][y] === num) return false;
        }
        // Check 3x3 subgrid
        let startX = Math.floor(x / 3) * 3;
        let startY = Math.floor(y / 3) * 3;
        for (let i = startX; i < startX + 3; i++) {
            for (let j = startY; j < startY + 3; j++) {
                if (grid[i][j] === num) return false;
            }
        }
        return true;
    }

    function solve(){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(grid[i][j] === 0){
                    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for(let num of numbers){
                        if(isValid(i, j, num)){
                            grid[i][j] = num;
                            if(solve()){
                                return true;
                            }
                            grid[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }


    solve();

    console.log(grid);
    return grid;
}


currentSudokuTable.setGrid(generateTable());
currentSudokuTable.gridToSolve = currentSudokuTable.completeTableSudoku;


function eliminateCells(levelType){
    let temp = levelGame.levelCellsToRemove[levelType][1] - levelGame.levelCellsToRemove[levelType][0];
    let cellsToRemove = Math.floor(Math.random() * temp) + levelGame.levelCellsToRemove[levelType][0];

    let nonZeroCells = [];
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
                if(currentSudokuTable.gridToSolve[i][j] !== 0){
                    nonZeroCells.push([i, j]);
                }
        }
    }


    for(let i = nonZeroCells.length -1 ; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [nonZeroCells[i], nonZeroCells[j]] = [nonZeroCells[j], nonZeroCells[i]];
    }

    for(let i = 0; i < cellsToRemove && i < nonZeroCells.length; i++){
        let [x, y] = nonZeroCells[i];
        currentSudokuTable.gridToSolve[x][y] = 0;
    }

    console.log(currentSudokuTable.gridToSolve);
}

// function eliminateCells(levelType){
//     let temp = levelGame.levelCellsToRemove[levelType][1] - levelGame.levelCellsToRemove[levelType][0];
//     let cellsToRemove = Math.floor(Math.random() * temp) + levelGame.levelCellsToRemove[levelType][0];
//     for(let i = 0; i < cellsToRemove; i++){
//         let attempts = 0;
//         do{
//             let randomX = Math.floor(Math.random() * 9);
//             let randomY = Math.floor(Math.random() * 9);
//             attempts++;
//             if(currentSudokuTable.gridToSolve[randomX][randomY] !== 0){
//                 currentSudokuTable.gridToSolve[randomX][randomY] = 0;
//                 attempts = 100;
//             }
//         }while(attempts < 100);
//     }
//     console.log(currentSudokuTable.gridToSolve);
// }

eliminateCells(0);  



function displayGridToSolve(){
    mainTableSudoku.style.color = "white";
    mainTableSudoku.style.textAlign = "center";
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            mainTableSudoku.rows[i].cells[j].textContent = (currentSudokuTable.gridToSolve[i][j] !== 0) ? currentSudokuTable.gridToSolve[i][j] : " ";
        }
    }
}

displayGridToSolve();
getCellPressed();

let solvedSudoku = new Array(9).fill(null).map( () => new Array(9).fill(0));
solvedSudoku = currentSudokuTable.gridToSolve;



function findNextEmptyCell(puzzle){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(puzzle[i][j] === 0)
                return [i, j];
        }
    }
    return [null, null];
}

function isValid(puzzle, guess, row, col){
    let row_vals = puzzle[row];
    if( row_vals.includes(guess))
        return false;

    let col_val = [];
    for(let i = 0; i < 9; i++){
        col_val.push(puzzle[i][col]);
    }

    if( col_val.includes(guess))
        return false;

    let startX = Math.floor(row / 3) * 3;
    let startY = Math.floor(col / 3) * 3;

    for(let i = startX; i < startX + 3; i++){
        for(let j = startY; j < startY + 3; j++){
            if(puzzle[i][j] === guess)
                return false;
        }
    }
    return true;
}

function solveSudoku(puzzle){
    let [row, col] = findNextEmptyCell(puzzle);
    if(row === null){
        currentSudokuTable.allSolutions.push(puzzle.map(row => [...row]));
        return;
    }
    for(let guess = 1; guess < 10; guess++){
        if(isValid(puzzle, guess, row, col)){
            puzzle[row][col] = guess;
            solveSudoku(puzzle);
            puzzle[row][col] = 0;
        }
    }
}

solveSudoku(solvedSudoku);
currentSudokuTable.solutionsLeft = currentSudokuTable.allSolutions;


console.log("Number of solutions found : ", currentSudokuTable.allSolutions.length);
console.log("All Solutions : ", currentSudokuTable.allSolutions);

//this function will accept inputs from the button and will place the inputs in the chosen cell
console.log("Current solutions left: " + currentSudokuTable.solutionsLeft.length);




//-----------------------------Needs a lot of work----------------------------------------------
// function sudokuCompletion(){
//     let cellIndex;
//     getCellPressed();
//     cellIndex = currentCell;

//     function validateNumber(i){
//         let tempSolution = [];
//         let num = i + 1;
//         for(let j = 0; j < currentSudokuTable.solutionsLeft.length; j++){
//             if(num === currentSudokuTable.solutionsLeft[j][cellIndex[0]][cellIndex[1]]){
//                 tempSolution.push(j);
//             }
//         }
//         if(tempSolution.length > 0){
//             currentSudokuTable.solutionsLeft = currentSudokuTable.solutionsLeft.filter((element, index) => tempSolution.includes(index));
//             return true;
//         }
//         return false;
//     }
    
//     function handleClickBtn(event){
//         let i = numPadArray.indexOf(event.target);
//         if(validateNumber(i)){
//             currentSudokuTable.inProcessSudokuGrid[cellIndex[0]][cellIndex[1]] = i + 1;
//             mainTableSudoku.rows[cellIndex[0]].cells[cellIndex[1]].textContent = currentSudokuTable.inProcessSudokuGrid[cellIndex[0]][cellIndex[1]];
//         }else{
        
//         }
//     }

//     if(currentSudokuTable.gridToSolve[cellIndex[0]][cellIndex[1]] === 0){
//         for(let i = 0; i < 9; i++){
//             numPadArray[i].removeEventListener("click", handleClickBtn);
//             numPadArray[i].addEventListener("click", handleClickBtn);
//         }
//     }
// }
//-------------------------------------------------------------------------------------------------------------


//===================Recreation of sudokuCompletion funciton==============================

function sudokuCompletion(event) {
    let indX = currentCell[0];
    let indY = currentCell[1];

    if (indX < 9 && indY < 9) {
        let numberClicked = numPadArray.indexOf(event.target);
        console.log("Button clicked:", numberClicked + 1);

        if (currentSudokuTable.gridToSolve[indX][indY] === 0) {
            if (validateNumber(numberClicked)) {
                currentSudokuTable.inProcessSudokuGrid[indX][indY] = numberClicked + 1;
                mainTableSudoku.rows[indX].cells[indY].textContent = numberClicked + 1;
                console.log("Number entered successfully");
            } else {
                console.log("Invalid move!");
            }
        }
    }
}

function validateNumber(numberClicked) {
    let tempSolution = [];
    let num = numberClicked + 1;
    let [indX, indY] = currentCell;

    for (let j = 0; j < currentSudokuTable.solutionsLeft.length; j++) {
        if (num === currentSudokuTable.solutionsLeft[j][indX][indY]) {
            tempSolution.push(j);
        }
    }
    
    if (tempSolution.length > 0) {
        currentSudokuTable.solutionsLeft = currentSudokuTable.solutionsLeft.filter((_, index) => tempSolution.includes(index));
        return true;
    }
    return false;
}

numPadArray.forEach(button => {
    button.addEventListener("click", sudokuCompletion);
});

// function sudokuCompletion(){
//     getCellPressed();
//     let numberClicked = -1;
//     let indX = currentCell[0];
//     let indY = currentCell[1];

    
//     function getButtonClicked(){
//         for(let i = 0; i < 9; i++){
//             numPadArray[i].onclick = function(){
//                 numberClicked = i;
//                 console.log("Button clicked : " + numberClicked );

//                 if(indX < 9 && indY < 9){
//                     if(currentSudokuTable.gridToSolve[indX][indY] === 0){
//                         if(validateNumber()){
//                             currentSudokuTable.inProcessSudokuGrid[indX][indY] = numberClicked + 1;
//                             mainTableSudoku.rows[indX].cells[indY].textContent = currentSudokuTable.inProcessSudokuGrid[indX][indY];
//                             console.log("Number entered successfully");
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     function validateNumber(){
//         let tempSolution = [];
//         let num = numberClicked + 1;
//         for(let j = 0; j < currentSudokuTable.solutionsLeft.length; j++){
//             if(num === currentSudokuTable.solutionsLeft[j][indX][indY]){
//                 tempSolution.push(j);
//             }
//         }
//         if(tempSolution.length > 0){
//             currentSudokuTable.solutionsLeft = currentSudokuTable.solutionsLeft.filter((element, index) => tempSolution.includes(index));
//             return true;
//         }
//         return false;
//     }
//     console.log("indX: " + indX + " indY: " + indY);
//     if(indX < 9 && indY < 9){
//         console.log("indX: " + indX + " indY: " + indY);
//         getButtonClicked();
//     }
//     // adauga un if sa vad daca indX si indY sunt mai mici de 10    
// }


// //========================================================================================




function cronometer(){
    currentSudokuTable.startTime = 0;
    let intervalId = setInterval(() => {
        currentSudokuTable.startTime++;
        let tempMin = Math.floor(currentSudokuTable.startTime / 60);
        let tempSec = currentSudokuTable.startTime % 60;
        if(tempMin < 10 && tempSec < 10){
            timerBox.textContent = `0${tempMin}:0${tempSec}`;
        }else if(tempMin > 10 && tempSec > 10){
            timerBox.textContent = `${tempMin}:${tempSec}`;
        }else if(tempMin > 10 && tempSec < 10){
            timerBox.textContent = `${tempMin}:0${tempSec}`;
        }else if(tempMin < 10 && tempSec > 10){
            timerBox.textContent = `0${tempMin}:${tempSec}`;
        }
    }, 1000);
}

cronometer();

function getCellPressed() {
    mainTableSudoku.addEventListener("click", function(event) {
        if (event.target.tagName === 'TD') {
            currentCell = [event.target.parentElement.rowIndex, event.target.cellIndex];
            console.log("Selected cell:", currentCell);
            for(let i = 0; i < 9; i++){
                for(let j = 0; j < 9; j++){
                    mainTableSudoku.rows[i].cells[j].style.backgroundColor = "transparent";
                }
            }
            for(let i = 0; i < 9; i++){
                mainTableSudoku.rows[i].cells[currentCell[1]].style.backgroundColor = "#ffffff65";            
                mainTableSudoku.rows[currentCell[0]].cells[i].style.backgroundColor = "#ffffff65";
            }
            mainTableSudoku.rows[currentCell[0]].cells[currentCell[1]].style.backgroundColor = "#93e0ffa9";
        }
    });
}

// function getCellPressed(){
//     mainTableSudoku.addEventListener("click", function(event){
//         if(event.target.tagName === 'TD'){
//             const rowIndex = event.target.parentElement.rowIndex;
//             const colIndex = event.target.cellIndex;
//             currentCell = [rowIndex, colIndex];
//             for(let i = 0; i < 9; i++){
//                 for(let j = 0; j < 9; j++){
//                     mainTableSudoku.rows[i].cells[j].style.backgroundColor = "transparent";
//                 }
//             }
//             for(let i = 0; i < 9; i++){
//                 mainTableSudoku.rows[i].cells[colIndex].style.backgroundColor = "#ffffff65";            
//                 mainTableSudoku.rows[rowIndex].cells[i].style.backgroundColor = "#ffffff65";
//             }
//             mainTableSudoku.rows[rowIndex].cells[colIndex].style.backgroundColor = "#93e0ffa9";
//         }
//     });
// }





// function solveSudoku(puzzle){
//     let [row, col] = findNextEmptyCell(puzzle); 
//     if(row === null)
//         return true;

//     for(let guess = 1; guess < 10; guess++){
//         if(isValid(puzzle, guess, row, col)){
//             puzzle[row][col] = guess;
//             if(solveSudoku(puzzle)){
//                 return true;    
//             }
//         }
//         puzzle[row][col] = 0;

//     }
//     return false;
// }

// if(solveSudoku(solvedSudoku)){
//     console.log("Solved Sudoku : ");
//     console.log(solvedSudoku);
// }else{
//     console.log("No solution found");
// }

    









// function generateTable(){

//     function createColumn(y) {
//         return completeTable.map(row => row[y]);
//     }

//     function isValid(x, y, num) {
//         let column = createColumn(y);
//         let rowValid = !completeTable[x].includes(num);
//         let colValid = !column.includes(num);
//         let subGridValid = true;

//         let startX = Math.floor(x / 3) * 3;
//         let startY = Math.floor(y / 3) * 3;

//         for (let i = startX; i < startX + 3; i++) {
//             for (let j = startY; j < startY + 3; j++) {
//                 if (completeTable[i][j] === num) subGridValid = false;
//             }
//         }

//         return rowValid && colValid && subGridValid;
//     }

//     function fillTable(index) {
//         if (index === emptyCells.length) {
//             return true; // Base case: all cells filled
//         }

//         const { i, j } = emptyCells[index]; // Current cell to process

//         for (let num = 1; num <= 9; num++) {
//             if (isValid(i, j, num)) {
//                 completeTable[i][j] = num; // Place the number

//                 if (fillTable(index + 1)) {
//                     return true; // Recursive call for the next cell
//                 }

//                 completeTable[i][j] = 0; // Backtrack
//             }
//         }

//         return false; // No valid number for this cell
//     }

//     // Collect all empty cells
//     let emptyCells = [];
//     for (let i = 0; i < 9; i++) {
//         for (let j = 0; j < 9; j++) {
//             emptyCells.push({ i, j });
//         }
//     }

//     fillTable(0);

//     function displayTable() {
//         console.log(completeTable);
//     }

//     displayTable();
//     return completeTable;
// }