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
  courses: any[];
  shownItems: Map<String, boolean> = new Map();

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
    if (RestProvider.areCredsAvailable()) {
      if (this.courses == null) this.refreshAll();
    } else {
      this.navCtrl.push(LoginPage);
    }
  }

  itemTapped(event, item) {
    this.shownItems.set(item.name, !this.shownItems.get(item.name));
    if (item.assignments == null) {
      let loadingAssignmentsTest = [];
      loadingAssignmentsTest[0]= {};
      loadingAssignmentsTest[0].name = "Loading...";

      item.assignments = loadingAssignmentsTest;
      this.restProvider.getCourseInformation(item.id).subscribe(
        data => {
          item.assignments = data.data.assignments;
          console.log(data.data.assignments);
          if (item.assignments[0] == null) {
            item.assignments[0] = {};
            item.assignments[0].name = "No Assignments";
          }
        });
    }
  }

  refreshAll() {
    this.getCourses();
  }

  doRefresh(refresher) {
    this.refreshAll();
    refresher.complete();
  }
}
