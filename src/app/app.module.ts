import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { QRScanner } from '@ionic-native/qr-scanner';
import { QRCodeModule } from 'angular2-qrcode';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {CoursesPage} from '../pages/courses/courses';
import {LoginPage} from "../pages/login/login";
import { CourseDetailsPage } from "../pages/courseDetails/courseDetails";
import { QrScannerPage } from "../pages/qr-scanner/qr-scanner";
import { SettingsPage } from "../pages/settings/settings";
import { QrDisplayerPage } from "../pages/qr-displayer/qr-displayer";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../providers/rest/rest';
import {OneSignal} from "@ionic-native/onesignal";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {CodePush} from "@ionic-native/code-push";
import {AppVersion} from "@ionic-native/app-version";
import { StorageProvider } from '../providers/storage/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CoursesPage,
    CourseDetailsPage,
    QrScannerPage,
    SettingsPage,
    QrDisplayerPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    QRCodeModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CoursesPage,
    CourseDetailsPage,
    QrScannerPage,
    SettingsPage,
    QrDisplayerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    OneSignal,
    GoogleAnalytics,
    CodePush,
    AppVersion,
    Camera,
    QRScanner,
    StorageProvider,
  ]
})
export class AppModule {}
