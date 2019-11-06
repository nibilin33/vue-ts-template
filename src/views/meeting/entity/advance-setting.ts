import { AdvanceParams, advanceSetting } from '@/views/meeting/interface/index';

export default class Setting extends AdvanceParams {
    constructor(data:advanceSetting) {
        super();
        this.params = data;
    }

    // 初始化后端数据
    set params(data:any) {
        console.log(data);
    }

    formatParams() {
        return this;
    }
}
