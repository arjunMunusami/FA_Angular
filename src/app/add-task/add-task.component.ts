import { Component, OnInit ,Output,Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {TskMgmServiceService} from '../service/tsk-mgm-service.service'
import {TaskDetail} from '../model/TaskDetailVO';
import {TaskResult} from '../model/TaskResultVO';
import {ActivatedRoute, ParamMap} from "@angular/router";
import { DatePipe } from '@angular/common';
import {Project} from '../model/ProjectVO';
import {UserVO} from '../model/UserVO';
import {ParentTask} from '../model/ParentTaskVO';
import {UserserviceService} from '../service/userservice.service';
import {ProjectserviceService} from '../service/projectservice.service';
import {UserResultVO} from '../model/UserResultVO';
import {ProjectResultVO} from '../model/ProjectResultVO';

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

  @Output()
  projectList :  Array<Project> =[];

  @Output()
  userList :  Array<UserVO> =[];

  @Output()
  prtTaskList :  Array<ParentTask> =[];

  @Input()
  isTaskDtEnb : boolean = true;

  constructor(private activatedRoute:ActivatedRoute, private tskMgmtService:TskMgmServiceService,
    private datePipe: DatePipe,
    private userService:UserserviceService,
    private projectService:ProjectserviceService) { }

  
  ngOnInit() {
    this.taskForm = new FormGroup({
      taskId: new FormControl(''),
      taskName: new FormControl('',[
        Validators.required
      ]),
      taskPriority: new FormControl('5'),
      taskStartDt: new FormControl('',[
        Validators.required,
        Validators.pattern('^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})')
      ]),
      taskEndDt: new FormControl('',[
        Validators.required,
        Validators.pattern('^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})')
      ]),
      prtTaskId: new FormControl(''),
      prtTaskName: new FormControl(''),
      prjId: new FormControl(''),
      prjName: new FormControl(''),
      usrId: new FormControl(''),
      usrName: new FormControl(''),
      status:new FormControl(''),
      isParent:new FormControl('')
    })

    this.activatedRoute.paramMap.subscribe(params => { 
      console.log(params);
      if(null!=params && params.get('taskId')!==undefined 
            && params.get('taskId')!==null){
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
    taskDetail.prtTask = this.taskForm.get("isParent").value;

    if(!taskDetail.prtTask){
      let user = new UserVO();    
      let project = new Project();
      user.userId = this.taskForm.get("usrId").value;
      project.id = this.taskForm.get("prjId").value;
      taskDetail.user = user;
      taskDetail.project = project;
    }
    
    if(!taskDetail.prtTask) {
      let parentTaskDetail = new ParentTask();
      parentTaskDetail.id = this.taskForm.get("prtTaskId").value;
      parentTaskDetail.name = this.taskForm.get("prtTaskName").value;
      taskDetail.parentTask = parentTaskDetail;
    }

    this.tskMgmtService.insertTaskDetail(taskDetail).subscribe(
      (taskDetail)=>{
        this.success=true;
        this.message="Successfully saved the data!";
        this.resetTaskForm();
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
    taskDetail.prtTask = this.taskForm.get("isParent").value;

    let user = new UserVO();    
    let project = new Project();
    user.userId = this.taskForm.get("usrId").value;
    project.id = this.taskForm.get("prjId").value;
    taskDetail.user = user;
    taskDetail.project = project;

    if(this.taskForm.get("prtTaskName").value!='') {
      let parentTaskDetail = new ParentTask();
      parentTaskDetail.id = this.taskForm.get("prtTaskId").value;
      parentTaskDetail.name = this.taskForm.get("prtTaskName").value;
      taskDetail.parentTask = parentTaskDetail;
    }
    console.log(taskDetail);
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
    console.log(taskId);
    let taskDetail = new TaskDetail();   
   
    this.tskMgmtService.loadTaskDetail(taskId).subscribe(
      (taskResult:TaskResult)=>{
        if(null!=taskResult.taskEntity){
          console.log(taskResult.taskEntity);
          console.log(taskResult.taskEntity.project.id);
          let taskDetail = taskResult.taskEntity;
          this.taskForm.get("taskId").setValue(taskDetail.taskId);
          this.taskForm.get("taskName").setValue(taskDetail.taskName);
          this.taskForm.get("taskPriority").setValue(taskDetail.taskPriority);
          this.taskForm.get("taskStartDt").setValue(this.datePipe.transform(taskDetail.taskStartDt,'yyyy-MM-dd'));
          this.taskForm.get("taskEndDt").setValue(this.datePipe.transform(taskDetail.taskEndDt,'yyyy-MM-dd'));
          this.taskForm.get("prjId").setValue(taskDetail.project.id);
          this.taskForm.get("prjName").setValue(taskDetail.project.name);
          this.taskForm.get("usrId").setValue(taskDetail.user.userId);
          this.taskForm.get("usrName").setValue(taskDetail.user.firstName+" "+taskDetail.user.lastName);
          
          this.taskForm.get("isParent").disable();         
          this.taskForm.get("prtTaskId").setValue(taskDetail.parentTask!==null?taskDetail.parentTask.id:'');
          this.taskForm.get("prtTaskName").setValue(taskDetail.parentTask!==null?taskDetail.parentTask.name:'');
          
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

  loadUserData(sortField:String) {

    console.log(sortField);
    this.userService.sortUserDetails(sortField).subscribe(
      (userResult:UserResultVO)=>{        
        this.userList = userResult.userList;
      },
      (error)=>console.log(error)
      );

  }

  selectUserData(user:UserVO){
    console.log(user);
    this.taskForm.get("usrId").setValue(user.userId);
    this.taskForm.get("usrName").setValue(user.lastName+' '+user.firstName);    
  }

  loadProjectData(sortField:String) {
    console.log(sortField);
    this.projectService.sortProjectDetails(sortField).subscribe(
      (projectResult:ProjectResultVO)=>{        
        this.projectList = projectResult.projectList;
      },
      (error)=>console.log(error)
      );
  }

  selectProjectData(project:Project){
    console.log(project);
    this.taskForm.get("prjId").setValue(project.id);
    this.taskForm.get("prjName").setValue(project.name);    
  }

  loadParentTaskData() {
   
    this.tskMgmtService.loadPrtTask().subscribe(
      (prtTaskList:Array<ParentTask>)=>{        
        this.prtTaskList = prtTaskList;
      },
      (error)=>console.log(error)
      );
  }

  selectParentTaskData(parentTask:ParentTask){
    console.log(parentTask);
    this.taskForm.get("prtTaskId").setValue(parentTask.id);
    this.taskForm.get("prtTaskName").setValue(parentTask.name);    
  }

  toggleTaskDt(){
      
    this.isTaskDtEnb = !this.isTaskDtEnb;
    
    if(this.isTaskDtEnb){
      this.taskForm.get("taskPriority").enable();
      this.taskForm.get("taskStartDt").enable();
      this.taskForm.get("taskEndDt").enable();
      this.taskForm.get("prtTaskName").enable();
      this.taskForm.get("prjName").enable();
      this.taskForm.get("usrName").enable();

      this.taskForm.get('taskStartDt').setValidators([Validators.required]);
      this.taskForm.get('taskStartDt').updateValueAndValidity();
      this.taskForm.get('taskEndDt').setValidators([Validators.required]);
      this.taskForm.get('taskEndDt').updateValueAndValidity();
      this.taskForm.get('prtTaskName').setValidators([Validators.required]);
      this.taskForm.get('prtTaskName').updateValueAndValidity();
      this.taskForm.get('prjName').setValidators([Validators.required]);
      this.taskForm.get('prjName').updateValueAndValidity();
      this.taskForm.get('usrName').setValidators([Validators.required]);
      this.taskForm.get('usrName').updateValueAndValidity();      

    } else {
      this.taskForm.get("taskPriority").disable();
      this.taskForm.get("taskStartDt").disable();
      this.taskForm.get("taskEndDt").disable();
      this.taskForm.get("prtTaskName").disable();
      this.taskForm.get("prjName").disable();
      this.taskForm.get("usrName").disable();

      this.taskForm.get('taskStartDt').clearValidators();
      this.taskForm.get('taskStartDt').updateValueAndValidity();
      this.taskForm.get('taskEndDt').clearValidators();
      this.taskForm.get('taskEndDt').updateValueAndValidity();
      this.taskForm.get('prtTaskName').clearValidators();
      this.taskForm.get('prtTaskName').updateValueAndValidity();
      this.taskForm.get('prjName').clearValidators();
      this.taskForm.get('prjName').updateValueAndValidity();
      this.taskForm.get('usrName').clearValidators();
      this.taskForm.get('usrName').updateValueAndValidity();   
      
    }
   
}

  get f() { return this.taskForm.controls; }

}
