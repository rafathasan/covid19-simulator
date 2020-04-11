let infected = 0;

class Node {
    constructor(x, y, radius, canvas_width, canvas_height, infected, moveable = false, jitter = false, range = 0) {
        this.range = range;
        this.radius = radius;
        this.infected = infected;
        if (jitter) this.jitter = () => (Math.random() - 0.5) * range;
        else this.jitter = () => 0;
        this.moveable = moveable;
        this.x_bound = canvas_width;
        this.y_bound = canvas_height;
        this.x = x;
        this.y = y;
        this.x_velocity = 0;
        this.y_velocity = 0;
        if (this.moveable) {
            this.x_velocity = (Math.random() - 0.5) * 10;
            this.y_velocity = (Math.random() - 0.5) * 10;
        }

    }
    collision(nodes) {
        if (this.infected == false) return;
        nodes.forEach(node => {
            if (node.infected != this.infected) {
                var dist = Math.sqrt(((node.x - this.x) * (node.x - this.x)) + ((node.y - this.y) * (node.y - this.y)));
                if (dist < this.radius) {
                    node.infected = this.infected;
                    infected++;
                    return;
                }
            }
        });
    }
    move() {
        this.x += this.x_velocity;
        this.y += this.y_velocity;
        this.x_velocity = this.bounce(this.x, this.x_velocity, 0 + (this.radius / 2), this.x_bound - (this.radius / 2));
        this.y_velocity = this.bounce(this.y, this.y_velocity, 0 + (this.radius / 2), this.y_bound - (this.radius / 2));
    }
    bounce(pos, velocity, min, max) {
        if (pos < min || pos > max) velocity *= -1;
        return velocity;
    }
    draw() {
        if (this.infected) fill(color(255, 103, 97));
        else fill(color('white'));

        this.x += this.jitter();
        this.x = this.x < 0 ? 0 : this.x;
        this.x = this.x > this.canvas_width ? this.canvas_width : this.x;
        this.y += this.jitter();
        this.y = this.y < 0 ? 0 : this.y;
        this.y = this.y > this.canvas_height ? this.canvas_height : this.y;

        ellipse(
            this.x,
            this.y,
            this.radius,
            this.radius
        );
        fill(color('white'));
    }
}

let dims = {
    "width": window.innerWidth - 20,
    "height": window.innerHeight - 20
};
var nodes = [];

let radius = 10;
let radh = radius / 2;
let population = 2000;

function createNode() {
    nodes.push(new Node(
        mouseX,
        mouseY,
        radius,
        dims.width,
        dims.height,
        true,
        true,
        false,
        5
    ));
    infected++;
    population++;
}

var start_time;
var stop_time;
function setup() {
    let cnv = createCanvas(dims.width, dims.height);
    cnv.mousePressed(createNode);

    for (var i = 0; i < population; i++) {
        nodes.push(new Node(
            (Math.random() * (dims.width - radius)) + radh,
            (Math.random() * (dims.height - radius)) + radh,
            radius,
            dims.width,
            dims.height,
            false,
            true,
            false,
            5
        ));
    }
    // nodes.push(new Node( (Math.random()*(dims.width-radius))+radh,
    //  (Math.random()*(dims.height-radius))+radh,
    //   radius,
    //   dims.width,
    //    dims.height,
    //    false,
    //     true,
    //     true, 
    //     5
    //     ));
    start_time = millis();
}

function draw() {
    background(20);
    noStroke();
    nodes.forEach(node => {
        node.move();
        node.draw();
        node.collision(nodes);
    });
    if (population <= infected) text("Time: " + String(Math.round(stop_time - start_time)) + "ms", (dims.width / 2) - 30, dims.height / 2);
    else stop_time = millis();
    text("Infected: " + String(infected), dims.width - 100, dims.height - 20);
    text("Population: " + String(population), dims.width - 100, dims.height - 40);
}