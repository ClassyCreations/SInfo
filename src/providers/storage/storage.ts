import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as Rx from "rxjs/Observable";

@Injectable()
export class StorageProvider {

  constructor(private storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  clear(){
    this.storage.clear();
  }

  getKey(key){
    return this.storage.get(key);
  }

  setValue(key, value){
    this.storage.set(key, value);
  }

  getUserInfo(){
    let info = {username: null, userId: null, district: null, yearOfGrad: null, schoolName: null, grade: null};
    return Rx.Observable.create(observer => {
      this.storage.forEach((value, key) => {
        console.log(value, key);
        if(key === 'username'){
          info.username = value;
        }
        if(key === 'districtId'){
          info.district = value;
        }
        if(key === 'userId'){
          info.userId = value;
        }
        if(key === 'yearOfGrad'){
          info.yearOfGrad = value;
        }
        if(key === 'schoolName'){
          info.schoolName = value;
        }
        if(key === 'gradeLevel'){
          info.grade = value;
        }
      }).then(() => {
        observer.next(info);
      })
    })
  }
}
