import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {TaskDetail} from '../model/TaskDetailVO';
import {TaskSearch} from '../model/TaskSearchVO';



@Injectable({
  providedIn: 'root'
})
export class TskMgmServiceService {

  constructor(private httpClient:HttpClient) { }

  insertTaskDetail(taskDetail:TaskDetail):Observable<any>{   
    return this.httpClient.post('http://localhost:8080/task/addTask',taskDetail);
  }

  updateTaskDetail(taskDetail:TaskDetail):Observable<any>{   
    return this.httpClient.post('http://localhost:8080/task/updateTask',taskDetail);
  }


  searchTask(taskSearch:TaskSearch,orderField:String):Observable<any>{   
    return this.httpClient.post('http://localhost:8080/task/searchTask/'+orderField,taskSearch);
  }

  loadTaskDetail(taskId:String):Observable<any>{
    return this.httpClient.get('http://localhost:8080/task/loadTask?taskId='+taskId);
  }

  loadPrtTask():Observable<any>{
    return this.httpClient.get('http://localhost:8080/task/loadPrtTask');
  }

  endTaskDetail(taskId:String):Observable<any>{
    return this.httpClient.get('http://localhost:8080/task/endTask/'+taskId);
  }


}
