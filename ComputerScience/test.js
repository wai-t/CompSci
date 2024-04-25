let p1 = new Promise(resolve => {
    setTimeout(()=>{
        console.log("p1");
        resolve(1);
    }, 1000);
});

let p2 = new Promise(resolve => {
    setTimeout(()=>{
        console.log("p2");
        resolve(2);
    }, 2000);
});

console.log("ready");

let r = Promise.all([p1,p2]).then(r => console.log("then = " + r));

console.log("r="+r);