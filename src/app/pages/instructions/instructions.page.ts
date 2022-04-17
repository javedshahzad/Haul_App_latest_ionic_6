import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
})
export class InstructionsPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private modal: ModalController
  ) { }

  ngOnInit() {
  }

  conatctHaul(){
    console.log("contact click!");
    this.navCtrl.navigateForward("contactus");
  }

  public closeModal(){
    this.modal.dismiss();
  }
}
