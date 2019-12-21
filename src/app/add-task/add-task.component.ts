import { Component, OnInit ,Output } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {TskMgmServiceService} from '../service/tsk-mgm-service.service'
import {TaskDetail} from '../model/TaskDetailVO';
import {TaskResult} from '../model/TaskResultVO';
import {ActivatedRoute, ParamMap} from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  taskForm: FormGroup;

  @Output()
  success: boolean;

  @Output()
  message: String;

  @Output()
  flow: String = "ADD";

  constructor(private activatedRoute:ActivatedRoute, private tskMgmtService:TskMgmServiceService,private datePipe: DatePipe) { }

  
  ngOnInit() {
    this.taskForm = new FormGroup({
      taskId: new FormControl(''),
      taskName: new FormControl('',[
        Validators.required
      ]),
      taskPriority: new FormControl(''),
      taskStartDt: new FormControl('',[
        Validators.required,
        Validators.pattern('^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})')
      ]),
      taskEndDt: new FormControl('',[
        Validators.required,
        Validators.pattern('^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})')
      ]),
      taskParent: new FormControl(''),
      status:new FormControl('')
    })

    this.activatedRoute.paramMap.subscribe(params => { 
      console.log(params.get('taskId'));
      if(null!=params && params.get('taskId')!==undefined){
        this.editTaskDetail(params.get('taskId'));
      } 
    }); 
  }

 

  addTaskDetail() {
    console.log(this.taskForm.value);
    let taskDetail = new TaskDetail();
   
    taskDetail.taskName = this.taskForm.get("taskName").value;
    taskDetail.taskPriority = this.taskForm.get("taskPriority").value;
    taskDetail.taskStartDt = this.taskForm.get("taskStartDt").value;
    taskDetail.taskEndDt = this.taskForm.get("taskEndDt").value;
    taskDetail.status = this.taskForm.get("status").value;
    if(this.taskForm.get("taskParent").value!='') {
      let parentTaskDetail = new TaskDetail();
      parentTaskDetail.taskName = this.taskForm.get("taskParent").value;
      taskDetail.parentTask = parentTaskDetail;
    }

    this.tskMgmtService.insertTaskDetail(taskDetail).subscribe(
      (taskDetail)=>{
        this.success=true;
        this.message="Successfully saved the data!";
        //console.log(taskDetail);
      },
      (error)=>{
        this.success=false;
        this.message=error;
        //console.log(error);
      }
    );      
  }

  updateTaskDetail() {
    console.log(this.taskForm.value);
    let taskDetail = new TaskDetail();
   
    taskDetail.taskId = this.taskForm.get("taskId").value;
    taskDetail.taskName = this.taskForm.get("taskName").value;
    taskDetail.taskPriority = this.taskForm.get("taskPriority").value;
    taskDetail.taskStartDt = this.taskForm.get("taskStartDt").value;
    taskDetail.taskEndDt = this.taskForm.get("taskEndDt").value;
    taskDetail.status = this.taskForm.get("status").value;
    if(this.taskForm.get("taskParent").value!='') {
      let parentTaskDetail = new TaskDetail();
      parentTaskDetail.taskName = this.taskForm.get("taskParent").value;
      taskDetail.parentTask = parentTaskDetail;
    }

    this.tskMgmtService.insertTaskDetail(taskDetail).subscribe(
      (taskDetail)=>{
        this.success=true;
        this.message="Successfully updated the data!";
        console.log(taskDetail);
      },
      (error)=>{
        this.success=false;
        this.message=error.message;
        console.log(error);
      }
    );

  }

  editTaskDetail(taskId:String) {
    console.log(this.taskForm.value);
    let taskDetail = new TaskDetail();
   
    this.tskMgmtService.loadTaskDetail(taskId).subscribe(
      (taskResult:TaskResult)=>{
        if(null!=taskResult.taskEntity){
          let taskDetail = taskResult.taskEntity;
          this.taskForm.get("taskId").setValue(taskDetail.taskId);
          this.taskForm.get("taskName").setValue(taskDetail.taskName);
          this.taskForm.get("taskPriority").setValue(taskDetail.taskPriority);
          this.taskForm.get("taskStartDt").setValue(this.datePipe.transform(taskDetail.taskStartDt,'yyyy-MM-dd'));
          this.taskForm.get("taskEndDt").setValue(this.datePipe.transform(taskDetail.taskEndDt,'yyyy-MM-dd'));
          this.taskForm.get("taskParent").setValue((null!=taskDetail.parentTask?taskDetail.parentTask.taskName:''));
          this.flow = "UPDATE";
         console.log(taskResult);
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  resetTaskForm() {
    this.taskForm.reset();
  }

}
