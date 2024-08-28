
const MAX_X = 50;
const MAX_Y = 50;
const CELL_SIZE = 10;
const WIDTH_PIXELS = MAX_X * CELL_SIZE;
const HEIGHT_PIXELS = MAX_Y * CELL_SIZE;

const dia = Math.sqrt(2);
const orth = 1.0;

const NodeState = Object.freeze({
    UNVISITED: 0,
    VISITED: 1,
    BLOCKED: 2,
    DESTINATION: 3
})
const nodes = [];


class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dist = Infinity;
        this.prev = null;
        this.node_state = NodeState.UNVISITED;
    }
    get_unvisited_neighbours() {
        let ret = [];
        if (this.x > 0 && this.is_reachable(nodes[this.x - 1][this.y])) ret.push([nodes[this.x - 1][this.y], orth]);
        if (this.x < MAX_X - 1 && this.is_reachable(nodes[this.x + 1][this.y])) ret.push([nodes[this.x + 1][this.y], orth]);
        if (this.y > 0 && this.is_reachable(nodes[this.x][this.y - 1])) ret.push([nodes[this.x][this.y - 1], orth]);
        if (this.y < MAX_Y - 1 && this.is_reachable(nodes[this.x][this.y + 1])) ret.push([nodes[this.x][this.y + 1], orth]);

        if (this.x > 0 && this.y > 0 && this.is_reachable(nodes[this.x - 1][this.y - 1])) ret.push([nodes[this.x - 1][this.y - 1], dia]);
        if (this.x > 0 && this.y < MAX_Y - 1 && this.is_reachable(nodes[this.x - 1][this.y + 1])) ret.push([nodes[this.x - 1][this.y + 1], dia]);
        if (this.x < MAX_X - 1 && this.y > 0 && this.is_reachable(nodes[this.x + 1][this.y - 1])) ret.push([nodes[this.x + 1][this.y - 1], dia]);
        if (this.x < MAX_X - 1 && this.y < MAX_Y - 1 && this.is_reachable(nodes[this.x + 1][this.y + 1])) ret.push([nodes[this.x + 1][this.y + 1], dia]);

        return ret;
    }
    is_reachable(node) {
        return node.node_state == NodeState.UNVISITED || node.node_state == NodeState.DESTINATION;
    }
}

function mouse_move(e) {
    e.stopPropagation()
    let x = Math.floor(e.offsetX / CELL_SIZE);
    let y = Math.floor(e.offsetY / CELL_SIZE);
    let node = nodes[x][y];
    if (node.node_state==NodeState.VISITED || node.node_state==NodeState.DESTINATION)
        return;
    if (e.buttons == 1) {
        if (e.shiftKey) {
            if (node.node_state == NodeState.BLOCKED)
                node.node_state = NodeState.UNVISITED;
        }
        else {
            if (node.node_state == NodeState.UNVISITED)
                node.node_state = NodeState.BLOCKED;
        }
        draw_cells();
    }
}

function mouse_click(e) {
    e.stopPropagation()
    let x = Math.floor(e.offsetX / CELL_SIZE);
    let y = Math.floor(e.offsetY / CELL_SIZE);
    let node = nodes[x][y];
    if (e.shiftKey) {
        if (node.node_state == NodeState.BLOCKED)
            node.node_state = NodeState.UNVISITED;
    }
    else if (e.ctrlKey && (node.node_state == NodeState.UNVISITED || node.node_state == NodeState.VISITED )) {
        nodes.forEach((row) => { row.forEach((cell) => { if (cell.node_state == NodeState.DESTINATION) cell.node_state=NodeState.UNVISITED; }) });
        node.node_state = NodeState.DESTINATION;
        reset_unvisited();
        draw_cells()
    }
    else {
        if (node.node_state == NodeState.UNVISITED)
            node.node_state = NodeState.BLOCKED;
    }
    draw_cells();
}

function draw_background() {
    const canvas = document.getElementById("map");

    const ctx = canvas.getContext("2d");

    const w = WIDTH_PIXELS;
    const h = HEIGHT_PIXELS;

    for (let i = 0; i <= w; i += CELL_SIZE) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
    }

    for (let j = 0; j <= h; j += CELL_SIZE) {
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
    }


}

