import axios from 'axios';
import { set } from 'lodash';
import AxiosAdapter from './adapter';

const CONFIG = {
    PREFIX: process.env.NODE_ENV === 'development' ? '' : '/ume',
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
  private pedding: any = {}

  private prefix: string = ''

  private instance: any = axios.create({
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: CONFIG.TIMEOUT,
      transformRequest: [function (data) {
          return JSON.stringify(data);
      }],
  })

  constructor(base:string = CONFIG.PREFIX) {
      super();
      this.setPrefix(base);
      this.intercepteRequest();
      this.intercepteResponse();
  }

  setPrefix(base:string) {
      this.prefix = base;
      set(this.instance, 'defaults.baseURL', base);
      return this;
  }

  setHeaders(config:Object) {
      set(this.instance, 'defaults.headers', config);
      return this;
  }

  post(url:string, data:any) {
      return this.instance.post(url, { data });
  }

  get(url:string, data:any) {
      return this.instance.get(url,
          { params: data || {} });
  }

  delete(url:string, data:any) {
      return this.instance.delete(url,
          { params: data || {} });
  }

  put(url:string, data:any) {
      return this.instance.put(url, { data });
  }

  patch(url:string, data:any) {
      return this.instance.patch(url, { data });
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
      this.pedding[this.prefix + url] = config;
      return this;
  }

  intercepteRequest(callback?: CallbackFunction) {
      this.instance.interceptors.request.use((config:any) => {
          if (typeof callback === 'undefined') {
              Axios.transformRequest(config, this.pedding);
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
              Axios.transformResponse(response, this.pedding);
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
      Object.keys(this.pedding).forEach((name:string) => {
          delete this.pedding[name];
      });
      this.pedding = {};
  }
}
export default Axios;
