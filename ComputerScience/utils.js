/**
 * Primitive operations needed by Sorting algorithms
 * 
 * doSwap
 * doRotate
 * 
 */

let sourcedata = [];

let datastore = []; // data to be sorted
let elemIds = [];
let datastore_size = 10;

function doSwap(i,j) {

    // must record animation first before changing datastore.
    animateSwap(i, j); // TODO replace with empty mock for unit testing
    
    let tmp = datastore[i];
    datastore[i] = datastore[j];
    datastore[j] = tmp;
    tmp = elemIds[i];
    elemIds[i] = elemIds[j];
    elemIds[j] = tmp;
}

function doRotate(destination,source) {

    // must record animation first before changing datastore.
    animateRotate(destination, source);  // TODO replace with empty mock for unit testing

    if (destination===source)
        return;

    dir = destination<source ? -1 : +1;

    let tempd = datastore[source];
    let tempe = elemIds[source];
    for (;dir*destination>dir*source;source+=dir) {
        datastore[source] = datastore[source+dir];
        elemIds[source] = elemIds[source+dir];
    }
    datastore[destination] = tempd;
    elemIds[destination] = tempe;
}

function generateSourceData(size) {
    sourcedata = [];
    while(size > 0) {
        sourcedata.push(Math.floor(Math.random()*100));
        // for debugging
        // sourcedata.push((sourcedata.length+1*13)%5);
        size--;
    }
}
function populateDatastore(size) {
    datastore = [...sourcedata];
    elemIds = datastore.map((_,k) => elemId(k));
}

function elemId(i) {return `elem${i}`;}

/**
 * Animation utils
 */

const TIME_DELTA = 10; // ms
const MOVE_SPEED = 0.25; // px per ms
const TILE_SIZE = 50; // px

let animationBuffer = [];

function pxToInt(pxPos) {
    return Number(pxPos.match(/([0-9]+)px/)[1]);
}

function intToPx(n) {
    return n+"px";
}

function displayData() {
    let arrayDiv = document.getElementById("array");
    arrayDiv.innerHTML="";
    for (let i=0; i<datastore.length; i++) {
        let elemDiv = document.createElement("div");
        elemDiv.id = elemId(i);
        elemDiv.innerText = datastore[i];
        elemDiv.style.left = intToPx(i*TILE_SIZE);
        elemDiv.style.top = intToPx(TILE_SIZE);
        elemDiv.setAttribute("class","array_element");
        arrayDiv.appendChild(elemDiv);
    }
}

function displayPointer(pointerUri, row, col) {
    let algorithmDiv = document.getElementById("array");
    let pointerEle = document.createElement("img");
    pointerEle.src = pointerUri;
    pointerEle.setAttribute("class","pointer");
    pointerEle.style.left = intToPx(col*TILE_SIZE);
    pointerEle.style.top = intToPx(row*TILE_SIZE);
    algorithmDiv.appendChild(pointerEle);
    return pointerEle;
}

/**
 * Move DOM element in time increments of TIME_DELTA along path
 * Call endHookFn when reached. The endHookFn can be used to 
 * resolve the Promise.
 * 
 * @param {*} elem 
 * @param {*} path 
 * @param {*} endHookFn 
 */
function elementPath(elem, path, endHookFn) {
    if (path.length>1) {
        moveSizeX = Math.min(TIME_DELTA * MOVE_SPEED, Math.abs(path[1][0] - path[0][0])) * Math.sign(path[1][0] - path[0][0]);
        moveSizeY = Math.min(TIME_DELTA * MOVE_SPEED, Math.abs(path[1][1] - path[0][1])) * Math.sign(path[1][1] - path[0][1]);
        if (Math.abs(moveSizeX)>0 || Math.abs(moveSizeY) > 0) {
            path[0][0] += moveSizeX;
            path[0][1] += moveSizeY;
            elem.style.left = intToPx(path[0][0]);
            elem.style.top = intToPx(path[0][1]);
            setTimeout(elementPath, TIME_DELTA, elem, [...path], endHookFn);
        }
        else {
            path.shift();
            setTimeout(elementPath, TIME_DELTA, elem, [...path], endHookFn);
        }
    }
    else if (endHookFn)
        setTimeout(endHookFn, TIME_DELTA*10);
}

