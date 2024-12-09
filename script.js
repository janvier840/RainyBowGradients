const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const generateBtn = document.getElementById("generateBtn");
const solveBtn = document.getElementById("solveBtn");
const sizeSlider = document.getElementById("sizeSlider");
const simplicitySlider = document.getElementById("simplicitySlider");

let maze = [];
let rows, cols;
let cellSize;
let start = { x: 0, y: 0 };
let end;

function createMaze(rows, cols) {
    maze = Array.from({ length: rows }, () => Array(cols).fill(false));
    let stack = [];
    let current = { x: 0, y: 0 };
    maze[0][0] = true;

    const directions = [
        { x: 0, y: -1 }, // up
        { x: 0, y: 1 },  // down
        { x: -1, y: 0 }, // left
        { x: 1, y: 0 },  // right
    ];

    do {
        const neighbors = directions
            .map(dir => ({ x: current.x + dir.x, y: current.y + dir.y }))
            .filter(n => n.x >= 0 && n.y >= 0 && n.x < cols && n.y < rows && !maze[n.y][n.x]);

        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(current);
            maze[next.y][next.x] = true;
            current = next;
        } else {
            current = stack.pop();
        }
    } while (stack.length > 0);

    end = { x: cols - 1, y: rows - 1 };
}

function drawMaze() {
    cellSize = canvas.width / cols;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize);

    ctx.fillStyle = "red";
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (!maze[y][x]) {
                ctx.fillStyle = "#999";
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function solveMaze() {
    const queue = [{ x: start.x, y: start.y, path: [] }];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[start.y][start.x] = true;

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();

        if (x === end.x && y === end.y) {
            drawPath(path.concat({ x, y }));
            return;
        }

        const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
        ];

        for (const dir of directions) {
            const nx = x + dir.x;
            const ny = y + dir.y;

            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && maze[ny][nx] && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, path: path.concat({ x, y }) });
            }
        }
    }
}

function drawPath(path) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = cellSize / 4;

    ctx.beginPath();
    ctx.moveTo(path[0].x * cellSize + cellSize / 2, path[0].y * cellSize + cellSize / 2);

    for (const point of path) {
        ctx.lineTo(point.x * cellSize + cellSize / 2, point.y * cellSize + cellSize / 2);
    }
    ctx.stroke();
}

function generateNewMaze() {
    rows = cols = sizeSlider.value;
    createMaze(rows, cols);
    drawMaze();
}

generateBtn.addEventListener("click", generateNewMaze);
solveBtn.addEventListener("click", solveMaze);

generateNewMaze();
