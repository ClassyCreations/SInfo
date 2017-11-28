import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Rx from "rxjs/Observable";
import { allParse } from '../../lib/json';
import { Storage } from '@ionic/storage';

import request from 'request';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class RestProvider {
  static username: string;
  static password: string;
  //TODO: Change this so it does not have a default and the user enters their own district
  static districtId: string;

  credsObservable: Subscription;
  credFinished: boolean = false;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello RestProvider Provider');
    this.areCredsAvailable();
  }

  areCredsAvailable(): Rx.Observable<any> {
    return Rx.Observable.create(observable => {
      if(this.credFinished){
        observable.next(true);
      }else {
        this.credsObservable = this.checkSetUserCredsFromMemory().subscribe(
          (res) => {
            observable.next(res || RestProvider.username != null && RestProvider.password != null && RestProvider.districtId != null);
            this.credFinished = true;
          }
        )
      }
    })
  }

  checkSetUserCredsFromMemory(): Rx.Observable<any> {
    return Rx.Observable.create(observer => {
      console.log("UserCreds: ",this.storage.get('userCreds'));
      this.storage.get('userCreds')
        .then((userCreds) => {
          console.log("UserCreds: ",userCreds);
          if(userCreds){
            RestProvider.username = userCreds.username;
            RestProvider.password = userCreds.password;
            RestProvider.districtId = userCreds.districtId;
            observer.next(true);
          }else{
            observer.next(false);
          }
        });
    });
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
    return Rx.Observable.create(observer => {
      this.areCredsAvailable().subscribe((res) => {
        if(res){
          const options: Object = {
            url: `https://aspencheck.herokuapp.com/api/v1/${RestProvider.districtId}/aspen/schedule`
          };

          //TODO: This needs to be changed such that the districtId is available
          //For now the check for districtId is simply bypassed and ma-melrose is used
          if(typeof RestProvider.districtId === 'undefined'){
            observer.error(false);
          }else{
            request(options, (err, res, body) => {
              if(err){
                observer.error(true);
              }else{
                observer.next({res: res, body: allParse(body)});
              }
              observer.complete();
            })
          }
        }else{

        }
      });
    });
  }

  getAnnouncements(){
    return Rx.Observable.create(observer => {
      this.areCredsAvailable().subscribe((res) => {
        const options: Object = {
          url: `https://aspencheck.herokuapp.com/api/v1/${RestProvider.districtId}/announcements`
        };

        //TODO: This needs to be changed such that the districtId is available
        //For now the check for districtId is simply bypassed and ma-melrose is used
        if(typeof RestProvider.districtId === 'undefined'){
          observer.error(false);
        }else{
          request(options, (err, res, body) => {
            if(err){
              observer.error(true);
            }else{
              observer.next({res: res, body: allParse(body)});
            }
            observer.complete();
          })
        }
      })
    })
  }
}

interface JSONResponse {
  data: any;
  error: any;
  asOf: number;
}
