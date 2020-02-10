import { get, isUndefined } from 'lodash';
import { getUriPath } from '@/utils/tools';
import { login } from '@/api/login/index';
import PlatformApi from '@/channel/{{platformApi}}/PlatformApi';
import { LoginType } from './interface';
import { SessionStore } from '@/utils/store';


export default class BaseLogin {
    code:string ;

    clientId:string;

    type:string;

    constructor(code:string, clientId:string) {
        this.code = code;
        this.clientId = clientId;
        this.type = LoginType.extension;
        window.platformApi = new PlatformApi();
    }

    async login(query:any) {
        const code = await window.platformApi.getCode(this.code, this.clientId);
        const res = await login(code, this.type);
        SessionStore.setItem(this.type, res.data);
        this.router(this.formatQuery(query));
    }

    formatQuery(query:any) {
        return query;
    }

    router(query:any) {
        const type = get(query, 'type');
        const nest = isUndefined(type) ? 'error' : type;
        const uri = query ? `/ume/${nest}` : `/ume/${this.type}`;
        const currentPathName = window.location.pathname;
        const fullPath = getUriPath(uri);
        if (currentPathName === uri) {
            return;
        }
        window.location.href = fullPath;
    }
}
