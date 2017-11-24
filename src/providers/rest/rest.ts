import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RestProvider {
  static username: string;
  static password: string;
  static districtId: string;

  static areCredsAvailable(): boolean {
    return (RestProvider.checkSetUserCredsFromMemory() || (RestProvider.username != null && RestProvider.password != null && RestProvider.districtId != null));
  }

  private static checkSetUserCredsFromMemory(): boolean {
    if (JSON.parse(localStorage.getItem('userCreds')) != null) {
      let userCreds = JSON.parse(localStorage.getItem('userCreds'));
      RestProvider.username = userCreds.username;
      RestProvider.password = userCreds.password;
      RestProvider.districtId = userCreds.districtId;
      return true;
    }
    return false;
  }

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getCoursesList() {
      return this.http.get<JSONResponse>("https://aspencheck.herokuapp.com/api/v1/" + RestProvider.districtId + "/aspen/course?moreData=true", {
        headers: new HttpHeaders().set('ASPEN_UNAME', RestProvider.username).set('ASPEN_PASS', RestProvider.password),
      })
  }

  getCourseInformation(courseId: string) {
    return this.http.get<JSONResponse>("https://aspencheck.herokuapp.com/api/v1/" + RestProvider.districtId + "/aspen/course/" +courseId, {
      headers: new HttpHeaders().set('ASPEN_UNAME', RestProvider.username).set('ASPEN_PASS', RestProvider.password),
    })
  }

}

interface JSONResponse {
  data: any;
  error: any;
  asOf: number;
}
