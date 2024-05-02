const TIME_DELTA = 10; // ms
const MOVE_SPEED = 0.25; // px per ms
const TILE_SIZE = 50; // px

let sourcedata = [];

let datastore = []; // data to be sorted
let elemIds = [];
let datastore_size = 10;

let animationBuffer = [];

function generateSourceData(size) {
    sourcedata = [];
    while(size > 0) {
        sourcedata.push(Math.floor(Math.random()*100));
// for debugging                    sourcedata.push((sourcedata.length+1*13)%5);
        size--;
    }
}
function populateDatastore(size) {
    datastore = [...sourcedata];
    elemIds = datastore.map((_,k) => elemId(k));
}

function elemId(i) {return `elem${i}`;}

function pxPosToInt(pxPos) {
    return Number(pxPos.match(/([0-9]+)px/)[1]);
}

function intToPxPos(n) {
    return n+"px";
}

function displayData() {
    let arrayDiv = document.getElementById("array");
    arrayDiv.innerHTML="";
    for (let i=0; i<datastore.length; i++) {
        let elemDiv = document.createElement("div");
        elemDiv.id = elemId(i);
        elemDiv.innerText = datastore[i];
        elemDiv.style.left = intToPxPos(i*TILE_SIZE);
        elemDiv.style.top = intToPxPos(3*TILE_SIZE);
        elemDiv.setAttribute("class","array_element");
        arrayDiv.appendChild(elemDiv);
    }
}

function displayPointer(pointerUri, row, col) {
    let algorithmDiv = document.getElementById("array");
    let pointerEle = document.createElement("img");
    pointerEle.src = pointerUri;
    pointerEle.setAttribute("class","pointer");
    pointerEle.style.left = intToPxPos(col*TILE_SIZE);
    pointerEle.style.top = intToPxPos(row*TILE_SIZE);
    algorithmDiv.appendChild(pointerEle);
    return pointerEle;
}

function stepElement(elem, start, end, endHookFn) {
    moveSize = TIME_DELTA * MOVE_SPEED * Math.sign(end - start);
    if (Math.abs(moveSize)>0) {
        start += moveSize;
        elem.style.left = intToPxPos(start);
        setTimeout(stepElement, TIME_DELTA, elem, start, end, endHookFn);
    }
    else if (endHookFn)
        setTimeout(endHookFn, TIME_DELTA*10);
}

function elementPath(elem, path, endHookFn) {
    if (path.length>1) {
        moveSizeX = Math.min(TIME_DELTA * MOVE_SPEED, Math.abs(path[1][0] - path[0][0])) * Math.sign(path[1][0] - path[0][0]);
        moveSizeY = Math.min(TIME_DELTA * MOVE_SPEED, Math.abs(path[1][1] - path[0][1])) * Math.sign(path[1][1] - path[0][1]);
        if (Math.abs(moveSizeX)>0 || Math.abs(moveSizeY) > 0) {
            path[0][0] += moveSizeX;
            path[0][1] += moveSizeY;
            elem.style.left = intToPxPos(path[0][0]);
            elem.style.top = intToPxPos(path[0][1]);
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

function swapElements(a, b) {
    let elemA = document.getElementById(a);
    let elemB = document.getElementById(b);
    aStart = pxPosToInt(elemA.style.left);
    aEnd = pxPosToInt(elemB.style.left);
    aStartY = pxPosToInt(elemA.style.top);
    bStartY = pxPosToInt(elemB.style.top);
    let pathA = [[aStart, aStartY], [aStart,(aStartY - 50)], [aEnd, (aStartY - 50)], [aEnd, aStartY]]
    let pathB = [[aEnd, bStartY], [aEnd,(bStartY + 50)], [aStart, (bStartY + 50)], [aStart, aStartY]]
    let aPromise = new Promise(resolve => {
        setTimeout(elementPath, TIME_DELTA, elemA, pathA, resolve);
    });
    let bPromise = new Promise(resolve => {
        setTimeout(elementPath, TIME_DELTA, elemB, pathB, resolve);
    });
    return Promise.all([aPromise, bPromise]);
}

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

function doSwap(i,j) {
    let xi = datastore[i];
    let xj = datastore[j];
    animationBuffer.push(()=>{showCommentary(`${xi} > ${xj} swapping`)});
    let tmp = datastore[i];
    datastore[i] = datastore[j];
    datastore[j] = tmp;
    tmp = elemIds[i];
    elemIds[i] = elemIds[j];
    elemIds[j] = tmp;
    let ei = elemIds[i];
    let ej = elemIds[j];
    animationBuffer.push(() => {return swapElements(ei,ej)});
}

function doRotate(i,j, dir=1) {
    if (i===j)
        return;
    [i,j] = [Math.min(i,j,), Math.max(i,j)];
    if (dir>0) {
        let top = pxPosToInt(document.getElementById(elemIds[i]).style.top);
        let destX = i * TILE_SIZE;
        let elem = document.getElementById(elemIds[j]);
        let path = [[j * TILE_SIZE, top],
                    [j * TILE_SIZE, (top - TILE_SIZE)]];
        animationBuffer.push(()=>{return translateElement(elem, [...path]);});
        let ii = i;
        let jj = j;
        for (;ii<jj;jj--) {
            let elem = document.getElementById(elemIds[jj-1]);
            let path = [[((jj-1) * TILE_SIZE), top],[( jj * TILE_SIZE ), top]];
            animationBuffer.push(()=>{return translateElement(elem, path);});
        }
        let path2 = [[j * TILE_SIZE, (top - TILE_SIZE)],
                [destX, (top - TILE_SIZE)],
                [destX, top]];
        animationBuffer.push(()=>{return translateElement(elem, path2);});
        let tempd = datastore[j];
        let tempe = elemIds[j];
        for (;i<j;j--) {
            datastore[j] = datastore[j-1];
            elemIds[j] = elemIds[j-1];
        }
        datastore[i] = tempd;
        elemIds[i] = tempe;
    }
}

function animatePointer(pointerElem, x, row) {
    animationBuffer.push(() => {return translateElement(pointerElem,[[(x-1)*TILE_SIZE, row*TILE_SIZE],[x*TILE_SIZE,row*TILE_SIZE]])});
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
    let p = new Promise(r=>{r()});
    for (let a of animationBuffer) {
        p = p.then(() => {
            if (animationState!="running")
                throw new Error("Cancelled");
            return a()
        });
    }
    p = p.catch((reason) => {console.log(`error ${reason}`)});
    p = p.finally(()=>{animationState = "stopped";})
}

async function reset() {
    await cancelAnimation();
    animationBuffer = [];
    generateSourceData(datastore_size);
    populateDatastore();
    displayData();
}