/**
 * Swap DOM Elements by moving them simultaneously, and resolving
 * Promise only when they have both finished
 * 
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function swapElements(a, b) {
    let elemA = document.getElementById(a);
    let elemB = document.getElementById(b);
    aStart = pxToInt(elemA.style.left);
    aEnd = pxToInt(elemB.style.left);
    aStartY = pxToInt(elemA.style.top);
    bStartY = pxToInt(elemB.style.top);
    let pathA = [[aStart, aStartY], [aStart,(aStartY - TILE_SIZE)], [aEnd, (aStartY - TILE_SIZE)], [aEnd, aStartY]]
    let pathB = [[aEnd, bStartY], [aEnd,(bStartY + TILE_SIZE)], [aStart, (bStartY + TILE_SIZE)], [aStart, aStartY]]
    return Promise.all([
        translateElement(elemA, pathA),
        translateElement(elemB, pathB)
    ]);
}

/**
 * Move DOM Element along defined path, and resolve the Promise
 * only when it reaches the end of the path.
 * 
 * @param {} element 
 * @param {*} path 
 * @returns 
 */
function translateElement(element, path) {
    return new Promise(resolve => {
        setTimeout(elementPath, TIME_DELTA, element, path, resolve);
    })
}

function showCommentary(whatsHappening) {
    let commentaryDiv = document.getElementById("commentary");
    commentaryDiv.innerText = whatsHappening;
}

function showAlgorithmName(algorithmName) {
    let algorithmDiv = document.getElementById("algorithm_name");
    algorithmDiv.innerText = algorithmName;
}

let mergeRangeElems = null;

function showMergeRange(start, sorted, divider, length) {
    if (!mergeRangeElems) {
        mergeRangeElems = {
            arrayDiv: document.getElementById("array"),
            sortedSeg: document.createElement("div"),
            leftSeg: document.createElement("div"),
            rightSeg: document.createElement("div"),
        }
        mergeRangeElems.sortedSeg.setAttribute("class", "range_element sorted");
        mergeRangeElems.sortedSeg.textContent = "Sorted";
        mergeRangeElems.arrayDiv.appendChild(mergeRangeElems.sortedSeg);
        mergeRangeElems.leftSeg.setAttribute("class", "range_element left");
        mergeRangeElems.leftSeg.textContent = "Left";
        mergeRangeElems.arrayDiv.appendChild(mergeRangeElems.leftSeg);
        mergeRangeElems.rightSeg.setAttribute("class", "range_element right");
        mergeRangeElems.rightSeg.textContent = "Right";
        mergeRangeElems.arrayDiv.appendChild(mergeRangeElems.rightSeg);    
    }
    mergeRangeElems.sortedSeg.style.left = intToPx ( (start) * TILE_SIZE );
    mergeRangeElems.sortedSeg.style.width = intToPx ( sorted * TILE_SIZE );
    mergeRangeElems.sortedSeg.style.visibility = (sorted<=0) ? "hidden" : "visible";
    mergeRangeElems.leftSeg.style.left = intToPx ( (start + sorted) * TILE_SIZE );
    mergeRangeElems.leftSeg.style.width = intToPx ( (divider - sorted) * TILE_SIZE );
    mergeRangeElems.leftSeg.style.visibility = (divider <= sorted) ? "hidden" : "visible";
    mergeRangeElems.rightSeg.style.left = intToPx ( (start + divider) * TILE_SIZE );
    mergeRangeElems.rightSeg.style.width = intToPx ( (length - divider) * TILE_SIZE );
    mergeRangeElems.rightSeg.style.visibility = (length <= divider) ? "hidden" : "visible";

    return new Promise((resolve) => setTimeout(()=>resolve(),500));
}

/**
 * Factory method for pivot elements
 */
let pivotNo = 0;
function pivotElement(currentPivot) {
    pivotNo++;
    let pivotElement = document.createElement("div");
    pivotElement.setAttribute("class", "pivot_element");
    let arrayDiv = document.getElementById("array");
    pivotElement.textContent = `P${pivotNo}`;
    pivotElement.style.top = "0px"
    pivotElement.style.left = intToPx (currentPivot * TILE_SIZE)
    pivotElement.style.visibility = "hidden";
    arrayDiv.appendChild(pivotElement);
    return pivotElement;
}

/**
 * Update position of the pivot DOM element
 * 
 * @param {*} elem 
 * @param {*} pivotPosition 
 * @returns 
 */
