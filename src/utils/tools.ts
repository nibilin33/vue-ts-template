import { get } from 'lodash';

// 获取后台返回错误
export const getResponseError = (error:any) => {
    let { msg } = error;
    const fieldError = get(error, 'fieldErrors[0].msg');
    if (fieldError) {
        msg = fieldError;
    }
    return msg;
};
