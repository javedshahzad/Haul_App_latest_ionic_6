import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-readme',
  templateUrl: './readme.page.html',
  styleUrls: ['./readme.page.scss'],
})
export class ReadmePage implements OnInit {

  constructor(
    private nav: NavController
  ) { }

  ngOnInit() {
  }
  vendorAccountLink(){  
    this.nav.navigateForward("VendoraccountPage");
  }
  back(){
    this.nav.back();
  }
}
