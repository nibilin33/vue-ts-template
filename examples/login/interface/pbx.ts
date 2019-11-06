import { keys } from 'ts-transformer-keys';
export interface userData {
    username:string
    code:string
}
export const userDataKeys = keys<userData>();