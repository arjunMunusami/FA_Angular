
import { Project } from './ProjectVO';
import { UserVO } from './UserVO';
import { ParentTask } from './ParentTaskVO';


export class TaskDetail {


    taskId : number;
    taskName : String;
    taskPriority : number;
    taskStartDt : Date;
    taskEndDt:Date;   
    status:String;
    project:Project;
    parentTask:ParentTask;
    prtTask:Boolean;
    user:UserVO;

}