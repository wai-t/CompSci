/**
 * Assert sorted
 * */
function checkSorted() {
    for (let i = 0; i<datastore.length-1; i++) {
        if (datastore[i]>datastore[i+1])
            throw Error("result not sorted!");
    }
}

/**
 * 
 *  Selection Sort
 * 
 * */
async function selectionSort() {
    await prepareSort();

    let pointerJ = displayPointer("pointer_j.png",2,0);
    let pointerI = displayPointer("pointer_i.png",0,0);

    showAlgorithmName("Selection sort");
    showCommentary("Selection sort");

    for (i = 0; i<datastore.length-1; i++) {
        animatePointer(pointerI, Math.max(i-1,0), i, 0);
        for (j = i+1; j<datastore.length; j++) {
            animatePointer(pointerJ, j-1, j, 2);

            // If we find any element to the right of i that is smaller
            // then swap them
            if (datastore[i]>datastore[j]) {
                doSwap(i,j);
            }
        }
    }

    playAnimation();
}


/**
 * 
 *  Insertion Sort
 * 
 * */
async function insertionSort() {
    await prepareSort();

    let pointerJ = displayPointer("pointer_j.png",2,0);
    let pointerI = displayPointer("pointer_i.png",0,0);

    showAlgorithmName("Insertion sort");
    showCommentary("Insertion sort");

    for (i = 1; i<datastore.length; i++) {
        animatePointer(pointerI, i-1, i, 0);
        for (j = 0; j<i; j++) {
            animatePointer(pointerJ, Math.max(0,j-1), j, 2);

            // find the first place to the left of i to place the current element
            if (datastore[i]<datastore[j]) {
                animateOperation(showCommentary, `Inserting ${datastore[i]} at position J`);
                doRotate(j,i);

                break;
            }
        }
    }

    playAnimation();
}


/**
 * 
 *  Bubble Sort
 * 
 * */
async function bubbleSort() {
    await prepareSort();

    let pointerJ = displayPointer("pointer_j.png",2,0);
    let pointerI = displayPointer("pointer_i.png",0,0);

    showAlgorithmName("Bubble sort");
    showCommentary("Bubble sort");

    for (let i = datastore.length-1; i>0; i--) {
        animatePointer(pointerI, i+1, i, 0);
        for (let j = 0; j<i; j++) {
            animatePointer(pointerJ, Math.max(j-1,0), j, 2);

            // swap if the adjacent pair is out of order
            if (datastore[j]>datastore[j+1]) {
                animateOperation(showCommentary, `${ datastore[j]}>${datastore[j+1]}, so swapping`);
                doSwap(j,j+1);
            }
        }
    }

    playAnimation();
}


/**
 * 
 *  QuickSort
 * 
 * */
async function quickSortLaunch() {
    await prepareSort();

    showAlgorithmName("Quick sort");
    showCommentary("Quick sort");
    
    quickSort(0, datastore.length);
    
    playAnimation();
}
async function quickSort(start, length) {
    if (length==1) {
        animateOperation(placePivotElement, pivotElement(start), start);
        animateOperation(showCommentary, `pivot fixed at P${pivotNo}`);
        return;
    }
    // choose the pivot to be the last element in the sub-array
    let currentPivot = start + length - 1;
    let pivot = pivotElement(currentPivot);
    animateOperation(placePivotElement, pivot, currentPivot);
    for (let i = currentPivot-1; i>=0; i--) {
        // move every element to the left of the pivot that is larger to the right of the pivot
        // and shift everything in between (including the pivot) to the left to make room for it
        if (datastore[i] > datastore[currentPivot]) {
            animateOperation(showCommentary, `Moving ${datastore[i]} to right of ${datastore[currentPivot]} at pivot ${pivotNo}`);
            doRotate(currentPivot, i);
            animateOperation(placePivotElement, pivot, currentPivot-1);
            currentPivot--;
        }
    }
    // recursive calls: call quickSort on the (non-empty) sub-arrays to the left and right of the pivot
    if (currentPivot>start) quickSort(start,currentPivot - start);
    if (currentPivot<start + length-1) quickSort(currentPivot+1, start + length -1 - currentPivot);
}



/**
 * 
 *  MergeSort
 * 
 * */
async function mergeSortLaunch() {
    await prepareSort();

    showAlgorithmName("Merge Sort");
    showCommentary("Merge Sort");

    mergeSort(0, datastore.length);
    
    playAnimation();
}
async function mergeSort(start, length) {
    if (length<=1)
        return;
    else if (length==2) {
        animateOperation(showCommentary, `sorting range ${start} to ${start + length}`);
        animateOperation(showMergeRange, start, 0, 1, 2)
        if (datastore[start]>datastore[start+1]) {
            doRotate(start+1, start);
        }
        return;
    }

    // determine position of divider to split array into two sub-arrays
    let divider = 1;
    do {
        divider *= 2;
    } while (divider < length/2);

    // recursive calls to merge sort for the two sub-arrays
    mergeSort(start, divider);
    mergeSort(start + divider, length-divider);
    // sub-arrays should now be individually sorted

    animateOperation(showCommentary, `merging range: ${start} to ${start + length}`);

    let i = start;
    let j = start + divider;
    animateOperation(showMergeRange, start, 0, divider, length);
    while (i<j && j<start + length) {
        // if the right sub-array has the next lower value, then place it before
        // the left sub-array (at the end of the sorted elements), and shift everything
        // in between to the right to make room for it.
        if (datastore[i]>datastore[j]) {
            doRotate(i,j);
            j++;
        }
        i++;
        animateOperation(showMergeRange, start, i - start, j - start, length);
    }
    animateOperation(showMergeRange, start, length, length, length);

}
