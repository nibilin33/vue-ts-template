import { 
  transformToServer,
  transformToUse,
 } from '../adapters/pbx';
import {userData} from '../interface/pbx';

export class PbxAPI {
    private user: userData = { username: '', code: '' }

    constructor(value:userData) {
      this.user = transformToUse(value);
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
