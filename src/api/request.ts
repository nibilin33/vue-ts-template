import axios from 'axios';
import { set } from 'lodash';
import AxiosAdapter from './adapter';

console.log(process.env.NODE_ENV);
const CONFIG = {
    PREFIX: process.env.NODE_ENV === 'development' ? '/' : '/ume',
    TIMEOUT: 1000 * 60 * 30,
};

const { CancelToken } = axios;

interface customConfig {
  isLoading?: boolean
  error?: string
}

type CallbackFunction = (config:any) => void;

/**
 * @description 错误处理，等待效果，过期处理
 * todo:重复提交走事件，可以将这种显隐控制剥离提交流程
 */
class Axios extends AxiosAdapter {
  private prefix: string = ''

  private instance: any = axios.create({
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: CONFIG.TIMEOUT,
      baseURL: CONFIG.PREFIX,
      transformRequest: [function (data) {
          if (data instanceof Object) data = JSON.stringify(data);
          return data;
      }],
  })

  constructor(base:string = 'uc/api/v1/manager/') {
      super();
      this.prefix = base;
      this.setbaseURL();
      this.intercepteRequest();
      this.intercepteResponse();
  }

  setbaseURL(base:string = CONFIG.PREFIX) {
      set(this.instance, 'defaults.baseURL', base);
      return this;
  }

  setHeaders(config:Object) {
      set(this.instance, 'defaults.headers', config);
      return this;
  }

  post(url:string, data:any) {
      return this.instance.post(this.prefix + url, data).then((res:any) => res.data);
  }

  get(url:string, data:any) {
      return this.instance.get(this.prefix + url,
          { params: data || {} }).then((res:any) => res.data);
  }

  delete(url:string, data:any) {
      return this.instance.delete(this.prefix + url,
          { params: data || {} }).then((res:any) => res.data);
  }

  put(url:string, data:any) {
      return this.instance.put(this.prefix + url, data)
          .then((res:any) => res.data);
  }

  patch(url:string, data:any) {
      return this.instance.patch(this.prefix + url, data)
          .then((res:any) => res.data);
  }

  cancel() {
      const source = CancelToken.source();
      source.cancel('Operation canceled by the user');
  }

  /**
   * @param {string} url
   * @param {customConfig} [config]
   * @returns
   * @memberof Axios
   * @description 可以需要改这个请求的自定义，
   * new Axios().setPedding('/api/v1/xxx',{isLoading:false}).get('/api/v1/xxx');
   */

  setPedding(url:string, config:customConfig) {
      Axios.pedding[this.prefix + url] = config;
      return this;
  }

  intercepteRequest(callback?: CallbackFunction) {
      this.instance.interceptors.request.use((config:any) => {
          if (typeof callback === 'undefined') {
              Axios.transformRequest(config);
          } else {
              callback(config);
          }
          return config;
      }, (error:any) => {
          Axios.resolveError(error);
          return Promise.reject(error);
      });
  }

  intercepteResponse(callback?: CallbackFunction) {
      this.instance.interceptors.response.use((response:any) => {
          if (typeof callback === 'undefined') {
              Axios.transformResponse(response);
          } else {
              callback(response);
          }
          return response;
      }, (error:any) => {
          Axios.resolveError(error);
          return Promise.reject(error);
      });
  }

  destroy() {
      Object.keys(Axios.pedding).forEach((name:string) => {
          delete Axios.pedding[name];
      });
      Axios.pedding = {};
  }
}
export default Axios;
