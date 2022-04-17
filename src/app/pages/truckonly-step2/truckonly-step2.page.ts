import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, ModalController, NavController, NavParams, ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

import { Device } from '@ionic-native/device/ngx'; 

@Component({
  selector: 'app-truckonly-step2',
  templateUrl: './truckonly-step2.page.html',
  styleUrls: ['./truckonly-step2.page.scss'],
})
export class TruckonlyStep2Page implements OnInit {
  section: string;
  register: FormGroup;
  loading: any;
  service:any;
  categories_checkbox_open: boolean;
  categories_checkbox_result;
  selected_image : any;

  isLoggedin:boolean = false;
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: number;
  userStoredData: any;
  deviceToken:string;

  deviceData: any = [];
  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public menuCtrl: MenuController,
    private toastController: ToastController,
    private formbuilder:FormBuilder,
    private modalCtrl : ModalController,
    private util :UtilsService,
    private device: Device,
    public navParams:NavParams,
    private params:NavParams
  ) { }

  ngOnInit() {
    this.section = "post";
    this.register = this.formbuilder.group({
      password: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
    });
  }
  public closeModal(){
    this.modalCtrl.dismiss();
  }

  async doRegisterCreateOrder(){
    let source = this.params.get('source');
    console.log(source);

    // Ger device token
    this.deviceToken = localStorage.getItem('dtoken');
    console.log("set device token: ", this.deviceToken);
    //

    

    if(source=='truck'){
          let form_data1 = this.params.get('form_data');
          let vendor_id = this.params.get('vendor_id');
          this.util.startloading()

          console.log(this.register.value);
          let form_data= this.register.value;

          this.wordpressService.userLoginCreateOrder(form_data,form_data1,vendor_id,this.deviceToken)
          .subscribe(res => {
            console.log(res);
            this.util.dismisloading()
            let code = JSON.parse(res['_body']).code;
            let message = JSON.parse(res['_body']).message;


            if(code=='200'){
                let uid = JSON.parse(res['_body']).user_id;
    
                if(uid!=''){
                  this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
                  if(this.userStoredData==undefined){
                    localStorage.setItem('userStoredData', res['_body']);
                  }

                  this.updateToken(uid, this.deviceToken);
      
                  // let profileModal = this.modalCtrl.create(InstructionsPage);
                  // profileModal.onDidDismiss(data => {
                  //   this.viewCtrl.dismiss();
                  // this.appCtrl.getRootNav().push(WalkthroughPage);
                  // });
                  // profileModal.present();
                }
      
              }
              else{
            
                this.util.toast(message)
      
                // this.viewCtrl.dismiss();
              }
           },
           err => {
            this.util.dismisloading()
            this.util.toast(err.json().errormsg)
           })
    }
    if(source=='small_move'){

      let form_data1 = this.params.get('form_data1');
      let form_data2 = this.params.get('form_data');

      let vendor_id = '0';

      let photos = this.navParams.get('photos');

      let loading = this.loadingCtrl.create();
      this.util.startloading()

      console.log(this.register.value);
      let form_data= this.register.value;

          this.wordpressService.userLoginCreateSmallMove(photos,form_data,form_data1,form_data2,vendor_id,this.deviceToken)
          .subscribe(res => {
            console.log(res);
            this.util.dismisloading();
    
            let code = JSON.parse(res['_body']).code;
            let message = JSON.parse(res['_body']).message;
            if(code=='200'){
              let uid = JSON.parse(res['_body']).user_id;
    
              if(uid!=''){
                this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
                if(this.userStoredData==undefined){
                  localStorage.setItem('userStoredData', res['_body']);
                }

                this.updateToken(uid, this.deviceToken);

                // let profileModal = this.modalCtrl.create(InstructionsPage);
                // profileModal.onDidDismiss(data => {
                //   this.viewCtrl.dismiss();
                //   this.appCtrl.getRootNav().push(WalkthroughPage);
                // });
                // profileModal.present();

              }
    
            }
            else{
              this.util.toast(message)
      
              // this.viewCtrl.dismiss();
            }

           },
           err => {
            this.util.dismisloading()
            this.util.toast(err.json().errormsg)
           })
    }
    else if(source=='move'){

      let form_data1 = this.navParams.get('form_data1');
      let form_data2 = this.navParams.get('form_data2');
      let form_data3 = this.navParams.get('form_data3');
      let form_data4 = this.navParams.get('form_data');

      let vendor_id = '0';

      let photos = this.navParams.get('photos');

          let loading = this.loadingCtrl.create();
        this.util.startloading()

          console.log(this.register.value);
          let form_data= this.register.value;

          this.wordpressService.userLoginCreateOrderMove(photos,form_data1,form_data2,form_data3,form_data4,form_data,vendor_id,this.deviceToken)
          .subscribe(res => {
              console.log(res);
            this.util.dismisloading()
      
              let code = JSON.parse(res['_body']).code;
              let message = JSON.parse(res['_body']).message;
              if(code=='200'){
                let uid = JSON.parse(res['_body']).user_id;
      
                if(uid!=''){
                  this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
                  if(this.userStoredData==undefined){
                    localStorage.setItem('userStoredData', res['_body']);
                  }

                  this.updateToken(uid, this.deviceToken);

                  // let profileModal = this.modalCtrl.create(InstructionsPage);
                  // profileModal.onDidDismiss(data => {
                  //   this.viewCtrl.dismiss();
                  //   this.appCtrl.getRootNav().push(WalkthroughPage);
                  // });
                  // profileModal.present();

                }
    
            }
            else{
              this.util.toast(message)
      
              // this.viewCtrl.dismiss();
            }

           },
           err => {
            this.util.dismisloading()
            this.util.toast(err.json().errormsg)
           })
    }
    else if(source=='pickup'){

      let form_data1 = this.navParams.get('form_data1');
      let form_data2 = this.navParams.get('form_data');

      let photos = this.navParams.get('photos');

      let vendor_id = '0';

          let loading = this.loadingCtrl.create();
         this.util.startloading()

          console.log(this.register.value);
          let form_data= this.register.value;

          this.wordpressService.userLoginCreateOrderPickup(photos,form_data1,form_data2,form_data,vendor_id,this.deviceToken)
          .subscribe(res => {
            console.log(res);
            this.util.dismisloading()
    
            let code = JSON.parse(res['_body']).code;
            let message = JSON.parse(res['_body']).message;
            if(code=='200'){
              let uid = JSON.parse(res['_body']).user_id;
    
              if(uid!=''){
                this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
                if(this.userStoredData==undefined){
                  localStorage.setItem('userStoredData', res['_body']);
                }

                this.updateToken(uid, this.deviceToken);

                // let profileModal = this.modalCtrl.create(InstructionsPage);
                // profileModal.onDidDismiss(data => {
                //   this.viewCtrl.dismiss();
                //   this.appCtrl.getRootNav().push(WalkthroughPage);
                // });
                // profileModal.present();

              }
    
            }
            else{
              this.util.toast(message)
    
              // this.viewCtrl.dismiss();
            }

           },
           err => {
            this.util.dismisloading()
            this.util.toast(err.json().errormsg)
           })
    }
    else if(source=='donation'){

      let form_data1 = this.navParams.get('form_data1');
      let form_data2 = this.navParams.get('form_data');

      let photos = this.navParams.get('photos');

          let loading = this.loadingCtrl.create();
 this.util.startloading()

          console.log(this.register.value);
          let form_data= this.register.value;

          this.wordpressService.userLoginCreateOrderDonation(photos,form_data1,form_data2,form_data,this.deviceToken)
          .subscribe(res => {
            console.log(res);
          this.util.dismisloading() 

            localStorage.setItem('userStoredData', res['_body']);
            let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
            console.log(userStoredData.user_id);

            this.updateToken(userStoredData.user_id, this.deviceToken);

    
            this.util.toast("Thank You for submitting a request to have your charitable item collected.  An agent from a local charity will be in contact with you shortly.")

            // this.viewCtrl.dismiss();
            // this.appCtrl.getRootNav().push(WalkthroughPage);
            //this.appCtrl.getRootNav();

          },
          err => {
            this.util.dismisloading()
            this.util.toast(err.json().errormsg)
          })
    }

  }
  updateToken(userId, deviceID) { 
    this.deviceData.push({
        uuid: this.device.uuid,
        model: this.device.model,
        platform: this.device.platform,
        version: this.device.version,
        offset: new Date().getTimezoneOffset(),
        deviceToken: deviceID,
        logindate: new Date()
    });
    console.log(this.deviceData,'userId',deviceID,userId);
    this.wordpressService.updateToken(userId, deviceID, this.deviceData, 'login')
      .subscribe(res => {
          console.log('success');
      });  
  }
  goToForgotPassword() {
    this.modalCtrl.dismiss();
    this.nav.navigateForward("forgot-password");
  }
}
