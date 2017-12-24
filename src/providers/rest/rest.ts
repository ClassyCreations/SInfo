import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Rx from "rxjs/Observable";
import { allParse } from '../../lib/json';
import { Storage } from '@ionic/storage';
import * as openpgp from 'openpgp';

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
            /* // TODO Find a way to submit (headers are too short)
            this.gpgEncrypt(password).subscribe((encryptedPwd) => {
              console.log("setting password to \n" + encryptedPwd);
              this.storage.set('password', encryptedPwd);
              });
              */
            this.storage.set('password', password);
            this.storage.set('districtId', districtId);
            console.log("Executing get user info");
            this.getUserInfo().subscribe();
          }
          observable.next(body.data);
        }
      })
    })
  }

  getUserInfo(){
    console.log("Getting user info");
    return Rx.Observable.create(observer => {
      const options: Object = {
        url: `http://aspencheck.herokuapp.com/api/v1/${RestProvider.districtId}/aspen/student`,
        headers: {
          "ASPEN_UNAME": RestProvider.username,
          "ASPEN_PASS": RestProvider.password,
        }
      };

      console.log("Will stuff work?,",RestProvider.districtId && RestProvider.username && RestProvider.password);
      if(RestProvider.districtId && RestProvider.username && RestProvider.password){
        request(options, (err, res, body) => {
          if(err){
            observer.next(false);
          }else if(res.statusCode !== 200){
            observer.next(false);
          }else{
            body = allParse(body);
            console.log("User info: ",body);
            this.storage.set("userId", body.data.info.stateID);
            this.storage.set("yearOfGrad", body.data.info.yearOfGraduation);
            this.storage.set("schoolName", body.data.info.schoolName);
            this.storage.set("gradeLevel", body.data.info.gradeLevel);
            observer.next(true);
          }
        })
      }else{
        observer.next(false)
      }
    });
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
        console.log(value, key);
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
              body = allParse(body);
              if(err || body.data === null){
                observer.error(true);
              }else{
                observer.next({res: res, body: body});
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

  gpgEncrypt(msg: String): Rx.Observable<String> {
    return Rx.Observable.create( observer => {
      this.getGpgKeyFromServer("0xC8A1E2D47C35AB1C30288640940ED79CFA122C1A").subscribe((key1) => {
        const mykey = key1;
        this.getGpgKeyFromServer("0x716E07EA1891D9BF2724415A25B082C45A8DD7E5").subscribe((key2) => {
          const thekey = key2;

          let options = {
            data: msg,
            publicKeys: [
              openpgp.key.readArmored(thekey).keys[0],
              openpgp.key.readArmored(mykey).keys[0]]
          };

          openpgp.encrypt(options).then(function (ciphertext) {
            console.log(ciphertext);
            observer.next(ciphertext.data); // get raw encrypted packets as Uint8Array
          });
        });
      });
    });
  }

  getGpgKeyFromServer(query: String): Rx.Observable<openpgp.key> {
    return Rx.Observable.create(observer => {
      const hkp = new openpgp.HKP('https://pgp.mit.edu');

      let options = {
        query: query
      };

      hkp.lookup(options).then(function (key) {
        observer.next(key);
      });
    });
  }
}

interface JSONResponse {
  data: any;
  error: any;
  asOf: number;
}
