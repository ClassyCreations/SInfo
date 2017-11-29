import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Rx from "rxjs/Observable";
import { allParse } from '../../lib/json';
import { Storage } from '@ionic/storage';

import request from 'request';
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

  attemptLogin(username: string, password: string, districtId: string): Rx.Observable<any> {
    return Rx.Observable.create(observable => {
      const options: Object = {
        url: `https://aspencheck.herokuapp.com/api/v1/${districtId}/aspen/checkLogin`,
        headers: {
          "ASPEN_UNAME": username,
          "ASPEN_PASS": password,
        }
      };

      request(options, (err, res, body) => {
        console.log(res);
        if(err){
          observable.next(false);
        }else if(res.statusCode !== 200){
          observable.next(false);
        }else{
          body = allParse(body);
          if(body.data){
            RestProvider.username = username;
            RestProvider.password = password;
            RestProvider.districtId = districtId;
            this.storage.set('username', username);
            this.storage.set('password', password);
            this.storage.set('districtId', districtId);
          }
          observable.next(body.data);
        }
      })
    })
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
      console.log("UserCreds: ", this.storage.get('userCreds'));
      this.storage.forEach((value, key) => {
        console.log(value, key)
        if(key === 'username'){
          RestProvider.username = value;
        }
        if(key === 'password'){
          RestProvider.password = value;
        }
        if(key === 'districtId'){
          RestProvider.districtId = value;
        }
      }).then(() => {
          console.log("Stuff: ",RestProvider.username, RestProvider.password, RestProvider.districtId);
          if(!(RestProvider.username && RestProvider.password && RestProvider.districtId)){
            observer.next(false);
          }else{
            observer.next(true);
          }
        });
    })
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
