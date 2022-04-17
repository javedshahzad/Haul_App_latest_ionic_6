import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {
  html: any;

  constructor(
    public navCtrl: NavController, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    private domSanitizer: DomSanitizer,
    private util :UtilsService
  ) { }

  ngOnInit() {
    console.log('fasfaf AboutusPage');
this.util.startloading()

    this.wordpressService.getAboutUs()
    .subscribe((res:any) => {
  this.util.dismisloading()

      this.html = this.domSanitizer.bypassSecurityTrustHtml(res.json());
    } ,
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
