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
