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
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AppVersion} from "@ionic-native/app-version";
import {CodePush} from "@ionic-native/code-push";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public restProvider: RestProvider, private storage: Storage, private oneSignal: OneSignal,
              public ga: GoogleAnalytics, private appVersion: AppVersion, private codePush: CodePush) {
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

      // OneSignal
      this.oneSignal.startInit('8876072d-3330-40b6-baf9-fb953d06ae29', '193559139683');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.handleNotificationReceived().subscribe((notification) => {
        this.ga.trackEvent("notification", "received", notification.data.payload.notificationID);
      });
      this.oneSignal.handleNotificationOpened().subscribe((notification) => {
        this.ga.trackEvent("notification", "opened", notification.notification.payload.notificationID);
      });
      this.oneSignal.endInit();

      // Google Analytics
      this.ga.startTrackerWithId('UA-97256993-4')
        .then(() => {
          console.log('Google analytics is ready now');
          this.appVersion.getVersionCode().then((val) => {
            this.ga.setAppVersion(val);
          });
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e));

      this.codePush.sync({installMode: 2}).subscribe((syncStatus) => console.log(syncStatus));

      // Really launch now
      this.restProvider.areCredsAvailable().subscribe(
        (res) => {
          console.log("User creds loaded from localStorage: "+res);
          if(res){
            console.log("DistrictId: ",RestProvider.districtId);
            this.ga.setUserId(btoa(RestProvider.username));
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
