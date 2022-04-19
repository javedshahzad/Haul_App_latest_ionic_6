import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {
  resources: any;
  nores: boolean = true;
  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util: UtilsService
  ) { }

  ngOnInit() {
   this.util.startloading();
    this.wordpressService.getResources()
        .subscribe((res:any) => {
         this.util.dismisloading()
          this.resources = res.json();
          if(this.resources){
            this.nores = true;
          }
          else{
            this.nores = false;
          }
    },err=>{
      this.util.dismisloading()
      this.nores = false;
    }
    );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ResourcesPage');
  }

  viewLink(link){
    if(link!=''){
     window.open(link, '_blank','location=no,hidden=no,closebuttoncaption=Back To Resources');
     
    }
  }

  
  vendorHomeLink(){
    this.nav.navigateRoot("walkthrough");
  }
  back(){
    this.nav.back();
  }
}
