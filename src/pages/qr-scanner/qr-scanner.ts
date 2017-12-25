import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@Component({
  selector: 'page-qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QrScannerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrScanner: QRScanner) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrScannerPage');
    this.setupCamera();
  }

  setupCamera(){
    // Optionally request the permission early
    console.log("Initializing Camera");
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

          // show camera preview
          this.qrScanner.show();
          window.document.querySelector('ion-page').classList.add('transparentBody');

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          console.log("Failed to authorize camera");
          this.qrScanner.openSettings()
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          console.log("Authorization was differed");
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
}
