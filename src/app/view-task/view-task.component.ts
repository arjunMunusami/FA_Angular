import { Component, ViewChild,OnInit } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {TskMgmServiceService} from '../service/tsk-mgm-service.service'
import {TaskSearch} from '../model/TaskSearchVO';
import {TaskResult} from '../model/TaskResultVO';
import {TaskDetail} from '../model/TaskDetailVO';
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  displayedColumns = ['Task Name', 'Parent Task', 'Priority', 'Start Date','End Date','Actions'];
  dataSource: MatTableDataSource<TaskDetail>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private tskMgmtService:TskMgmServiceService,private activatedRoute:ActivatedRoute) {
    
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => { 
      console.log(params.get('taskId'));
      if(null!=params && params.get('taskId')!==undefined){
        this.endTaskDetail(params.get('taskId'));
      } 
  });
  }

  taskSearchForm = new FormGroup({
  
    taskName: new FormControl('',[
      Validators.required
    ]),
    parentTask: new FormControl(''),
    taskPriorityFrom: new FormControl(''),
    taskPriorityTo: new FormControl(''),
    taskStartDt: new FormControl('',[
      Validators.required,
      Validators.pattern('^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})')
    ]),
    taskEndDt: new FormControl('',[
      Validators.required,
      Validators.pattern('^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})')
    ])
    
  })

  searchTaskDetails() {
    console.log(this.taskSearchForm.value);
    let searchDetail = new TaskSearch();
   
    searchDetail.taskName = this.taskSearchForm.get("taskName").value;
    searchDetail.parentTask = this.taskSearchForm.get("parentTask").value;
    searchDetail.taskPriorityFrom = this.taskSearchForm.get("taskPriorityFrom").value;
    searchDetail.taskPriorityTo = this.taskSearchForm.get("taskPriorityTo").value;
    searchDetail.taskStartDate = this.taskSearchForm.get("taskStartDt").value;
    searchDetail.taskEndDate = this.taskSearchForm.get("taskEndDt").value;
    

    this.tskMgmtService.searchTask(searchDetail).subscribe(
      (taskResult)=>{        
        this.dataSource = new MatTableDataSource(taskResult.taskList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error)=>console.log(error)
      );

  }

  endTaskDetail(taskId:String){

    console.log(this.taskSearchForm.value);

    this.tskMgmtService.endTaskDetail(taskId).subscribe(
      (taskResult:TaskResult)=>{
        if(null==taskResult.errMsg || taskResult.errMsg==''){
          this.searchTaskDetails();
        }
      },
      (error)=>console.log(error)
      );

  }

  clearTaskSearch() {
    this.taskSearchForm.reset();
  }

 
}
