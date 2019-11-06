
import { format } from '@/views/login/adapters/transform-params';

export default class VoteAPI {
  @format
  login(code:string) {
    console.log(code, 'after');
  }
}
