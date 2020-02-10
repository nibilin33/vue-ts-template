import { get } from 'lodash';
import { getResponseError } from '@/utils/tools';
import Tip from './tip';
import CustomLoading from './loading';
import { getConfig } from './config';
import { $t } from '@/i18n/index';

export default class AxiosAdapter {
    static pedding:any = {}

    static transformRequest(data: any) {
        const customConfig = AxiosAdapter.findPeddingConfig(get(data, 'url'), AxiosAdapter.pedding);
        !!customConfig.isLoading && CustomLoading.showLoading();
    }

    static transformResponse(response: any) {
        const customConfig = AxiosAdapter.findPeddingConfig(get(response, 'config.url'), AxiosAdapter.pedding);
        if (get(response, 'data.ret') < 0) {
            !!customConfig.type && AxiosAdapter.resolveError(response, customConfig);
        }
        CustomLoading.closeLoading();
    }

    static findPeddingConfig(url:string, pedding:any) {
        const peddingKey = Object.keys(pedding).find((uri:string) => url.indexOf(uri) > -1) || '';
        return getConfig(pedding[peddingKey] || {});
    }

    static resolveError(error:any, config:any = { type: 'error' }) {
        try {
            const errorCode = get(error, 'data.error.errorCode');
            const code = errorCode || get(error, 'code');
            const resError = getResponseError(get(error, 'data.error'));
            const msg = resError || get(error, 'statusText');
            // ume 目前占时不需要对失效做任何处理
            switch (code) {
            case 401:
            case 403:
            default:
                Tip.showTip(Object.assign({}, config, { message: $t(msg) }));
                break;
            }
        } catch (e) {
            Tip.showTip(Object.assign({}, config, { message: $t('common.netError') }));
            console.log(e);
        }

        CustomLoading.closeLoading();
    }
}
