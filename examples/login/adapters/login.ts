import { login } from '@/views/login/entity';

class StrategyLogin {
  static getLoginInstance(type:any) {
    const allInstance = Object.values(login);
    const curentInstance = allInstance.findIndex(it => it.toString().toLowerCase().indexOf(type) > -1);
    return new allInstance[curentInstance]();
  }
}
export default StrategyLogin;
