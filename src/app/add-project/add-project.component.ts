import { Component, OnInit, ViewChild,Output, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Project} from '../model/ProjectVO';
import {UserVO} from '../model/UserVO';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  constructor() { }

  projectForm: FormGroup;
  
  @Output()
  projectList :  Array<Project> =[];

  @Output()
  userList :  Array<UserVO> =[];

  @Input()
  isPrjDtEnb : boolean = true;

  @Output()
  flow : String='ADD';

  @Output()
  sortBy: String;

  ngOnInit() { 

    this.projectForm = new FormGroup({
      projectId: new FormControl(''),
      projectName: new FormControl(''),
      startDt: new FormControl('',[
        Validators.required
      ]),
      endDt: new FormControl(''),
      priority: new FormControl(''),
      managerId: new FormControl(''),
      managerName: new FormControl('')     
    });

    this.flow = 'ADD';

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
    manager.firstName = this.projectForm.get("managerName").value;

    project.manager = manager;

    this.projectList.push(project);  

  }

  loadUserData() {

    let user = new UserVO();
    user.firstName = 'Arjun';
    user.lastName='Munusamy';
    user.employeeId='asd';

    let user1 = new UserVO();
    user1.firstName = 'Arjun123';
    user1.lastName='Munusamy123';
    user1.employeeId='asd123';

    this.userList.push(user);
    this.userList.push(user1);
  }

  selectUserData(user:UserVO){
    console.log(user);
    this.projectForm.get("managerId").setValue(user.employeeId);
    this.projectForm.get("managerName").setValue(user.lastName+' '+user.firstName);    
  }

  sortByResult(data:String){
    console.log("sortByResult-->"+data);
    this.sortBy = data;
    
  }

}
