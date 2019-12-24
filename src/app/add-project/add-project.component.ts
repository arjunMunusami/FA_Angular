import { Component, OnInit, ViewChild,Output, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Project} from '../model/ProjectVO';
import {UserVO} from '../model/UserVO';
import {ProjectResultVO} from '../model/ProjectResultVO';
import {UserResultVO} from '../model/UserResultVO';
import { formatDate } from "@angular/common";


import {ProjectserviceService} from '../service/projectservice.service';
import {UserserviceService} from '../service/userservice.service'

import {ActivatedRoute, ParamMap} from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute, private projectService:ProjectserviceService,
    private datePipe: DatePipe,private userService:UserserviceService) { }

  projectForm: FormGroup;
  
  @Output()
  projectList :  Array<Project> =[];

  @Output()
  userList :  Array<UserVO> =[];

  @Input()
  isPrjDtEnb : boolean = true;

  @Output()
  success: boolean;

  @Output()
  message: String;

  @Output()
  flow: String = "ADD";

  ngOnInit() { 

    this.projectForm = new FormGroup({
      projectId: new FormControl(''),
      projectName: new FormControl('',[ Validators.required ]),
      startDt: new FormControl('',[
        Validators.required
      ]),
      endDt: new FormControl('',[ Validators.required ]),
      priority: new FormControl('10'),
      managerId: new FormControl(''),
      managerName: new FormControl('',[ Validators.required ])     
    });

    this.flow = 'ADD';
    this.sortByResult('name');
  }

  toggleProjectDt(){
      
      this.isPrjDtEnb = !this.isPrjDtEnb;
      
      if(this.isPrjDtEnb){
        this.projectForm.get("startDt").enable();
        this.projectForm.get("endDt").enable();
      } else {
        this.projectForm.get("startDt").disable();
        this.projectForm.get("endDt").disable();
      }
     
  }

  addProject() {
    console.log(this.projectForm.value);
    let project = new Project();
    let manager = new UserVO();

    project.name = this.projectForm.get("projectName").value;
    project.startDate = this.projectForm.get("startDt").value;
    project.endDate = this.projectForm.get("endDt").value;
    project.priority = this.projectForm.get("priority").value;
    manager.userId = this.projectForm.get("managerId").value;
    project.status = 'INP';

    project.manager = manager;

    console.log(project);

    this.projectService.insertPrjDetail(project).subscribe(
      (projectRes:ProjectResultVO)=>{
        this.success=true;
        this.message="Successfully saved the data!";
        //console.log(taskDetail);
        this.sortByResult('name');
        this.resetForm();
      },
      (error)=>{
        this.success=false;
        this.message=error;
        //console.log(error);
      }
    );  

  }

  updateProjectDetail() {
    console.log(this.projectForm.value);
    
    let project = new Project();
    let manager = new UserVO();

    project.id = this.projectForm.get("projectId").value;
    project.name = this.projectForm.get("projectName").value;
    project.startDate = this.projectForm.get("startDt").value;
    project.endDate = this.projectForm.get("endDt").value;
    project.priority = this.projectForm.get("priority").value;    
    manager.userId = this.projectForm.get("managerId").value;
    project.status='INP';
   
    project.manager = manager;

    this.projectService.updateProjectDetail(project).subscribe(
      (projectRes:ProjectResultVO)=>{
        this.success=true;
        this.message="Successfully updated the data!";
        console.log(projectRes);
        this.sortByResult('name');       
      },
      (error)=>{
        this.success=false;
        this.message=error.message;
        console.log(error);
      }
    );

  }

  editProjectDetail(projectId:String) {
    console.log(this.projectForm.value);
    let user = new UserVO();

    const format = 'yyyy-MM-dd';    
    const locale = 'en-US';
      
    this.projectService.loadProjectDetails(projectId).subscribe(
      (projectRes:ProjectResultVO)=>{
        console.log(projectRes);
                
        if(null!=projectRes.data){
          let formattedStDate:String='';
          let formattedEnDate:String='';
          let projectDetail = projectRes.data;
          if(null!==projectDetail.startDate) {
            formattedStDate = formatDate(projectDetail.startDate, format, locale);
            formattedEnDate = formatDate(projectDetail.endDate, format, locale);
          } else {
            this.isPrjDtEnb = false;
          }
         
          console.log(formattedStDate+"|"+formattedEnDate);
          this.projectForm.get("projectId").setValue(projectDetail.id);
          this.projectForm.get("projectName").setValue(projectDetail.name);
          this.projectForm.get("startDt").setValue(formattedStDate);
          this.projectForm.get("endDt").setValue(formattedEnDate);
          this.projectForm.get("priority").setValue(projectDetail.priority);
          this.projectForm.get("managerName").setValue(projectDetail.manager.firstName+' '+projectDetail.manager.lastName);
          this.projectForm.get("managerId").setValue(projectDetail.manager.userId);
          this.flow = "UPDATE";         
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  sortByResult(sortField:String) {
    console.log(sortField);
    this.projectService.sortProjectDetails(sortField).subscribe(
      (projectRes:ProjectResultVO)=>{        
        console.log(projectRes);
        this.projectList = projectRes.projectList;
      },
      (error)=>console.log(error)
      );

  }

  suspendPrjDetails(projectId:String) {
    console.log(projectId);
    this.projectService.suspendProjectDetail(projectId).subscribe(
      (projectRes:ProjectResultVO)=>{        
        this.sortByResult('projectName');
      },
      (error)=>console.log(error)
      );

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
    this.projectForm.get("managerId").setValue(user.userId);
    this.projectForm.get("managerName").setValue(user.lastName+' '+user.firstName);    
  }

  resetForm() {
    this.projectForm.reset();
  }

  get f() { return this.projectForm.controls; }

}
