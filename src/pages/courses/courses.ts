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
    /*
    this.restProvider.getCourseInformation(item.id).subscribe(
      data => {
        item = data.data;
        console.log(item);
        this.shownItems.set(item.name, !this.shownItems.get(item.name));
      });
      */
    //TODO work on getting each click to become a request instead of one big one at render time
  }

  refreshAll() {
    this.getCourses();
  }

  doRefresh(refresher) {
    this.refreshAll();
    refresher.complete();
  }
}
