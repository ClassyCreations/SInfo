import {ChangeDetectorRef, Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import request from 'request';
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-api-tester',
  templateUrl: 'api-tester.html',
})
export class ApiTesterPage {
  districtId: string;
  username: string;
  password: string;
  formData = {district: '', username: '', password: ''};

  responses: Array<Object> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private changeRef: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApiTesterPage');
  }

  logForm(){
    this.districtId = this.formData.district;
    this.username = this.formData.username;
    this.password = this.formData.password;
    this.doTests();
  }

  doTests() {
    this.responses = [];
    const urlTests = [
      {
        url: 'https://aspencheck.herokuapp.com/api/v1/' + this.districtId + '/aspen/checkLogin',
        description: 'Login Check'
      },
      {
        url: 'http://aspencheck.herokuapp.com/api/v1/' + this.districtId + '/aspen/student',
        description: 'Student Check'
      },
      {
        url: 'https://aspencheck.herokuapp.com/api/v1/' + this.districtId + '/aspen/schedule',
        description: 'Schedule Check'
      },
      {
        url: 'https://aspencheck.herokuapp.com/api/v1/' + this.districtId + '/aspen/course',
        description: 'Courses Check'
      },
    ];

    for (let i = 0; i < urlTests.length; i++) {
      const options = {
        url: urlTests[i].url,
        headers: {
          "ASPEN_UNAME": this.username,
          "ASPEN_PASS": this.password,
        }
      };

      request(options, (err, res, body) => {
        let response: JSON;
        if (err) {
          response = err;
        } else {
          response = body;
        }
        this.responses.unshift({desc: urlTests[i].description, res: response});
        this.changeRef.detectChanges();
      })
    }
  }

  login(){
    this.navCtrl.setRoot(LoginPage);
  }
}
