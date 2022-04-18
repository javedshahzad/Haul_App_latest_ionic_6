import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-customer-profile-settings',
  templateUrl: './customer-profile-settings.page.html',
  styleUrls: ['./customer-profile-settings.page.scss'],
})
export class CustomerProfileSettingsPage implements OnInit {
  ps_form: FormGroup;
  user_id: any;
  userStoredData: any;

  userName: string;
  userEmail: string;
  userPhone: string;
  userId: number;
  constructor(
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public alertCtrl: AlertController,
    private util : UtilsService,
    private navCtrl : NavController
  ) { }

  ngOnInit() {
    this.ps_form = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
      userEmail: new FormControl('', Validators.required),
      userPhone: new FormControl('', Validators.required),
    });

    this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(this.userStoredData){
      this.user_id = this.userStoredData.user_id;

      this.util.startloading();

      this.wordpressService.getUserProfile(this.user_id)
      .subscribe(res => {
           this.userName = JSON.parse(res['_body']).first_name;
           this.userEmail = JSON.parse(res['_body']).email;
           this.userPhone = JSON.parse(res['_body']).phone_number;

           this.util.dismisloading();
       },
       err => {
        this.util.dismisloading();
       })

    }
  }

  resetFields(){
    this.ps_form.reset();
  }

  updatePro(value){

    if(this.user_id!=''){
      console.log('formdata: ', value);
      this.util.startloading();

    
      this.wordpressService.updateProfile(value.userName,value.userPhone,this.user_id)
      .subscribe(async res => {
        this.util.dismisloading();
          let alert =await this.alertCtrl.create({
            message: 'Profile updated successfully!',
            buttons: ['OK']
          });
          alert.present();
       },
       err => {
        this.util.dismisloading();
       })
    }
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerProfileSettingsPage');
  }
  back(){
    this.navCtrl.back();
  }
}
