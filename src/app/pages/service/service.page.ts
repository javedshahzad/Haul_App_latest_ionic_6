import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  lastSlide = false;
  services:any;
  isLoggedin:boolean = false;
  userStoredData: any;
  userRole: string;
  post_form: FormGroup;

  dataStatus: any;

  s_lo: boolean= false;
  s_pd: boolean= false;
  s_fm: boolean= false;
  s_sm: boolean= false;
  constructor(
    public nav: NavController,
    public wordpressService: WordpressService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private util:UtilsService
  ) { }

  ngOnInit() {
    this.post_form = new FormGroup({
      s_laboronly: new FormControl(),
      s_pickupdelivey: new FormControl(),
      s_smallmove: new FormControl(),
      s_fullmove: new FormControl(),
  });

  let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
  if(userStoredData){
    var vendor_id = userStoredData.user_id;
  }

this.util.startloading();

  this.wordpressService.getVendorActivatedServices(vendor_id)
      .subscribe((res:any) => {
        //loading.dismiss();
        this.util.dismisloading();
        let data = res.json();

        console.log(data);

        this.dataStatus = data.service_setting_data_status;

        if(data.vendor_labor_only==1){
          this.s_lo = true;
        }
        else{
          this.s_lo = false;
        }
        if(data.vendor_full_delivery==1){
          this.s_fm = true;
        }
        else{
          this.s_fm = false;
        }
        if(data.vendor_small_delivery==1){
          this.s_sm = true;
        }
        else{
          this.s_sm = false;
        }
        if(data.vendor_pickup==1){
          this.s_pd = true;
        }
        else{
          this.s_pd = false;
        }
  },
  err => {
    this.util.dismisloading();
  })
  }
  openVendorTruckonlyPage(service){
    this.nav.navigateForward("VendorTruckonlyPage");
  }
  openVendorPickupPage(service){
    this.nav.navigateForward("VendorPickupPage");
  }
  openVendorMovePage(service){
    this.nav.navigateForward("VendorMovePage");
  }
  openVendorSmallMovePage(service){
    this.nav.navigateForward("VendorSmallmovePage");
  }

  contactHaul(){
    this.nav.navigateForward("contactus");
  }
back(){
  this.nav.back();
}
  activateServices(){
    let form_data = this.post_form.value;
    console.log(form_data);

    this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let vendor_id = this.userStoredData['user_id'];
    console.log("Vendor Id:", vendor_id);


    this.util.startloading();

    this.wordpressService.activateServices(form_data,vendor_id)
    .subscribe(res => {
      this.util.dismisloading();
         console.log("success");
         this.ngOnInit();
     })
  }

  vendorResources(){
    this.nav.navigateForward("resources");
  }
}
