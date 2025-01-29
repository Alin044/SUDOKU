const mainTableSudoku = document.querySelector('#mainTableSudoku');
mainTableSudoku.style.borderCollapse = 'collapse';

let completeTable = new Array(9).fill(null).map(() => Array(9).fill(0));    

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
        if( (j+1) % 3 === 0){
            newCell.style.borderRight = '2px solid white';
        }
        newRow.appendChild(newCell);
    }
    if((i+1) % 3 === 0){
        newRow.style.borderBottom = '2px solid white';
    }
}

class allSudokuTables{
    constructor(mistakes, totalTime){
        this.completeTableSudoku = new Array(9).fill(null).map(() => new Array(9).fill(0));
        this.gridToSolve = new Array(9).fill(null).map(() => new Array(9).fill(0));
        this.mistakes = mistakes;
        this.startTime = new Date(); 
        this.finalDate = null;
        this.totalTime = null;
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


function addTableSudoku(tb){
    sudokuTables.unshift(tb)
}

function generateTable(){

    function createColumn(y) {
        return completeTable.map(row => row[y]);
    }

    function isValid(x, y, num) {
        let column = createColumn(y);
        let rowValid = !completeTable[x].includes(num);
        let colValid = !column.includes(num);
        let subGridValid = true;

        let startX = Math.floor(x / 3) * 3;
        let startY = Math.floor(y / 3) * 3;

        for (let i = startX; i < startX + 3; i++) {
            for (let j = startY; j < startY + 3; j++) {
                if (completeTable[i][j] === num) subGridValid = false;
            }
        }

        return rowValid && colValid && subGridValid;
    }

    function fillTable(index) {
        if (index === emptyCells.length) {
            return true; // Base case: all cells filled
        }

        const { i, j } = emptyCells[index]; // Current cell to process

        for (let num = 1; num <= 9; num++) {
            if (isValid(i, j, num)) {
                completeTable[i][j] = num; // Place the number

                if (fillTable(index + 1)) {
                    return true; // Recursive call for the next cell
                }

                completeTable[i][j] = 0; // Backtrack
            }
        }

        return false; // No valid number for this cell
    }

    // Collect all empty cells
    let emptyCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            emptyCells.push({ i, j });
        }
    }

    fillTable(0);

    function displayTable() {
        console.log(completeTable);
    }

    displayTable();
    return completeTable;
}



currentSudokuTable.setGrid(generateTable());
currentSudokuTable.gridToSolve = currentSudokuTable.completeTableSudoku;


function eliminateCells(levelType){
    let temp = levelGame.levelCellsToRemove[levelType][1] - levelGame.levelCellsToRemove[levelType][0];
    let cellsToRemove = Math.floor(Math.random() * temp) + levelGame.levelCellsToRemove[levelType][0];
    for(let i = 0; i < cellsToRemove; i++){
        let attempts = 0;
        do{
            let randomX = Math.floor(Math.random() * 9);
            let randomY = Math.floor(Math.random() * 9);
            attempts++;
            if(currentSudokuTable.gridToSolve[randomX][randomY] !== 0){
                currentSudokuTable.gridToSolve[randomX][randomY] = 0;
                attempts = 100;
            }
        }while(attempts < 100);
    }
    console.log(currentSudokuTable.gridToSolve);
}

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