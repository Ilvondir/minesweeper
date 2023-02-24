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
    
    let difficult = document.querySelector("#bombs").value;

    switch (difficult) {
        case "Łatwy":
            bombs = Math.floor(0.2*cols*rows);
            break;
        case "Średni":
            bombs = Math.floor(0.4*cols*rows);
            break;
        case "Trudny":
            bombs = Math.floor(0.6*cols*rows);
            break;
            
    }

    gamePanel.innerHTML = "";

    board = new Array(rows);

    for (let i=0;i<rows;i++) {
        board[i] = new Array(cols);

        for (let j=0;j<cols;j++) {
            board[i][j] = 0;
        }
    }

    drawBombs();

    for (let i=0;i<rows;i++) {

        const row = document.createElement("div");
        row.setAttribute("class", "row");
        gamePanel.append(row);

        for (let j=0;j<cols;j++) {
            
            let id = "coord" + i + "-" + j;
            
            const cell = document.createElement("div");
            cell.setAttribute("id", id);
            cell.setAttribute("class", "cell");
            cell.addEventListener("click", checking);
            
            if (board[i][j]==1) cell.setAttribute("style", "background: red");

            row.append(cell)

        }
    }
}

function drawBombs() {
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
}

function checking() {
    let id = event.target.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = coords[0];
    let y = coords[1];
    console.log("(" + x +  ", " + y + ")")
}