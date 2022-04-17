import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.page.html',
  styleUrls: ['./tnc.page.scss'],
})
export class TncPage implements OnInit {
  html: any;

  constructor(
    public navCtrl: NavController, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    private domSanitizer: DomSanitizer,
    private util :UtilsService
  ) { }

  ngOnInit() {
    this.util.startloading()
    this.wordpressService.getVAgreements()
    .subscribe((res:any) => {
      this.util.dismisloading()
      this.html = res.json();

     }
     ,
     err => {
      this.loadingCtrl.dismiss();
       console.log(err);
      this.util.toast("Error accour")
     })
  }
  back(){
    this.navCtrl.back();
  }
}
