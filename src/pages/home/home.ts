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
  blockOrder: Array<string>;
  currentBlockNumber: number;
  currentDay: number = 0;

  announcements: Array<any> = [];

  scheduleProvider: Observable<any>;
  announcementsProvider: Observable<any>;

  constructor(public navCtrl: NavController, public restProvider: RestProvider, private changeRef: ChangeDetectorRef) {
    this.scheduleProvider = this.restProvider.getSchedule();
    this.subBockOrder();

    this.announcementsProvider = this.restProvider.getAnnouncements();
    this.subAnnouncements();
  }

  subBockOrder(){
    this.scheduleProvider.subscribe(
      (res) => {
        const body = res.body;
        this.blockOrder = body.data.blockOrder;
        this.currentDay = body.data.day;
        this.isSchool = body.data.classInSession;
        this.currentBlockNumber = body.data.blockOfDay;
        this.changeRef.detectChanges();
      },

      (err) => {
        console.log(err);
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
        const body = res.body;
        this.announcements = body.data;
        this.changeRef.detectChanges();
      },

      (err) => {
          console.log(err);
      }
    )
  }

  refreshAnnouncements(){
    this.announcementsProvider = this.restProvider.getAnnouncements();
    this.subAnnouncements();
  }
}
