import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Project} from '../model/ProjectVO';

import {ProjectResultVO} from '../model/ProjectResultVO';

@Injectable({
  providedIn: 'root'
})
export class ProjectserviceService {

  constructor(private httpClient:HttpClient) { }

  insertPrjDetail(project):Observable<any>{   
    return this.httpClient.post('http://localhost:8080/project/addProject',project);
  }

  updateProjectDetail(project:Project):Observable<any>{   
    return this.httpClient.post('http://localhost:8080/project/updateProject',project);
  }


  sortProjectDetails(sortFiled:String):Observable<any>{   
    return this.httpClient.get('http://localhost:8080/project/sortProject/'+sortFiled);
  }

  loadProjectDetails(projectId:String):Observable<any>{
    return this.httpClient.get('http://localhost:8080/project/loadProject/'+projectId);
  }

  suspendProjectDetail(projectId:String):Observable<any>{
    return this.httpClient.get('http://localhost:8080/project/suspendProject/'+projectId);
  }
}
