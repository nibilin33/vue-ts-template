

import {userDataKeys} from '../interface/pbx';

export const transformToServer = (data:any) => {
// 如果提交的数据需要格式化,比如页面的交互数据为[{id:xx,name:xxx}],提交只需要[id,id,id]
  console.log(data);
  return data;
}

export const transformToUse = (data:any) => {
  // 拿到服务器数据做处理后给页面使用
  // 比如：依据userDataKeys进行复制
  console.log(data);
  return data;
};


