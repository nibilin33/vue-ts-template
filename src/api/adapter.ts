import { get } from 'lodash';
import { getResponseError } from '@/utils/tools';
import Tip from './tip';
import CustomLoading from './loading';
import { getConfig } from './config';

export default class AxiosAdapter {
    static transformRequest(data: any, pedding: any) {
        const customConfig = AxiosAdapter.findPeddingConfig(get(data, 'url'), pedding);
        !!customConfig.isLoading && CustomLoading.showLoading();
    }

    static transformResponse(response: any, pedding: any) {
        const customConfig = AxiosAdapter.findPeddingConfig(get(response, 'config.url'), pedding);
        if (get(response, 'data.ret') < 0) {
            !!customConfig.error && AxiosAdapter.resolveError({ response });
        }
        CustomLoading.closeLoading();
    }

    static findPeddingConfig(url:string, pedding:any) {
        const peddingKey = Object.keys(pedding).find((uri:string) => url.indexOf(uri) > -1) || '';
        return getConfig(pedding[peddingKey] || {});
    }

    static resolveError(error:any) {
        try {
            const errorCode = get(error, 'data.error.errorCode');
            const code = errorCode || get(error, 'code');
            const resError = getResponseError(get(error, 'data.error'));
            const msg = resError || get(error, 'response.statusText');
            // ume 目前占时不需要对失效做任何处理
            switch (code) {
            case 401:
            case 403:
            default:
                Tip.showTip({ message: msg });
                break;
            }
        } catch (e) {
            Tip.showTip({ message: 'common.netError' });
            console.log(e);
        }

        CustomLoading.closeLoading();
    }
}
