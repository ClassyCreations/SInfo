import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  static username: string;
  static password: string;
  static districtId: string;

  static areCredsAvailable(): boolean {
    return (RestProvider.username != null && RestProvider.password != null && RestProvider.districtId != null);
  }

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getCoursesList() {
      return this.http.get<JSONResponse>("https://aspencheck.herokuapp.com/api/v1/" + RestProvider.districtId + "/aspen/course", {
        headers: new HttpHeaders().set('ASPEN_UNAME', RestProvider.username).set('ASPEN_PASS', RestProvider.password),
      })
  }

}

interface JSONResponse {
  data: any;
  error: any;
  asOf: number;
}
