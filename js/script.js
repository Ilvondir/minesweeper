const startButton = document.querySelector("#start");
const gamePanel = document.querySelector(".game");

startButton.addEventListener("click", start);

let rows, cols, board, bombs;
let neighbours;

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

    neighbours = new Array(rows);

    for (let i = 0; i < rows; i++) {
        neighbours[i] = new Array(cols);

        for (let j = 0; j < cols; j++) {
            neighbours[i][j] = 0;
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let sum = 0;

            if (board[i][j] == 1) neighbours[i][j] = -1;
            else {
                for (let ii = i - 1; ii <= i + 1; ii++) {
                    for (let jj = j - 1; jj <= j + 1; jj++) {
                        if (ii>=cols || ii<0 || jj>=rows || jj<0) {
                        } else if (board[ii][jj] == 1) sum++;
                    }
                }

                neighbours[i][j] = sum;
            }
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let cell = document.querySelector("#coord" + j + "-" + i);
            cell.removeEventListener("click", firstClick);
            cell.addEventListener("click", checking);
        }
    }

    animationWithout(x, y);
}

function checking() {
    let id = event.target.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = coords[0];
    let y = coords[1];

    if (board[x][y] == 1) {
        let cell = document.querySelector("#coord" + x + "-" + y);
        cell.style.cssText = "z-index: 1000";
        animationWith(x, y);
        end();
    }
    else animationWithout(x, y);

    let cell = document.querySelector("#coord" + x + "-" + y);
    cell.removeEventListener("click", checking);
}

function end() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let cell = document.querySelector("#coord" + j + "-" + i);
            cell.removeEventListener("click", checking);
        }
    }
}

function animationWithout(x, y) {

    let cell = document.querySelector("#coord" + x + "-" + y);
    if (neighbours[x][y]>0) {
        cell.style.cssText = "color: red; font-weight: 700"
        cell.innerHTML = neighbours[x][y];
    }

    anime({
        targets: "#coord" + x + "-" + y,
        rotateY: 360,
        backgroundColor: "rgb(240,240,240)",
        easing: "linear",
        duration: 300
    })
}

function animationWith(x, y) {
    anime({
        targets: "#coord" + x + "-" + y,
        backgroundColor: {
            value: "rgb(255,0,0)",
            duration: 0,
        },
        scale: [1, 30],
        opacity: [1, 0],
        easing: "linear",
        duration: 500,
        complete: function () {
            anime({
                targets: "#coord" + x + "-" + y,
                backgroundColor: "rgb(255,0,0)",
                scale: 1,
                opacity: 1,
                easing: "linear",
                duration: 0
            })
        }
    })
}