const NOT_FOUND = -1;
const NUM_ELEMENTS = 10000;

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    insert_left(value) {
        return this.left ? this.left.insert(value) : this.left = new TreeNode(value);
    }
    insert_right(value) {
        return this.right ? this.right.insert(value) : this.right = new TreeNode(value);
    }
    insert(value) {
        if (value > this.value) 
            return this.insert_right(value);
        else 
            return this.insert_left(value);
    }

    search(item) {
        console.log("search: item=" + item + ", this.value="+this.value);
        if (item>this.value)
            return this.right?.search(item) ?? NOT_FOUND;
        else if (item===this.value)
            return this.value;
        else
            return this.left?.search(item) ?? NOT_FOUND;

    }
}

let tree = new TreeNode(Math.random());
let item;

for (let i=1; i<NUM_ELEMENTS; i++) {
    item = Math.random()
    tree.insert(item);
}

let found = tree.search(item);

console.log("item=" + item + ", found=" + found);
