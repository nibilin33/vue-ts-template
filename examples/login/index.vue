<template>
    <div>
        <button
        v-for="(it,index) in loginType"
        :key="index"
        @click="setLoginType(it)">
        {{it}}</button>
        <p>&nbsp;</p>
         用户名：
         <input v-model="userForm.username"/>
         密码：
         <input v-model="userForm.code"/>
         <button @click="submit">提交</button>
    </div>
</template>
<script>
import StrategyLogin from './adapters/login';
import PlatformApi from '@/lib/PlatformApi';
import { PbxAPI } from './entity/pbx';
import { getLoginConfig } from '@/api/pbx';

export default {
  data() {
    return {
      loginType: ['notice', 'vote'],
      result: {},
      isShow: false,
      userForm: new PbxAPI().params,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getLoginConfig()
      .then((res)=> {
          this.userForm = new PbxAPI(res).params;
      });
    },
    submit() {
      // 只负责接口调用
      new PbxAPI(this.userForm).tramsfrom().submit();
    },
    setLoginType(value) {
      const instance = StrategyLogin.getLoginInstance(value);
      instance.login('12121212');
    },
  },
};
</script>
