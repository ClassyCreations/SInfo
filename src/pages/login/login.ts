import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData = {username: "", password: "", districtId: ""};

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  login() {
    if (this.userData.username != "" && this.userData.password != "" && this.userData.districtId != "") {
      console.log("Attempting login with " + this.userData);
      RestProvider.username = this.userData.username;
      RestProvider.password = this.userData.password;
      RestProvider.districtId = this.userData.districtId;

      //localStorage.setItem('userCreds', JSON.stringify(this.userData)); // TODO store in encrypted fashion
      this.navCtrl.pop();
    }
  }

}
