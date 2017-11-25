import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import { allParse } from "../../lib/json";

@Component({
  selector: 'page-course-details',
  templateUrl: 'courseDetails.html'
})
export class CourseDetailsPage{
  course: Object;
  assignments: Object;

  courseId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider){
    this.courseId = navParams.get('courseId');
    this.getCourseDetails(this.courseId);
  }

  getCourseDetails(id: string){
    this.restProvider.getCourseInformation(id)
      .subscribe(
        (res) => {
          res = allParse(res);
          console.log("Course: ", res);
          this.course = res.data;
          this.assignments = res.data.assignments;
        },

        (err) => {
          console.log("Course Error: ",err);
        }
      )
  }
}
