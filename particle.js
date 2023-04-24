// particle class
const SWAP_BIAS = 99.99;
const COLORS = ['skyblue', 'yellow'];

class Particle{
    constructor(X, Y, Row, Col, Radius, Color) {
        this.x = X;
        this.y = Y;
        this.radius = Radius;
        this.color = Color;
        this.row = Row;
        this.col = Col;
    }

    draw() {
        // self explanitory
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // swaps the particle with a random particle if its in this particle's best interest
    swap(others, under) {
        var randParticle = others[getRndInt(0, (gridHeight - 1))][getRndInt(0, (gridWidth - 1))];

        if (randParticle.color == this.color) return;
        
        var similarities1 = surroundingParticles(this, others, under, this.color);
        var similarities2 = surroundingParticles(randParticle, others, under, this.color);

        var swap = false;
        if (similarities2 > similarities1) swap = true;

        // give chace for unfavorable moves
        if (getRndInt(1,10000) > (SWAP_BIAS * 100)) swap = !swap;

        if (swap == false) return;

        let tempColor = this.color;
        this.color = randParticle.color;
        randParticle.color = tempColor;

        randParticle.draw();
        this.draw();
    }
}

function getRndInt(min, max) {
    // self explanitory (min and max are inclusive)
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function surroundingParticles(Particle, Others, under, Color) {
    var similarities = 0;
    var row = Particle.row;
    var col = Particle.col;
    if (under[row][col].color == Color) similarities++;

    if ((row - 1) >= 0) {
        if (Others[row - 1][col].color == Color) similarities++;
    }

    if ((row + 1) < gridHeight) {
        if (Others[row + 1][col].color == Color) similarities++;
    }

    if ((col - 1) >= 0) {
        if (Others[row][col - 1].color == Color) similarities++;
    }

    if ((col + 1) < gridHeight) {
        if (Others[row][col + 1].color == Color) similarities++;
    }

    return similarities;
}