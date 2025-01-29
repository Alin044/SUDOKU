const mainTableSudoku = document.querySelector('#mainTableSudoku');
mainTableSudoku.style.borderCollapse = 'collapse';


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
        this.completeTableSudoku = [];
        this.mistakes = mistakes;
        this.startTime = new Date(); 
        this.finalDate = null;
        this.totalTime = null;
    }

    addTable(table){
        if(Array.isArray(table) && table.every(row => Array.isArray(row))){
            this.completeTableSudoku.push(table);
        }else{
            console.log("invalid Sudoku table format.");
        }
    }
};

let sudokuTables = [];
function addTableSudoku(tb){
    sudokuTables.unshift(tb)
}

function generateTable(){
    let completeTable = new Array(9).fill(null).map(() => new Array(9).fill(0));
    
    function createColumn(x){
        let column = [];
        for(let i = 0; i < 9; i++){
            column.push(completeTable[i][x]);
        }
        return column;
    }

    function isValid(x, y, num){
        let column = generateColumn(y);

        let rowValid = !completeTable[x].includes(num);
        let colValid = !column.includes(num);
        let subGridValid = true; // 3 x 3 grid

        let startX = Math.floor(x / 3) * 3;
        let startY = Math.floor(y / 3) * 3;

        for(let i = startX; i < startX + 3; i++){
            for(let j = startY; j < startY + 3; j++){
                if(completeTable[i][j] === num) subGridValid = false;
            }
        }
        return rowValid && colValid && subGridValid;
    }

    function fillTable(){

        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(completeTable[i][j] === 0){
                    let attempts = 0;
                    let valid = false;

                    while(attempts < 9 && !valid){
                        let randNum = Math.floor(Math.random() * 9) + 1;
                        if(isValid(i, j, num)){
                            completeTable[i][j] = randNum;
                            valid = true;
                            if(fillTable()){
                                return true;
                            }
                            completeTable[i][j] = 0;
                        }
                        attempts++;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // function isValid(x, y, num){
    //     let column = createColumn(y);
    //     if( completeTable[x].includes(num) || column.includes(num)){
    //         return false;
    //     }else{
    //         return true;
    //     }
    // }

    // function fillTable(){

    //     for(let i = 0; i < 9; i++){
    //         for(let j = 0; j < 9; j++){
    //             let valid = false;
    //             let attemps = 0;
    //             do{
    //                 let randNum = Math.floor(Math.random() * 9) + 1;
    //                 if(isValid(i, j, randNum)){
    //                     completeTable[i][j] = randNum;
    //                     valid = true;
    //                 }
    //                 attemps++;
    //                 if(attemps > 100){
    //                     console.log("Failed to generate random number ! ");
    //                     return;
    //                 }
    //             }while(!valid);
    //         }
    //     }
    // }

    // fillTable();
    // displayTable();
    // function displayTable(){
    //     console.log(completeTable);
    // }

    // return completeTable;
}

generateTable();