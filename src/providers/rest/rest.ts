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

  static areCredsAvailable() {
    return (RestProvider.username != null && RestProvider.password != null);
  }

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getCoursesList() {
      return this.http.get<JSONResponse>("https://aspencheck.herokuapp.com/api/v1/ma-melrose/aspen/course", {
        headers: new HttpHeaders().set('ASPEN_UNAME', 'USERNAME').set('ASPEN_PASS', 'PASSWORD'),
      })
  }

}

interface JSONResponse {
  data: any;
  error: any;
  asOf: number;
}
