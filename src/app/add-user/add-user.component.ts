import { Component, OnInit, ViewChild,Output } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserVO} from '../model/UserVO';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor() { }

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
      firstName: new FormControl(''),
      lastName: new FormControl('',[
        Validators.required
      ]),
      employeeId: new FormControl('')
     
    });

  }

  addUser() {
    console.log(this.userForm.value);
    let user = new UserVO();
   
    user.firstName = this.userForm.get("firstName").value;
    user.lastName = this.userForm.get("lastName").value;
    user.employeeId = this.userForm.get("employeeId").value;

    this.userList.push(user);   
   
    console.log(this.userList);
  }

}
