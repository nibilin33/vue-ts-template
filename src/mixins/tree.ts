export default class Tree {
    treeMap:object = {};

    treeList:Array<any> = [];

    reqAPI:Function = () => {};

    async init(params:any) {
    }

    desctroy() {
        this.treeMap = {};
        this.treeList = [];
    }

    // 返回ids的详细的组织架构信息
    getListByIds(ids:Array<string>) {
    }
}
