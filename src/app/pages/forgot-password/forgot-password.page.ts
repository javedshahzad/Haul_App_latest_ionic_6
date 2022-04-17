import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgot_password: FormGroup;
  main_page: { component: any };
  error_message:any = '';
  success_message:any = '';
  constructor(
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util :UtilsService,
    private navCtrl : NavController
  ) { }

  ngOnInit() {
    this.forgot_password = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  recoverPassword(){ 
    console.log(this.forgot_password.value);
    
    this.util.startloading()
    this.wordpressService.doReset(this.forgot_password.value.email)
    .subscribe((res:any) => {
      if(res.json().status=="ok"){
  this.util.dismisloading()

        this.success_message = res.json().msg;
        this.error_message = '';

      }else{
        this.error_message = "something went wrong.";
        this.success_message = '';
      }

    },
    err => {
      this.util.dismisloading()
      this.error_message ="something went wrong.";
      this.success_message = '';
    })
  }
  back(){
    this.navCtrl.back();
  }

}
