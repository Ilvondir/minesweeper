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
            bombs = Math.floor(0.2 * cols * rows);
            break;
        case "Średni":
            bombs = Math.floor(0.35 * cols * rows);
            break;
        case "Trudny":
            bombs = Math.floor(0.5 * cols * rows);
            break;

    }

    gamePanel.innerHTML = "";

    board = new Array(rows);

    for (let i = 0; i < rows; i++) {
        board[i] = new Array(cols);

        for (let j = 0; j < cols; j++) {
            board[i][j] = 0;
        }
    }

    for (let i = 0; i < rows; i++) {

        const row = document.createElement("div");
        row.setAttribute("class", "row");
        gamePanel.append(row);

        for (let j = 0; j < cols; j++) {

            let id = "coord" + i + "-" + j;

            const cell = document.createElement("div");
            cell.setAttribute("id", id);
            cell.setAttribute("class", "cell");
            cell.addEventListener("click", firstClick);

            row.append(cell)

        }
    }
}

function drawBombs(xClick, yClick) {
    for (let i = 0; i < bombs; i++) {

        let x = Math.floor(Math.random() * rows);
        let y = Math.floor(Math.random() * cols);
        let again = false;

        do {
            do {
                x = Math.floor(Math.random() * rows);
                y = Math.floor(Math.random() * cols);
            } while (xClick == x && yClick == y);

            if (board[x][y] != 1) {
                board[x][y] = 1;
                again = false;
            } else again = true;
        } while (again)
    }
}

function firstClick() {
    let id = event.target.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = coords[0];
    let y = coords[1];

    drawBombs(x, y);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let cell = document.querySelector("#coord" + j + "-" + i);
            cell.removeEventListener("click", firstClick);
            cell.addEventListener("click", checking);
        }
    }

    if (board[x][y] == 1) animatingWith(x, y);
    else animatingWithout(x, y);
}

function checking() {
    let id = event.target.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = coords[0];
    let y = coords[1];

    if (board[x][y] == 1) animatingWith(x, y);
    else animatingWithout(x, y);
    
}

function animatingWithout(x, y) {
    anime({
        targets: "#coord" + x + "-" + y,
        rotateY: 180,
        backgroundColor: "rgb(240,240,240)",
        easing: "linear",
        duration: 300
    })
}

function animatingWith(x, y) {
    anime({
        targets: "#coord" + x + "-" + y,
        backgroundColor: {
            value: "rgb(255,0,0)",
            duration: 0,
        },
        scale: [1, 30, 1],
        opacity: [1, 0.1, 0.1, 0.1, 1],
        easing: "linear",
        duration: 400
    })
}