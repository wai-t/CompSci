//
// Question 1
//
function question1() {
    solution1_version1("12242134213");
    solution1_version2("12242134213");
}

function solution1_version1 (input) {
    let array_copy = input.split("");

    let max = 0;
    let sums = {};
    for (let i in array_copy) {
        if (sums[array_copy[i]]) {
            sums[array_copy[i]]++;
        }
        else {
            sums[array_copy[i]] = 1;
        }
        max = Math.max(max, sums[array_copy[i]]);
    }

    console.log("solution1_version1: " + (input.length-max));
}

function solution1_version2 (input) {
    let array_copy = input.split("");

    let sums = array_copy.reduce((a,b) => {a[b] ? a[b]++ : a[b]=1; return a;}, {});
    
    console.log( "solution1_version2: " + (input.length - Math.max(...Object.values(sums))));
}

//
// Question 2
//
function question2() {
    solution2_version1("aaaBABACcccdDDAA");
    solution2_version2("aaaBABACcccdDDAA");
    solution2_version3("aaaBABACcccdDDAA");
}

function solution2_version1(input) {
    let tested = {};
    let count = 0;
    for (let i in input) {
        if (!tested[input[i].toLowerCase()]) {
            tested[input[i].toLowerCase()] = true;
            let last_lower = input.lastIndexOf(input[i].toLowerCase());
            let first_upper = input.indexOf(input[i].toUpperCase(), i);
            if (last_lower!=-1 && first_upper!=-1 && first_upper > last_lower) 
                count ++;
        }
    }
    console.log("solution2_version1: " + count);
}

function solution2_version2(input) {

    let unique_chars = [...new Set(input.toLowerCase().split(""))];

    let count = 0;
    for (let candidate of unique_chars) {
        let firstUpper = input.indexOf(candidate.toUpperCase());
        let lastLower = input.lastIndexOf(candidate.toLowerCase(), input.length);
        if (firstUpper>0 && lastLower>0 && lastLower < firstUpper) 
            count++;
    }

    console.log("solution2_version2: " + count);
}

function solution2_version3(input) {

    const SEEN_LOWER = 1;
    const SEEN_UPPER = 2;
    const BUST = 3;

    let status = {};

    for (let i in input) {
        let c = input[i];
        let key = c.toLowerCase();
        let c_status = status[key];
        switch (c_status) {
            case BUST: 
                continue;
            case SEEN_UPPER:
                if (c>='a' && c<='z')
                    status[key] = BUST;
                continue;
            case SEEN_LOWER:
                if (c>='A' && c<='Z')
                    status[key] = SEEN_UPPER;
                continue;
            default:
                if (c>='a' && c<='z')
                    status[key] = SEEN_LOWER;
                else
                    status[key] = BUST;
        }
    }
    let ans = Object.values(status).filter(x=>x==SEEN_UPPER);
    console.log("solution2_version3: "+ans.length);
}

//
// Question 3
//
function question3() {
    solution3_version1("one+two-one-two+two+two+one");
}

function solution3_version1(input) {
    let transformed = input.replaceAll("one","1").replaceAll("two",2);
    let ret = eval(transformed);

    console.log("solution3_version1: " + ret);
}

//
//
//
question1()
question2()
question3()