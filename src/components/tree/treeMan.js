

class nbTree {
  constructor() {
    this.nbTree = {};
  }

  addTree(id, value) {
    this.nbTree[id] = value;
  }

  getTree(id) {
    return this.nbTree[id];
  }

  clearTree(id) {
    !!this.nbTree[id] && this.nbTree[id].clear();
  }

  removeTree(id) {
    if (!this.nbTree[id]) {
      return;
    }
    this.clearTree(id);
    this.nbTree[id] = null;
    delete this.nbTree[id];
  }
}
export default new nbTree();
