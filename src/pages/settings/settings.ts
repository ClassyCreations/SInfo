import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from "../../providers/storage/storage";
import {RestProvider} from "../../providers/rest/rest";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider) {
    this.getUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  logout(){
    RestProvider.username = null;
    RestProvider.password = null;
    RestProvider.districtId = null;
    this.storage.clear();
    this.navCtrl.push(LoginPage);
  }

  getUser(){
    this.storage.getUserInfo().subscribe((res) => {
      this.user = res;
      console.log(res);
    })
  }
}
