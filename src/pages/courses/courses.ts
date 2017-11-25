import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {Observable} from "rxjs/Observable";
import {LoginPage} from "../login/login";
import {CourseDetailsPage} from "../courseDetails/courseDetails";

@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {
  selectedItem: any;
  courses: any[];

  getCourses(refresher?): Observable<object[]> {
    this.restProvider.getCoursesList()
      .subscribe(data => {
        console.log(data);
        this.courses = data.data;
        if (refresher != null) refresher.complete();
      });
    return null;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ionViewWillEnter() {
    if (RestProvider.areCredsAvailable()) {
      if (this.courses == null) this.doRefresh();
    } else {
      this.navCtrl.push(LoginPage);
    }
  }

  itemTapped(event, item) {
    if (item.assignments == null) {
      this.navCtrl.push(CourseDetailsPage, {courseId: item.id})
    }
  }

  doRefresh(refresher?) {
    this.getCourses(refresher);
  }
}
