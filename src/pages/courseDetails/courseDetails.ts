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
  assignments: Array<Object>;
  currentSortId: number;

  courseId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider){
    this.courseId = navParams.get('courseId');
    this.getCourseDetails(this.courseId);
  }

  sortAssignments(orderId: number){
    if(orderId === this.currentSortId){
      this.assignments.reverse();
    }else if(orderId === 0){
      this.assignments.sort(this.sortByDateDue);
    }else{
      this.assignments.sort(this.sortByGrade);
    }
    this.currentSortId = orderId;
  }

  sortByDateDue(a, b){
    a = new Date(a.dateAssigned);
    b = new Date(b.dateAssigned);
    return b.getTime() - a.getTime();
  }

  sortByGrade(a, b){
    a=a.credit;
    b=b.credit;
    if(a.charAt(a.length - 1) === '%'){
      a=parseInt(a.substr(0, a.length-1));
    }else{
      a=-1;
    }

    if(b.charAt(b.length - 1) === '%'){
      b=parseInt(b.substr(0, b.length-1));
    }else{
      b=-1;
    }
    return a-b;
  }

  getCourseDetails(id: string){
    this.restProvider.getCourseInformation(id)
      .subscribe(
        (res) => {
          res = allParse(res);
          console.log("Course: ", res);
          this.course = res.data;
          this.assignments = res.data.assignments;
          this.sortAssignments(0);
        },

        (err) => {
          console.log("Course Error: ",err);
        }
      )
  }

  dateFormat(date: string){
    const dueDate = new Date(date);
    return `${dueDate.getMonth()}/${dueDate.getDate()}`
  }
}
