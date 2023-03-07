const startButton = document.querySelector("#start");
const gamePanel = document.querySelector(".game");

startButton.addEventListener("click", start);

let rows, cols, board, bombs, neighbours, visited, markers, markersBoard;

const place = document.querySelector(".containerF");
const counter = document.createElement("div");
counter.setAttribute("class", "counter");
place.append(counter);

function start() {
    cols = parseInt(document.querySelector("#cols").value);
    rows = parseInt(document.querySelector("#rows").value);

    if (cols >= 10 && cols <= 30 && rows >= 10 && rows <= 20) {
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
        markers = parseInt(bombs);

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

        markersBoard = new Array(rows);

        for (let i = 0; i < rows; i++) {
            markersBoard[i] = new Array(cols);

            for (let j = 0; j < cols; j++) {
                markersBoard[i][j] = 0;
            }
        }

        counter.innerHTML = 'Markers left: <span id="left"></span>';
        document.querySelector(".counter #left").innerHTML = markers;
    } else {
        gamePanel.innerHTML = "Enter board data from the allowed ranges. <br> 10 <= rows <= 20 <br> 10 <= columns <= 30";
        counter.innerHTML = '';
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
                        if (!(ii >= rows || ii < 0 || jj >= cols || jj < 0)) {
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

            cell.addEventListener("contextmenu", marking);
        }
    }

    exploring(x, y);
}

function marking(cm) {
    cm.preventDefault();

    let id = this.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    let cell = document.querySelector("#coord" + x + "-" + y);

    if (visited[x][y] != 1) {
        if (markers > 0) {

            markers--;
            document.querySelector(".counter #left").innerHTML = markers;

            const flag = document.createElement("img");
            flag.setAttribute("src", "img/marker.png");
            flag.setAttribute("alt", "Marker.");
            flag.setAttribute("style", "height: 90%");
            flag.setAttribute("id", "fcoord" + x + "-" + y);
            cell.append(flag);

            markersBoard[x][y] = 1;

            cell.removeEventListener("contextmenu", marking);
            cell.addEventListener("contextmenu", unmarking);
        }
    }

    if (markers==0) {

        let win = true;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (markersBoard[i][j]!=board[i][j]) win = false;
            }
        }

        if (win) victory();
    }
}

function unmarking(cm) {
    cm.preventDefault();

    let id = this.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    let cell = document.querySelector("#coord" + x + "-" + y);

    markers++;
    document.querySelector(".counter #left").innerHTML = markers;

    cell.innerHTML = "";

    markersBoard[x][y] = 0;
    visited[x][y] = 0;

    cell.removeEventListener("contextmenu", unmarking);
    cell.addEventListener("contextmenu", marking);
}

function checking() {
    let id = event.target.id;
    let coords = id.split("d");
    coords = coords[1].split("-");
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    if (board[x][y] == 1 && visited[x][y] != 1) {
        const audio = new Audio("sounds/explosion.mp3");
        audio.play();
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

            if (board[i][j] == 1 && markersBoard[i][j]==0) {
                let image = document.createElement("img");
                image.setAttribute("src", "img/bomb.png");
                image.setAttribute("alt", "Bomb.");
                image.setAttribute("style", "width:90%");
                cell.append(image);
            }

            if (markersBoard[i][j]==1 && board[i][j]==1) {
                const flag = cell.querySelector("img");
                flag.setAttribute("src", "img/goodMarker.png");
            }

            cell.removeEventListener("click", checking);
            cell.removeEventListener("contextmenu", marking);
            cell.removeEventListener("contextmenu", unmarking);
        }
    }
}

function victory() {

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j]!=1 && visited[i][j]!=1) exploring(i, j);
        }
    }


    const confetti = document.createElement("script");
    confetti.setAttribute("src", "js/confetti.js");
    gamePanel.append(confetti);

    setTimeout(function() {
        const script = document.querySelector("#tsparticles");
        document.querySelector("body").removeChild(script);
    }, 5000);
}

function exploring(x, y) {
    if (board[x][y] == 1 || visited[x][y] == 1 || x < 0 || y < 0 || x >= rows || y >= cols) return;

    visited[x][y] = 1;

    animationWithout(x, y);

    if (neighbours[x][y] == 0) {
        if (x < rows - 1 && visited[x + 1][y] != 1) exploring(x + 1, y);
        if (x > 0 && visited[x - 1][y] != 1) exploring(x - 1, y);
        if (y < cols - 1 && visited[x][y + 1] != 1) exploring(x, y + 1);
        if (y > 0 && visited[x][y - 1] != 1) exploring(x, y - 1);
        if (x < rows - 1 && y > 0 && visited[x + 1][y - 1] != 1) exploring(x + 1, y - 1);
        if (x < rows - 1 && y < cols - 1 && visited[x + 1][y + 1] != 1) exploring(x + 1, y + 1);
        if (x > 0 && y > 0 && visited[x - 1][y - 1] != 1) exploring(x - 1, y - 1);
        if (x > 0 && y < cols - 1 && visited[x - 1][y + 1] != 1) exploring(x - 1, y + 1);
    }

    let cell = document.querySelector("#coord" + x + "-" + y);
    if (visited[x][y] == 0) cell.removeEventListener("click", checking);

    if (markersBoard[x][y]==1) {
        markersBoard[x][y]=0;
        markers++;
        cell.innerHTML = "";
        document.querySelector(".counter #left").innerHTML = markers;
    }
}

function animationWithout(x, y) {

    let cell = document.querySelector("#coord" + x + "-" + y);
    if (neighbours[x][y] > 0) {

        switch (parseInt(neighbours[x][y])) {
            case 1:
                cell.style.cssText = "color: #4682B4";
                break;
            case 2:
                cell.style.cssText = "color: #28B766";
                break;
            case 3:
                cell.style.cssText = "color: #00DA24";
                break;
            case 4:
                cell.style.cssText = "color: #48FF00";
                break;
            case 5:
                cell.style.cssText = "color: #B6FF00";
                break;
            case 6:
                cell.style.cssText = "color: #FFDA00";
                break;
            case 7:
                cell.style.cssText = "color: #FF6D00";
                break;
            case 8:
                cell.style.cssText = "color: #FF0000";
                break;
        }

        cell.style.cssText += "font-weight: 700";
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