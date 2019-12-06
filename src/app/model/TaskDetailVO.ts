
export class TaskDetail {


    taskId : number;
    taskName : String;
    taskPriority : number;
    taskStartDt : Date;
    taskEndDt:Date;
    parentTask:TaskDetail;
    status:String;

}