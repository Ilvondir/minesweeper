const startButton = document.querySelector("#start");
const gamePanel = document.querySelector(".game");

startButton.addEventListener("click", start);

let rows;
let cols;
let board;
let bombs;

function start() {
    cols = document.querySelector("#cols").value;
    rows = document.querySelector("#rows").value;
    bombs = document.querySelector("#bombs").value;

    gamePanel.innerHTML = "";

    board = new Array(rows);

    for (let i=0;i<rows;i++) {
        board[i] = new Array(cols);

        for (let j=0;j<cols;j++) {
            board[i][j] = 0;
        }
    }

    for (let i=0; i<bombs; i++) {

        let x = Math.floor(Math.random()*rows);
        let y = Math.floor(Math.random()*cols);
        let again = false;

        do {
            x = Math.floor(Math.random()*rows);
            y = Math.floor(Math.random()*cols);

            if (board[x][y] != 1) {
                board[x][y]=1;
                again = false;
            } else again = true;
        } while (again)
    }

    for (let i=0;i<rows;i++) {

        const row = document.createElement("div");
        row.setAttribute("class", "row");
        gamePanel.append(row);

        for (let j=0;j<cols;j++) {
            
            let id = "coord" + i + "-" + j;
            
            const cell = document.createElement("div");
            cell.setAttribute("id", id);
            cell.setAttribute("class", "cell");
            
            if (board[i][j]==1) cell.setAttribute("style", "background: red");

            row.append(cell)

        }
    }
}