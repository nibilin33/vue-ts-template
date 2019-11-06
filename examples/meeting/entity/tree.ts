import Tree from '@/mixins/tree';

class MeetingTree extends Tree {
    version:any = null;

    // 版本号标识，用来是否更新树的依据
    setVersion(data:any) {
        this.version = data;
    }
}
