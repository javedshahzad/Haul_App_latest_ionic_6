import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.page.html',
  styleUrls: ['./terms-of-service.page.scss'],
})
export class TermsOfServicePage implements OnInit {

  constructor(private nav:NavController) { }

  ngOnInit() {
  }
  back(){
    this.nav.navigateRoot("walkthrough")
  }
}
