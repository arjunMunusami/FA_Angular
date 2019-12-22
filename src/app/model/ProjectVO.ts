import {UserVO} from './UserVO';

export class Project {
    name : String;
    taskCnt : Number;
    taskCmpCnt : Number;
    startDate : Date;
    endDate : Date;
    priority : Number;
    manager: UserVO;
    id: number;
    status: String;
}