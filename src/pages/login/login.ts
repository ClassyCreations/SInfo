import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData = {username: "", password: "", districtId: ""};
  loginFailed: boolean = false;
  isLoading: boolean = false;

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
              this.navCtrl.pop();
            }else{
              this.loginFailed = true;
              this.changeRef.detectChanges();
            }
        });
    }
  }

}
