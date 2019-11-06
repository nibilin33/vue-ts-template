import NoticeAPI from './notice';
import VoteAPI from './vote';

export namespace login {
    export class Notice extends NoticeAPI {
    }
    export class Vote extends VoteAPI {}
}
