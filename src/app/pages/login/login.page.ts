import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { Device } from '@ionic-native/device/ngx'; 
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public login: FormGroup;
  loading: any;
  role: string;
  isCustomer: boolean=true;
  deviceToken:string;
  deviceData: any = [];
  constructor(
    private activeRoute:ActivatedRoute,
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public menuCtrl: MenuController,
    private toastController: ToastController,
    private formbuilder:FormBuilder,
    private device: Device
  ) { }

  ngOnInit() {
    // this.login = new FormGroup({
    //   email: new FormControl('', Validators.required),
    //   password: new FormControl('', Validators.required)
    // });
    this.login = this.formbuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password:[null, Validators.compose([Validators.required])],
    });
    this.activeRoute.queryParams.subscribe((res:any)=>{
      
        this.role = res.role;
        if(this.role=='customer'){
        this.isCustomer = true;
        }
        else{
        this.isCustomer = false;
        }
    })

  }

  doLogin(){
 
    const loading = this.loadingCtrl.create({
      duration:3000
    }).then(res=>{
      res.present();
    });
    

    console.log(this.login.value);
    let form_data= this.login.value;

    this.deviceToken = localStorage.getItem('dtoken');

    console.log("set device token: ", this.deviceToken);

    this.wordpressService.userLogin(form_data, this.deviceToken)
    .subscribe(res => {
        
      this.loadingCtrl.dismiss();
         localStorage.setItem('userStoredData', res['_body']);
         let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
         console.log(userStoredData.user_id);

        if (userStoredData.role=='vendor'){
            this.menuCtrl.enable(false, 'customer-menu');
        }
        if (userStoredData.role=='customer'){
          this.menuCtrl.enable(true, 'customer-menu');
        }
        else {
          this.menuCtrl.enable(false, 'customer-menu');
        }

        this.updateToken(userStoredData.user_id, this.deviceToken);

        // Redirect to home
        if(JSON.parse(res['_body']).role=='customer'){
          return this.nav.navigateRoot("WalkthroughPage");
        }
        else{
          return this.nav.navigateRoot("WalkthroughPage");
        }
     },
     err => {
      this.loadingCtrl.dismiss();
       console.log(err);
      this.presentToast("Invalid credentials!")
     })

  }

  goToVendorSignup() {
    this.nav.navigateForward("vendorsignup");
  }


  goToSignup() {
    this.nav.navigateForward("signup");
    //this.navCtrl.push(AlertDetailPage, { "title": 'Add Alert' });
  }

  goToForgotPassword() {
    this.nav.navigateForward("forgot-password");
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
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color:"primary"
    });
    toast.present();
  }
  back(){
    this.nav.back();
  }
}
