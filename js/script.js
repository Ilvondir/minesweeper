const startButton = document.querySelector("#start");
const gamePanel = document.querySelector(".game");

startButton.addEventListener("click", start);

function start() {
    let cols = document.querySelector("#cols").value;
    let rows = document.querySelector("#rows").value;

    let board = new Array(rows);

    for (let i=0;i<rows;i++) {
        board[i] = new Array(cols);

        for (let j=0;j<cols;j++) {
            board[i][j] = 0;
        }
    }

    for (let i=0;i<rows;i++) {

        const row = document.createElement("div");
        row.setAttribute("class", "row");
        gamePanel.append(row);

        for (let j=0;j<cols;j++) {
            
            let id = "coord" + (i+1) + "-" + (j+1);
            
            const cell = document.createElement("div");
            cell.setAttribute("id", id);
            cell.setAttribute("class", "cell");
            row.append(cell)

        }
        const breaking = document.createElement("br");
        gamePanel.append(breaking);
    }
}