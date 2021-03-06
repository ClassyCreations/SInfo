import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import { HomePage } from "../home/home";
import { ApiTesterPage } from "../api-tester/api-tester";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData = {username: "", password: "", districtId: ""};
  loginFailed: boolean = false;
  isLoading: boolean = false;

  districtPattern: RegExp = /[a-z]{2}-[a-z]+/i;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider, private changeRef: ChangeDetectorRef) {

  }

  login() {
    if (this.userData.username != "" && this.userData.password != "" && this.userData.districtId != "") {
      console.log("Attempting login with " + this.userData);
      this.loginFailed = false;
      this.isLoading = true;

      this.restProvider.attemptLogin(this.userData.username.toLowerCase(), this.userData.password, this.userData.districtId.toLowerCase())
        .subscribe((res) => {
            console.log("Attemped Login: ",res);
            this.isLoading = false;
            if(res){
              this.navCtrl.setRoot(HomePage);
            }else{
              this.loginFailed = true;
              this.changeRef.detectChanges();
            }
        });
    }
  }

  testApi(){
    this.navCtrl.setRoot(ApiTesterPage);
  }
}
