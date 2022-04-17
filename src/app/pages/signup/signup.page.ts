import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  section: string;
  title: string;

  post_form: FormGroup;
  event_form: FormGroup;
  card_form: FormGroup;
  service:any;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  selected_image : any;

  deviceToken:string;
  constructor(
    // public navParams: NavParams,
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util : UtilsService
  ) { }

  ngOnInit() {
    this.section = "post";
    // this.service = this.navParams.get('service');
    this.title = "Sign Up";

    // Ger device token
    this.deviceToken = localStorage.getItem('dtoken');
    console.log("set device token: ", this.deviceToken);

    this.post_form = new FormGroup({
      first_name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      phone_number: new FormControl('', Validators.required),
      signupas: new FormControl('', Validators.required)
    });
  }
 async createProfile(){
  this.util.startloading();
    console.log(this.post_form.value);
    let form_data= this.post_form.value;

    this.wordpressService.createUserProfile(form_data, this.deviceToken)
    .subscribe(async (res :any)=> {
         console.log(res);
        this.util.dismisloading();
         let alert = await this.alertCtrl.create({
           cssClass: 'category-prompt',
           message:"Profile Created successfully.",
           buttons: [{
            text: 'Ok',
            handler: data => {
              // Redirect to login MovePage
              this.nav.navigateForward("login");
            }
          }]
         });
         alert.present();
     },
     err => {
     this.util.dismisloading();
     this.util.toast("Email id already exist!")
     })
  }
  closeModal(){
    this.nav.back();
  }
}
