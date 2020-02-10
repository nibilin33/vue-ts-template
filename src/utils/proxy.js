import {
    isFunction,
} from 'lodash';
import {
    firstLetterUpperCase,
} from '@/utils/tools';

class CustomProxy {
    params = {}

    constructor(data) {
        Object.keys(data).forEach((name) => {
            Object.defineProperty(this.params, name, {
                enumerable: true,
                configurable: true,
                get: () => data[name],
                set: (newValue) => {
                    isFunction(data[`set${firstLetterUpperCase(name)}`])
                    && data[`set${firstLetterUpperCase(name)}`](newValue);
                    data[name] = newValue;
                },
            });
        });
    }
}
export default function createDefensiveObject(data) {
    return new CustomProxy(data);
}
