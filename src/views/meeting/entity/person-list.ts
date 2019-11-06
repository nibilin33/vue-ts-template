enum PersonRole {
    attendee = 'attendee',
    presenter = 'presenter'
}
const roleKeys = Object.keys(PersonRole).join('');
class Person {
    type = 'STAFF';

    role:any = PersonRole.attendee;

    email = '';

    externalPhone = '';

    name = '';

    id = '';

    constructor(data:any) {
        console.log(data);
    }

    // 更换角色,支持第三方角色，如果未传角色名，则在内部角色做置换
    chagneRole(role?:string) {
        const trole = roleKeys.replace(this.role, '');
        this.role = trole;
    }
}

class PersonList {
    list:Array<any> = [];

    // 从树获取的勾选的节点与之前的做比较，需要保留之前的配置（role）
    setList(data:Array<any>) {
        this.list = data.map(it => new Person(it));
    }

    // 过滤转换属性，给后端
    getList() {
    }

    clearList() {
    }

    delListItem(index:number) {
    }
}
export default new PersonList();
