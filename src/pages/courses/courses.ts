import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {Observable} from "rxjs/Observable";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {
  selectedItem: any;
  courses: object[];

  getCourses(): Observable<object[]> {
    this.restProvider.getCoursesList()
      .subscribe(data => {
        console.log(data);
        this.courses = data.data;
      });
    return null;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ionViewWillEnter() {
    if (!RestProvider.areCredsAvailable()) {
      this.navCtrl.push(LoginPage);
    } else {
      this.getCourses();
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(CoursesPage, {
      item: item
    });
  }

  doRefresh(refresher) {
    this.getCourses();
    refresher.complete();
  }
}
