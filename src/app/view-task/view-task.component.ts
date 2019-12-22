import { Component, ViewChild,OnInit,Input,Output } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {TskMgmServiceService} from '../service/tsk-mgm-service.service'
import {TaskSearch} from '../model/TaskSearchVO';
import {TaskResult} from '../model/TaskResultVO';
import {TaskDetail} from '../model/TaskDetailVO';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Project} from '../model/ProjectVO';
import {ProjectserviceService} from '../service/projectservice.service';
import {ProjectResultVO} from '../model/ProjectResultVO';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  displayedColumns = ['Task Name', 'Parent Task', 'Priority', 'Start Date','End Date','Actions'];
  dataSource: MatTableDataSource<TaskDetail>;

  @Output()
  projectList :  Array<Project> =[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private tskMgmtService:TskMgmServiceService,
    private activatedRoute:ActivatedRoute,private projectService:ProjectserviceService) {
    
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => { 
      console.log(params.get('taskId'));
      if(null!=params && params.get('taskId') !== null && params.get('taskId')!==undefined){
        this.endTaskDetail(params.get('taskId'));
      } 
  });
  }

  taskSearchForm = new FormGroup({
  
    prjId: new FormControl(''),
    prjName: new FormControl('')
    
    
  })

  searchTaskDetails(orderField:String) {
    console.log(this.taskSearchForm.value);
    let searchDetail = new TaskSearch();
   
    searchDetail.projectId = this.taskSearchForm.get("prjId").value;   

    this.tskMgmtService.searchTask(searchDetail,orderField).subscribe(
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
          this.searchTaskDetails('startDate');
        }
      },
      (error)=>console.log(error)
      );

  }

  clearTaskSearch() {
    this.taskSearchForm.reset();
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
    this.taskSearchForm.get("prjId").setValue(project.id);
    this.taskSearchForm.get("prjName").setValue(project.name);  
    
  }

 
}
