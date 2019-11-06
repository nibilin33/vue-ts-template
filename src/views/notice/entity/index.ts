import { Log } from '@/utils/log';

export class Notice {
    @Log(
        {
            module: 'Notice',
            eventName: 'findById',
            eventProperty: '定位ID',
        },
    )
    findById() {
    }
}
