const NUM_ELEMENTS = 10000;
const NOT_FOUND = -1;
const arr = [];
for (let i = 0; i < NUM_ELEMENTS; i++) {
    arr.push(i + 0.5 * Math.random());  // sorted but random
}

function binary_search(item, arr, start, end) {
    console.log("binary_search called, item=" + item + ", start=" + start + ", end="+end);
    if (end - start > 1) {
        let mid = start + Math.round((end-start)/2);
        if (arr[mid]>item)
            return binary_search(item, arr, start, mid);
        else
            return binary_search(item, arr, mid, end);
    }
    else {
        return arr[start]===item ? arr[start] : NOT_FOUND;
    }
}

let item = arr[1235];

let found = binary_search(item, arr, 0, NUM_ELEMENTS);

console.log("search=" + item +", found=" + found);
