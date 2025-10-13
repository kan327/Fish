// AVL Tree (dari kode sebelumnya)
class Node {
  constructor(value) {
    this.value = value;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  height(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  updateHeight(node) {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insertNode(node, value) {
    if (!node) return new Node(value);

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    } else {
      return node;
    }

    this.updateHeight(node);
    const balance = this.getBalance(node);

    if (balance > 1 && value < node.left.value) return this.rotateRight(node);
    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);
    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  search(node, value) {
    if (!node) return false;
    if (value === node.value) return true;
    if (value < node.value) return this.search(node.left, value);
    return this.search(node.right, value);
  }

  contains(value) {
    return this.search(this.root, value);
  }
}







// Generate Dataset
const names = [];
for (let i = 0; i < 100000; i++) {
  names.push("User" + i);
}
names.push("Dina"); // target yang ingin kita cari

// Simpan dalam AVL Tree
const avl = new AVLTree();
for (const name of names) {
  avl.insert(name);
}

// Cari "Dina" dengan .filter()
console.time("Filter Search");
const resultFilter = names.filter(name => name === "Dina");
console.timeEnd("Filter Search");

// Cari "Dina" dengan AVL Tree
console.time("AVL Search");
const resultAVL = avl.contains("Dina");
console.timeEnd("AVL Search");

console.log("Filter result:", resultFilter.length > 0); // true
console.log("AVL result:", resultAVL); // true
