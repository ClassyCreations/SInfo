import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData = {username: "", password: "", districtId: ""};

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {

  }

  login() {
    if (this.userData.username != "" && this.userData.password != "" && this.userData.districtId != "") {
      console.log("Attempting login with " + this.userData);
      RestProvider.username = this.userData.username.toLowerCase();
      RestProvider.password = this.userData.password;
      RestProvider.districtId = this.userData.districtId.toLowerCase();

      this.storage.set('userCreds', this.userData); // TODO store in encrypted fashion
      this.navCtrl.pop();
    }
  }

}
