import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  cp_form: FormGroup;
  user_id: any;

  userStoredData: any;
  constructor(
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public alertCtrl: AlertController,
    private util : UtilsService,
    private navCtrl : NavController
  ) { }

  ngOnInit() {
    this.cp_form = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    });

    this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(this.userStoredData){
      this.user_id = this.userStoredData.user_id;
    }

  }
  resetFields(){
    this.cp_form.reset();
  }

 async changepwd(value){

    if(value.password!=value.confirm_password){
      let alert =await this.alertCtrl.create({
        message: 'Confirm password should be same as password!',
        buttons: ['OK']
      });
      alert.present();

      return false;
    }

    let alert =await this.alertCtrl.create({
      message: "Are you sure to change the password?",
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            if(this.user_id!=''){
              console.log('formdata: ', value);
           this.util.startloading();
            
              this.wordpressService.changePassword(value.password,this.user_id)
              .subscribe(async res => {
               this.util.dismisloading();
                  let alert =await this.alertCtrl.create({
                    message: 'Password changed successfully!',
                    buttons: ['OK']
                  });
                  alert.present();
               },
               err => {
                this.util.dismisloading();
               })
            }
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        }
      ],
      cssClass: 'comment-alert'
    });
    alert.present();
 
  }
  back(){
    this.navCtrl.back();
  }
}
