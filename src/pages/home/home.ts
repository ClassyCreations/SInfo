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

  announcements: Array<any> = [];

  scheduleError: boolean = false;
  announcementsError: boolean = false;

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
}
