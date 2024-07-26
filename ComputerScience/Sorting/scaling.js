const NUM_ELEMENTS = 2_000_000;

//
// build a random floating point number between 0 and 1
//
function random_number_builder() {
    return Math.random();
}


//
// build a random integer between 0 and N-1
//
function random_discrete_value_builder(N) {
    return Math.floor(Math.random() * N);
}

//
// build a floating point number  in steps of 1, i.e. 1.011, 2.011, .... N-1 + 0.011
//
function random_discrete_value_plus_eps_builder(N) {
    return Math.floor(Math.random() * N) + 0.011;
}

//
// build a increasing 
//
let start = 0;
function trending_value_builder() {
    const noise = 1.2;
    start--;
    return Math.random()*noise + start;
}
//
// build a random string of length len
//
function random_string_builder(len) {
    let arr = []
    for (let c=0; c<len; c++) {
        arr.push(String.fromCharCode(97 + Math.floor(Math.random() * 26 ))); // a..z
    }
    return arr.join("");
}

function build_input(num_elements, builder_fn, comparator_fn) {
    let ret = [];
    for (let i = 0; i< num_elements; i++) {
        ret.push(builder_fn());
    }
    return [ret, comparator_fn];
}

function print_array_sample(arr, N) {
    for (let c = 0; c<N; c++) {
        let o = arr[c].toString();
        if (o.length > 10) {
            o = o.substring(0,26) + "...";
        }
        console.log(c + ": " + o);
    }
}

// let [input,comparator] = build_input(NUM_ELEMENTS, ()=>{return random_number_builder()}, (a,b)=>{return a-b;});
let [input,comparator] = build_input(NUM_ELEMENTS, ()=>{return trending_value_builder()}, (a,b)=>{return a-b;});
// let [input,comparator] = build_input(NUM_ELEMENTS, ()=>{return random_discrete_value_builder(20000)}, (a,b)=>{return a-b;});
// let [input,comparator] = build_input(NUM_ELEMENTS, ()=>{return random_discrete_value_plus_eps_builder(20000)}, (a,b)=>{return a-b;});
// let [input,comparator] = build_input(NUM_ELEMENTS, ()=>{return random_string_builder(100)});

// let comparator = null;
// let comparator = (a,b)=>{return a-b};

console.log("");
console.log("==================================================");
console.log("Input");
console.log("==================================================");
print_array_sample(input, 10);

console.log("");
console.log("==================================================");
console.log("Sorting");
console.log("==================================================");

console.time("sort");
if (comparator) 
    input.sort(comparator);
else 
    input.sort();
console.timeEnd("sort");

console.log("");
console.log("==================================================");
console.log("Output");
console.log("==================================================");
print_array_sample(input, 10);

console.log("");
console.log("==================================================");
console.log("Sort again");
console.log("==================================================");
console.time("sort again");
input.sort();
console.timeEnd("sort again");