function draw_current_shortest_route(current) {

    const route = document.getElementById("route");
    const route_ctx = route.getContext("2d");

    route_ctx.clearRect(0, 0, route.width, route.height);

    route_ctx.beginPath();
    route_ctx.strokeStyle = "yellow";
    route_ctx.moveTo((current.x + 0.5) * CELL_SIZE, (current.y + 0.5) * CELL_SIZE);
    let prev = current.prev;
    while (prev) {
        route_ctx.lineTo((prev.x + 0.5) * CELL_SIZE, (prev.y + 0.5) * CELL_SIZE);
        prev = prev.prev;
    }
    route_ctx.stroke();
    route_ctx.closePath();
}

function draw_cells() {
    const cell = document.getElementById("cells");


    const cell_ctx = cell.getContext("2d");

    nodes.forEach((n) => {
        n.forEach((n) => {
            if (n.node_state == NodeState.DESTINATION) {
                cell_ctx.fillStyle = "yellow";
            }
            else if (n.node_state == NodeState.BLOCKED) {
                cell_ctx.fillStyle = "black";
            }
            else if (n.node_state == NodeState.VISITED) {
                cell_ctx.fillStyle = "green";
            }
            else {
                cell_ctx.fillStyle = "white";
            }
            cell_ctx.fillRect(CELL_SIZE * n.x + 1, CELL_SIZE * n.y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        })
    });

}

function run() {
    solve_path(current);
}

function reset_route() {

    nodes.forEach((row) => { row.forEach((cell) => { 
        cell.dist = Infinity; 
        if (cell.node_state == NodeState.VISITED)
            cell.node_state = NodeState.UNVISITED;
    }) });
    nodes[0][0].dist = 0;
    nodes[0][0].node_state = NodeState.VISITED;

    reset_unvisited();

    current = nodes[0][0];
    draw_cells();
    draw_current_shortest_route(current);

}

function reset_unvisited() {
    nodes.forEach((row) => { 
        row.filter((node) => node.node_state==NodeState.UNVISITED || node.node_state==NodeState.DESTINATION)
        .forEach((node) => unvisited.push(node)) 
    });
}

function reset_map() {
    nodes.forEach((row) => { row.forEach((cell) => { 
        cell.dist = Infinity; cell.node_state = NodeState.UNVISITED}) }
    );
    nodes[MAX_X-1][MAX_Y-1].node_state = NodeState.DESTINATION;
    reset_route();
}

function solve_path(current) {
    if (current) {
        current = dijkstra(current);
        if (current && current.dist < Infinity) {
            draw_cells();
            draw_current_shortest_route(current);
            if (current.node_state != NodeState.DESTINATION)
                window.requestAnimationFrame(() => solve_path(current));
        }
    }
}
//
// One iteration of Dijkstra's algorithm
// 
// The "current" node is the "unvisited" node that has the shortest distance from where we started. In this iteration,
// the task is to find each neighbour which has not been visited yet and if this path is shorter
// than any found before:
//   - update its new distance from the destination
//   - assign its prev field to point back to "current" (This allows the optimal path to be traced all the way back to the start)
// The "current" node is marked as "visited" so that it won't be visited again
// The remaining unvisited nodes are sorted in order of their distances from the start, and the one with the shortest distance is
// selected for the next iteration.
//
function dijkstra(current) {
    current.node_state = NodeState.VISITED;
    let neighbours = current.get_unvisited_neighbours();
    neighbours.forEach((n) => {
        if (n[0].dist >= current.dist + n[1]) {
            n[0].dist = current.dist + n[1];
            n[0].prev = current;
        }
    });
    unvisited.sort((a, b) => a.dist - b.dist);
    console.log("num unvisited=" + unvisited.length + "current=" + current.x + ", " + current.y + ", " + current.dist + ", " + current.prev?.x + ", " + current.prev?.y);
    current = unvisited.shift();
    return current;
}

for (let x = 0; x < MAX_X; x++) {
    nodes.push([]);
    for (let y = 0; y < MAX_Y; y++) {
        nodes[x].push(new Node(x, y));
    }
}
nodes[MAX_X-1][MAX_Y-1].node_state = NodeState.DESTINATION;


const unvisited = [];

let current;

reset_route();

draw_background();
draw_cells();

const route = document.getElementById("route");
route.addEventListener("mousemove", mouse_move, false);
route.addEventListener("click", mouse_click, false);