const startButton = document.querySelector("#start");
const gamePanel = document.querySelector(".game");

startButton.addEventListener("click", start);

let rows, cols, board, bombs, neighbours, visited;

function start() {
    cols = parseInt(document.querySelector("#cols").value);
    rows = parseInt(document.querySelector("#rows").value);

    let difficult = document.querySelector("#bombs").value;

    visited = new Array(rows);

    for (let i = 0; i < rows; i++) {
        visited[i] = new Array(cols);

        for (let j = 0; j < cols; j++) {
            visited[i][j] = 0;
        }
    }

    switch (difficult) {
        case "Easy":
            bombs = Math.floor(0.1 * cols * rows);
            break;
        case "Medium":
            bombs = Math.floor(0.2 * cols * rows);
            break;
        case "Hard":
            bombs = Math.floor(0.3 * cols * rows);
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
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    drawBombs(x, y);

    neighbours = new Array(rows);

    for (let i = 0; i < rows; i++) {
        neighbours[i] = new Array(cols);

        for (let j = 0; j < cols; j++) {
            neighbours[i][j] = 0;
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let sum = 0;

            if (board[i][j] == 1) neighbours[i][j] = -1;
            else {
                for (let ii = i - 1; ii <= i + 1; ii++) {
                    for (let jj = j - 1; jj <= j + 1; jj++) {
                        if (!(ii>=rows || ii<0 || jj>=cols || jj<0)) {
                            if (board[ii][jj] == 1) sum++;
                        }
                    }
                }

                neighbours[i][j] = sum;
            }
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector("#coord" + i + "-" + j);
            cell.removeEventListener("click", firstClick);
            cell.addEventListener("click", checking);
        }
    }

    exploring(x, y);
}

function checking() {
    let id = event.target.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    if (board[x][y] == 1) {
        let cell = document.querySelector("#coord" + x + "-" + y);
        cell.style.cssText = "z-index: 1000";
        animationWith(x, y);
        end();
    }
    else exploring(x, y);

    let cell = document.querySelector("#coord" + x + "-" + y);
    cell.removeEventListener("click", checking);
}

function end() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

            let cell = document.querySelector("#coord" + i + "-" + j);
            
            if (board[i][j]==1) {
                let image = document.createElement("img");
                image.setAttribute("src", "img/bomb.png");
                image.setAttribute("alt", "Bomb.");
                image.setAttribute("style", "width:90%");
                cell.append(image);
            }

            cell.removeEventListener("click", checking);
        }
    }
}

function exploring(x, y) {
    if (board[x][y]==1 || visited[x][y]==1 || x<0 || y<0 || x>=rows || y>=cols) return;

    visited[x][y]=1;

    animationWithout(x, y);

    if (neighbours[x][y]==0) {
        if (x<rows-1) exploring(x+1, y);
        if (x>0) exploring(x-1, y);
        if (y<cols-1) exploring(x, y+1);
        if (y>0) exploring(x, y-1);
        if (x<rows-1 && y>0) exploring(x+1, y-1);
        if (x<rows-1 && y<cols-1) exploring(x+1, y+1);
        if (x>0 && y>0) exploring(x-1, y-1);
        if (x>0 && y<cols-1) exploring(x-1, y+1);
    }

    let cell = document.querySelector("#coord" + x + "-" + y);
    if (visited[x][y]==0) cell.removeEventListener("click", checking);
}

function animationWithout(x, y) {

    let cell = document.querySelector("#coord" + x + "-" + y);
    if (neighbours[x][y]>0) {
        cell.style.cssText = "color: red; font-weight: 700";
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