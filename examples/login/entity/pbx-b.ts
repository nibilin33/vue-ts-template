import { transformToServer } from '../adapters/pbx';


export interface userData {
    username:string
    code:string
}

let user :userData = { username: '', code: '' }; 

export class PbxAPI {
    private user: userData

    constructor(params: any = user) {
      this.user = params;
    }

    get params() {
      return Object.create(this.user);
    }

    tramsfrom() {
      this.user = transformToServer(this.user);
      return this;
    }

    submit() {
      console.log(this.user, 'submit');
    }
}
