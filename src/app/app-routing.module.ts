import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import {AddUserComponent} from './add-user/add-user.component';
import {AddProjectComponent} from './add-project/add-project.component';

const routes: Routes = [
  {path:'addTask',component:AddTaskComponent},
  {path:'viewTask',component:ViewTaskComponent},
  {path:'editTask/:taskId',component:AddTaskComponent},
  {path:'endTask/:taskId',component:ViewTaskComponent},
  {path:'addUser',component:AddUserComponent},
  {path:'addProject',component:AddProjectComponent},
  {path:'',component:AddTaskComponent},
  {path:'**',component:AddTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