function placePivotElement(elem, pivotPosition) {
    if (elem === null) {
        elem = pivotElement(pivotPosition);
    }
    elem.style.visibility = "visible";
    let path = [
        [pxToInt(elem.style.left), pxToInt(elem.style.top)],
        [(pivotPosition * TILE_SIZE), pxToInt(elem.style.top)]
    ]
    return new Promise(resolve=>elementPath(elem, [...path], ()=>setTimeout(resolve, 500)));
}

/**
 * swap two DOM elements over.
 * 
 * @param {*} i 
 * @param {*} j 
 */
function animateSwap(i,j) {
    let xi = datastore[i];
    let xj = datastore[j];
    animationBuffer.push(()=>{showCommentary(`${xi} > ${xj} swapping`)});
    let ei = elemIds[i];
    let ej = elemIds[j];
    animationBuffer.push(() => {return swapElements(ei,ej)});
}

/**
 * animateRotate
 * Move element at "source" to "destination" and shift any elements in between one place towards "source"
 * 
 * @param {*} destination 
 * @param {*} source 
 * @returns 
 */
function animateRotate(destination,source) {
    let moves = [];

    if (destination===source)
        return;

    dir = destination<source ? -1 : +1;

    let top = pxToInt(document.getElementById(elemIds[destination]).style.top);
    let destX = destination * TILE_SIZE;
    let elem = document.getElementById(elemIds[source]);
    let path = [
        [source * TILE_SIZE, top],
        [source * TILE_SIZE, (top + TILE_SIZE)],
        [destX, (top + TILE_SIZE)],
        [destX, top]
    ];
    moves.push(()=>translateElement(elem, path));
    let jj = source;
    for (; dir*destination > dir*jj; jj+=dir) {
        let elem = document.getElementById(elemIds[jj+dir]);
        let path = [
            [((jj+dir) * TILE_SIZE), top],
            [( jj * TILE_SIZE ), top]
        ]
        moves.push(()=>translateElement(elem, path));
    }

    animationBuffer.push(()=>Promise.all(moves.map(f=>f())));
}


function animatePointer(pointerElem, fromX, toX,  row) {
    animationBuffer.push(() => {return translateElement(pointerElem,[[fromX * TILE_SIZE, row * TILE_SIZE],[toX * TILE_SIZE, row * TILE_SIZE]])});
}

function animateOperation(fn, ...args) {
    switch (args.length) {
        case 0:
            animationBuffer.push(()=>fn());
            return;
        case 1:
            animationBuffer.push(()=>fn(args[0]));
            return;
        case 2:
            animationBuffer.push(()=>fn(args[0], args[1]));
            return;
        case 3:
            animationBuffer.push(()=>fn(args[0], args[1], args[2]));
            return;
        case 4:
            animationBuffer.push(()=>fn(args[0], args[1], args[2], args[3]));
            return;
        }
    throw new Error(`Can't handle args of length ${args.length}`);
}
async function prepareSort() {
    await cancelAnimation();
    mergeRangeElems = null;
    animationBuffer = [];
    displayData();
}

async function cancelAnimation() {
    if (animationState == "running") {
        console.log("cancelling");
        animationState = "cancelling";
        let t=0;
        return new Promise(
            (resolve, reject) => {
                let timer = setInterval(() => {
                    t = t + 1;
                    console.log("waiting for cancel")
                    if (animationState == "stopped")
                        resolve();
                    else if 
                        (t>2) reject();
                    else
                        return;
                    clearInterval(timer);
                }, 1000, resolve);
            }
        );
    }
}
let animationState = "stopped";
function playAnimation() {
    animationState = "running";
    animationBuffer.reduce((promises, next) => promises.then(
            () => {
                    if (animationState!="running")
                        throw new Error("Cancelled");
                    return next();
                  }
        ), new Promise(resolve=>{resolve()}))
        .catch((reason) => {console.log(`error ${reason}`)})
        .finally(()=>{animationState = "stopped";});
}

async function randomise() {
    generateSourceData(datastore_size);
    reset();
}
async function reset() {
    if (datastore.length<=0)
        generateSourceData(datastore_size);
    await cancelAnimation();
    pivotNo = 0;
    mergeRangeElems = null;
    animationBuffer = [];
    populateDatastore();
    displayData();
}
