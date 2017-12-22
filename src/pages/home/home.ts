import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isSchool: boolean;
  blockOrder: Array<string> = [];
  currentBlockNumber: number;
  currentDay: number = 0;

  dayList: Object[][];
  daysOrder: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  announcements: Array<any> = [];

  scheduleError: boolean = false;
  announcementsError: boolean = false;
  dayScheduleExpanded: boolean = false;

  scheduleProvider: Observable<any>;
  announcementsProvider: Observable<any>;

  constructor(public navCtrl: NavController, public restProvider: RestProvider, private changeRef: ChangeDetectorRef) {

  }

  ionViewWillEnter(){
    this.scheduleProvider = this.restProvider.getSchedule();
    this.subBockOrder();

    this.announcementsProvider = this.restProvider.getAnnouncements();
    this.subAnnouncements();
  }

  subBockOrder(){
    this.scheduleProvider.subscribe(
      (res) => {
        this.scheduleError = false;
        const body = res.body;
        this.blockOrder = body.data.blockOrder || [];
        this.currentDay = body.data.day || 0;
        this.isSchool = body.data.classInSession || false;
        this.currentBlockNumber = body.data.blockOfDay || 6;
        this.dayList = this.getDayOrder(body.data.dayBlockOrder);
        this.changeRef.detectChanges();
      },

      (err) => {
        this.scheduleError = true;
        console.log(err);
        this.changeRef.detectChanges();
      },
    )
  }

  refreshBlockOrder(){
    this.scheduleProvider = this.restProvider.getSchedule();
    this.subBockOrder();
  }

  subAnnouncements(){
    this.announcementsProvider.subscribe(
      (res) => {
        this.announcementsError = false;
        const body = res.body;
        this.announcements = body.data;
        this.changeRef.detectChanges();
      },

      (err) => {
        this.announcementsError = true;
        console.log(err);
        this.changeRef.detectChanges();
      }
    )
  }

  refreshAnnouncements(){
    this.announcementsProvider = this.restProvider.getAnnouncements();
    this.subAnnouncements();
  }

  toggleDaySchedule(){
    this.dayScheduleExpanded = !this.dayScheduleExpanded;
    this.changeRef.detectChanges();
  }

  getDayOrder(days): Object[][]{
    //Subtract mondayTransform from currentDay to get monday
    const mondayTransform = new Date().getDay()-1;
    let monDay = this.currentDay > mondayTransform ? this.currentDay - mondayTransform : this.currentDay - mondayTransform + 7;
    const dayArray = [];
    for(let i = 0; i < 5; i++){
      dayArray.push({dayNumber: monDay, blocks: days[monDay]});
      monDay++;
      if(monDay > 7){monDay = 1}
    }
    return dayArray;
  }
}
