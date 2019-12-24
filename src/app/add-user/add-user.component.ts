import { Component, OnInit, ViewChild,Output } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserVO} from '../model/UserVO';
import {UserResultVO} from '../model/UserResultVO';
import {MatListModule} from '@angular/material/list';

import {UserserviceService} from '../service/userservice.service'

import {ActivatedRoute, ParamMap} from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute, private userService:UserserviceService,
    private datePipe: DatePipe) { }

  userForm: FormGroup;
  
  @Output()
  userList :  Array<UserVO> =[];

  @Output()
  success: boolean;

  @Output()
  message: String;

  @Output()
  flow: String = "ADD";

  ngOnInit() {

    this.userForm = new FormGroup({
      userId: new FormControl(''),
      firstName: new FormControl('',[ Validators.required ]),
      lastName: new FormControl('',[ Validators.required ]),
      employeeId: new FormControl('',[ Validators.required ])
     
    });

    this.sortUserDetails('firstName');

  }

  addUser() {
    console.log(this.userForm.value);
    let user = new UserVO();
   
    user.firstName = this.userForm.get("firstName").value;
    user.lastName = this.userForm.get("lastName").value;
    user.emplID = this.userForm.get("employeeId").value;
    console.log(user);

    this.userService.insertUserDetail(user).subscribe(
      (userResult)=>{
        this.success=true;
        this.message="Successfully saved the data!";
        //console.log(taskDetail);
        this.sortUserDetails('firstName');
        this.resetForm();
      },
      (error)=>{
        this.success=false;
        this.message=error;
        //console.log(error);
      }
    );    

   
   
    console.log(this.userList);
  }

  updateUserDetail() {
    console.log(this.userForm.value);
    let user = new UserVO();
   
    user.firstName = this.userForm.get("firstName").value;
    user.lastName = this.userForm.get("lastName").value;
    user.emplID = this.userForm.get("employeeId").value;
    user.userId = this.userForm.get("userId").value;

    this.userService.updateUserDetail(user).subscribe(
      (userResult)=>{
        this.success=true;
        this.message="Successfully updated the data!";
        console.log(userResult);
        this.sortUserDetails('firstName');

       
      },
      (error)=>{
        this.success=false;
        this.message=error.message;
        console.log(error);
      }
    );

  }

  editUserDetail(userId:String) {
    console.log(this.userForm.value);
    let user = new UserVO();
   
    this.userService.loadUserDetails(userId).subscribe(
      (userResult:UserResultVO)=>{
        console.log(userResult);
        if(null!=userResult.userData){
          let userDetail = userResult.userData;
          this.userForm.get("userId").setValue(userDetail.userId);
          this.userForm.get("firstName").setValue(userDetail.firstName);
          this.userForm.get("lastName").setValue(userDetail.lastName);
          this.userForm.get("employeeId").setValue(userDetail.emplID);
          this.flow = "UPDATE";
         console.log(userResult);
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  sortUserDetails(sortField:String) {
    console.log(sortField);
    this.userService.sortUserDetails(sortField).subscribe(
      (userResult:UserResultVO)=>{        
        this.userList = userResult.userList;
      },
      (error)=>console.log(error)
      );

  }

  deleteUserDetails(userId:String) {
    console.log(userId);
    this.userService.deleteUserDetail(userId).subscribe(
      (userResult:UserResultVO)=>{        
        this.sortUserDetails('firstName');
      },
      (error)=>console.log(error)
      );

  }

  resetForm() {
    this.userForm.reset();
    
  }

  get userf() { return this.userForm.controls; }

  get firstName() { return this.userForm.get('firstName'); }

  get lastName() { return this.userForm.get('lastName'); }

  get employeeId() { return this.userForm.get('employeeId'); }

}
