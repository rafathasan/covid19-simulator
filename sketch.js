let infected = 0;
let speed = 1;
let radius = 5;

class Node {
    constructor(x, y, radius, canvas_width, canvas_height, infected = false, moveable = true, quarantine = false, infectedMoveable = true) {
        this.radius = radius;
        this.infected = infected;
        this.moveable = moveable;
        this.quarantine = quarantine;
        this.x_bound = canvas_width;
        this.y_bound = canvas_height;
        this.infectedMoveable = infectedMoveable;
        this.x = x;
        this.y = y;
        this.x_velocity = 0;
        this.y_velocity = 0;
        if (this.moveable || (infectedMoveable && infected) ) {
            this.x_velocity = (Math.random() - 0.5) * speed;
            this.y_velocity = (Math.random() - 0.5) * speed;
        }

    }
    collision(nodes) {
        
        if (this.infected == false){
            nodes.forEach(node => {
                if (node.infected != this.infected) {
                    var dist = Math.sqrt(((node.x - this.x) * (node.x - this.x)) + ((node.y - this.y) * (node.y - this.y)));
                    if (dist < (this.radius + node.radius) / 2) {
                        this.infected = node.infected;
                        infected++;
                        return 0;
                    }
                }
            });
        }
    }
    move() {
        if(this.quarantine){
            if(this.infected ){
                return 0;
            }
        }
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
    "height": window.innerHeight - (20 + 20)
};

var nodes = [];

////////////////////////
let radh = radius / 2;/////////////////
let population = 1000;/////////////////

function randx() {
    return (Math.random() * (dims.width - radius)) + radh;
}

function randy() {
    return (Math.random() * (dims.height - radius)) + radh;
}

var usecase = [
    { title: "Usual", x: randx, y: randy, infected: false, moveable: true, quarantine: false, infectedMoveable: true },
    { title: "Isolation", x: randx, y: randy, infected: false, moveable: true, quarantine: true, infectedMoveable: true },
    { title: "Usual/Quarantine", x: randx, y: randy, infected: false, moveable: false, quarantine: true, infectedMoveable: false }
];


var start_time;
var stop_time;


function createNode() {
    
    var sel = document.getElementById("usecase");
    var caseid = sel.options[sel.selectedIndex].value;
    
    speed = document.getElementById('speed').value;
    //radius = document.getElementById('radius').value;
    //radh = radius / 2;
    

    nodes = [];

    population = document.getElementById('population').value;

    for (var i = 0; i < population; i++) {
        nodes.push(new Node(
            usecase[caseid].x(),
            usecase[caseid].y(),
            radius,
            dims.width,
            dims.height,
            usecase[caseid].infected,
            usecase[caseid].moveable,
            usecase[caseid].quarantine,
        ));
    }

    nodes.push(new Node(
        (Math.random() * (dims.width - radius)) + radh,
        (Math.random() * (dims.height - radius)) + radh,
        radius,
        dims.width,
        dims.height,
        true,
        usecase[caseid].moveable,
        usecase[caseid].infectedMoveable,
    ));
    infected = 1;
    population++;

    start_time = millis();
}

function setup() {
    let cnv = createCanvas(dims.width, dims.height);
    //cnv.mousePressed(createNode);
    createNode();
}

// var x1 = 10;
// var x2 = 50;
// var y1 = 0;
// var y2 = 500;

var graph = [];

// var col1 = 100;
// var col2 = 100;
// var col3 = 100;
function draw() {
    background(20);
    noStroke();
    nodes.forEach(node => {
        node.move();
        node.draw();
        node.collision(nodes);
    });

    fill(color('white'));
    if (population <= infected) text("Time: " + String(Math.round(stop_time - start_time)) + "ms", (dims.width / 2) - 30, dims.height / 2);
    else stop_time = millis();
    text("Infected: " + String(infected), dims.width - 100, dims.height - 20);
    text("Population: " + String(population), dims.width - 100, dims.height - 40);
    text("https://github.com/rafathasan/covid19-simulator" , dims.width - 260, dims.height - 10);

    // stroke(x2,col2, col3);

    // x2 = mouseY;
    // if(x2 > 50) x2 = 50;
    // line(y1, x1, y1, x2);
    // y1++;

}
