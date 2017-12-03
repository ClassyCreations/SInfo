import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {RestProvider} from "../providers/rest/rest";
import {LoginPage} from "../pages/login/login";
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

import { HomePage } from '../pages/home/home';
import { CoursesPage } from '../pages/courses/courses';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public restProvider: RestProvider, private storage: Storage, private oneSignal: OneSignal) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Schedule', component: HomePage, icon: 'calendar' },
      { title: 'Courses', component: CoursesPage, icon: 'briefcase' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      this.oneSignal.startInit('8876072d-3330-40b6-baf9-fb953d06ae29', '193559139683');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });
      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();

      this.restProvider.areCredsAvailable().subscribe(
        (res) => {
          console.log("User creds loaded from localStorage: "+res);
          if(res){
            console.log("DistrictId: ",RestProvider.districtId);
            this.splashScreen.hide();
          }else{
            this.nav.push(LoginPage);
            this.splashScreen.hide();
          }
        }
      );
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    RestProvider.username = null;
    RestProvider.password = null;
    RestProvider.districtId = null;
    this.storage.clear();
    this.nav.push(LoginPage);
  }
}
