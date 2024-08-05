const NUM_ELEMENTS = 10000;
const NOT_FOUND = -1;

const primes_to_150 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 
    67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149];

let next_prime;
for (next_prime = 1.3 * NUM_ELEMENTS; ;next_prime++) {
    if (primes_to_150.every(n=>{return next_prime%n !== 0}))
        break;
}

const NUM_BUCKETS = Math.round(next_prime);
console.log("NUM_BUCKETS = " + NUM_BUCKETS);

let buckets = new Array(NUM_BUCKETS);

function hash_function(key) {
    return Math.round(67 * key * key * key + 31 * NUM_BUCKETS * key + 89); 
}

function insert_item(item) {
    let bucket_no = hash_function(item)  % NUM_BUCKETS;
    if (!buckets[bucket_no]) 
        buckets[bucket_no] = [item];
    else
        buckets[bucket_no].push(item);
}

function hash_search(item) {
    let bucket_no = hash_function(item)  % NUM_BUCKETS;
    return buckets[bucket_no]?.find(e=>e===item) ?? NOT_FOUND;
}

let item;
for (let i = 0; i<NUM_ELEMENTS; i++) {
    item = Math.random();
    insert_item(item);
}

let found = hash_search(item);

console.log("item=" + item + ", found=" + found);