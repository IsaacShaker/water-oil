// set up the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

// experiment
const gridWidth = 20;
const gridHeight = 20;

const wSkipSize = canvas.width / gridWidth;
const hSkipSize = canvas.height / gridHeight;

const numParticles = gridWidth * gridWidth;
//var particles = new Array(gridHeight).fill(new Array(gridWidth)); 
// the line above doesn't work because it is storing the same array in the matrix not new arrays
var particles = Array(gridHeight).fill().map(()=>Array(gridWidth).fill());
var checkerboard = Array(gridHeight).fill().map(()=>Array(gridWidth).fill());

const RADIUS = Math.floor(wSkipSize / 2) - 4;

// trail variables
const TRIALS = 200;
var rAvg = 0;

function fillCheckerboard(n) {
    var blue = true;

    for (let i = (hSkipSize / 2); i < canvas.height; i+=hSkipSize) {
        var row = (Math.floor((i / hSkipSize) + 0.5) - 1);
        // switch the color every "n" columns
        if (row % n == 0 && row != 0) blue = !blue;

        for (let j = (wSkipSize / 2); j < canvas.width; j+=wSkipSize) {
            var col = (Math.floor((j / wSkipSize) + 0.5) - 1);
            if (col % n == 0 && col != 0) blue = !blue;
            
            var curr = new Particle(j, i, row, col, RADIUS, blue ? "skyblue" : "yellow");
            checkerboard[row][col] = curr;
            //checkerboard[row][col].draw();
        }
    }
}

function drawGridLines() {
    ctx.strokeStyle = 'white';
    // draw horizontal lines
    for (let i = wSkipSize; i < canvas.width; i+=wSkipSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.closePath();
    }

    // draw vertical lines
    for (let j = hSkipSize; j < canvas.height; j+=hSkipSize) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
        ctx.closePath();
    }
}

function populateGrid() {
    // go to each spot on the grid and randomly pick between blue and yellow particle
    var blueCount = 0;
    var yellowCount = 0;

    for (let i = (wSkipSize / 2); i < canvas.width; i+=wSkipSize) {
        var col = (Math.floor((i / wSkipSize) + 0.5) - 1);
        for (let j = (hSkipSize / 2); j < canvas.height; j+=hSkipSize) {
            var row = (Math.floor((j / hSkipSize) + 0.5) - 1);
            var randomc = getRndInt(0,1);
            
            if (blueCount >= (gridHeight*gridWidth)/2){
                randomc = 1;
            }
            else if (yellowCount >= (gridHeight*gridWidth)/2) {
                randomc = 0;
            }

            particles[row][col] = new Particle(i, j, row, col, RADIUS, COLORS[randomc]);
            particles[row][col].draw();

            if (randomc == 0) blueCount++;
            else if (randomc == 1) yellowCount++;
        }
    }

    console.log("blue " + blueCount);
    console.log("yellow " + yellowCount);
}

drawGridLines();
fillCheckerboard(4);
populateGrid();

function separate() {
    for (let i = 0; i < 2000; i++){
        var currPart = particles[getRndInt(0, (gridHeight - 1))][getRndInt(0, (gridWidth - 1))];
        currPart.swap(particles, checkerboard);
    }
}

function getR(particles) {
    var R = 0;
    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth - 1; j++) {
            var color1 = particles[i][j].color;
            var color2 = particles[i][j + 1].color;

            if (color1 != color2) {
                R++;
            }
        }
    }

    for (let l = 0; l < gridWidth; l++) {
        for (let m = 0; m < gridHeight - 1; m++) {
            var color1 = particles[m][l].color;
            var color2 = particles[m + 1][l].color;

            if (color1 != color2) {
                R++;
            }
        }
    }

    return R;
}

function separateV2(i) {
    for (let j = 0; j < 5000; j++) {
        var RPrev = 1;
        var R = 1;
        var RChange = 100;

        // keep doing swaps until swaps change the simulation INSIGNIFICANTLY (run until small changes, to the model, occur)
        while (RChange > 0.01 ) {
            RPrev = R;
            separate();

            R = getR(particles);

            RChange = (Math.abs(RPrev - R) * 100) / RPrev; // percent change
            //console.log(RChange);
        }
    }
    //console.log(i + "," + R);
    return R;
}

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // override all the particles and place new ones down
    populateGrid();
}


// this is the simulation
function runSim() {
    for (let i = 0; i < TRIALS; i++) {
        reset();
        rAvg += separateV2(i);
    }

    rAvg = rAvg / TRIALS;
    console.log("R Average: " + rAvg);
}
