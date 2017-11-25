import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Rx from "rxjs/Observable";
import { allParse } from '../../lib/json';

import request from 'request';

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
      return this.http.get<JSONResponse>("https://aspencheck.herokuapp.com/api/v1/" + RestProvider.districtId + "/aspen/course/", {
        headers: new HttpHeaders().set('ASPEN_UNAME', RestProvider.username).set('ASPEN_PASS', RestProvider.password),
      })
  }

  getCourseInformation(courseId: string) {
    return this.http.get<JSONResponse>("https://aspencheck.herokuapp.com/api/v1/" + RestProvider.districtId + "/aspen/course/" +courseId, {
      headers: new HttpHeaders().set('ASPEN_UNAME', RestProvider.username).set('ASPEN_PASS', RestProvider.password),
    })
  }

  getSchedule(){
    const options: Object = {
      url: `https://aspencheck.herokuapp.com/api/v1/ma-melrose/aspen/schedule`
    };

    return Rx.Observable.create(observer => {
      //TODO: This needs to be changed such that the districtId is available
      //For now the check for districtId is simply bypassed and ma-melrose is used
      if(typeof RestProvider.districtId === 'undefined' && false){
        observer.error('districtId is not defined for schedule');
      }else{
        request(options, (err, res, body) => {
          if(err){
            observer.error(err);
          }else{
            observer.next({res: res, body: allParse(body)});
          }
          observer.complete();
        })
      }
    })
  }

  getAnnouncements(){
    const options: Object = {
      url: `https://aspencheck.herokuapp.com/api/v1/ma-melrose/announcements`
    };

    return Rx.Observable.create(observer => {
      //TODO: This needs to be changed such that the districtId is available
      //For now the check for districtId is simply bypassed and ma-melrose is used
      if(typeof RestProvider.districtId !== 'undefined' && false){
        observer.error('districtId is not defined for announcements');
      }else{
        request(options, (err, res, body) => {
          if(err){
            observer.error(err);
          }else{
            observer.next({res: res, body: allParse(body)});
          }
          observer.complete();
        })
      }
    })
  }
}

interface JSONResponse {
  data: any;
  error: any;
  asOf: number;
}
