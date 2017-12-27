import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-qr-displayer',
  templateUrl: 'qr-displayer.html',
})
export class QrDisplayerPage {
  title: String = "placeholder";
  value: String = "Stuff?";
  content: String = "Placeholder Mk.2";

  constructor(public navCtrl: NavController, public navParams: NavParams, private el: ElementRef) {

  }

  ngAfterViewChecked() {
    //Make sure that qr code is a square
    const ref = this.el.nativeElement.querySelector('.qrContent');
    const width = ref.getBoundingClientRect().width-26;
    const qr = this.el.nativeElement.querySelector('.qr');
    qr.style.height = `${width}px`;
    qr.style.width = `${width}px`;
    qr.children[0].style.height = `${width}px`;
    qr.children[0].style.width = `${width}px`;
    console.log(qr);
  }

  setValue(newValue){
    this.value = newValue;
  }
}
