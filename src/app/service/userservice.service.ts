import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserVO} from '../model/UserVO';
import {UserResultVO} from '../model/UserResultVO';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  constructor(private httpClient:HttpClient) { }

  insertUserDetail(userDetail:UserVO):Observable<any>{   
    return this.httpClient.post('http://localhost:8080/user/addUser',userDetail);
  }

  updateUserDetail(userDetail:UserVO):Observable<any>{   
    return this.httpClient.post('http://localhost:8080/user/updateUser',userDetail);
  }


  sortUserDetails(sortFiled:String):Observable<any>{   
    return this.httpClient.get('http://localhost:8080/user/sortUser/'+sortFiled);
  }

  loadUserDetails(userId:String):Observable<any>{
    return this.httpClient.get('http://localhost:8080/user/loadUser/'+userId);
  }

  deleteUserDetail(userId:String):Observable<any>{
    return this.httpClient.get('http://localhost:8080/user/deleteUser/'+userId);
  }

}
