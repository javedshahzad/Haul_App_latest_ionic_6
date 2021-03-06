import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonContent, LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { Device } from '@ionic-native/device/ngx'; 
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { UtilsService } from 'src/app/providers/utils.service';
@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})
export class WalkthroughPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  lastSlide = false;
  services:any;
  isLoggedin:boolean=false;
  userStoredData: any;
  userRole: string;
  menurole: string;
  isVendor:boolean = false;
  pagesV: any=[];

  deviceData: any = [];

  constructor(
    public nav: NavController,
    public wordpressService: WordpressService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, 
    public menu: MenuController,
    private callNumber: CallNumber,
    private sms: SMS,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private device: Device,
    private util: UtilsService
  ) { }

  ngOnInit() {

    // this.menu.swipeEnable(false);
    // Check role of logged in user
    this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
   //this.userStoredData = 'vendor';
    if(this.userStoredData==undefined){

      this.isLoggedin = true;

      this.services = [
        { title: '<span class="big-font">Labor Only</span>', pagetitle: 'Labor Only', icon: 'assets/imgs/pic2.jpg', id:'16',url:"truckonly"},
        { title: '<span class="big-font">Item Delivery</span>', pagetitle: 'Item Delivery', icon: 'assets/imgs/pic3.png', id:'18',url:"pickup"},
        { title: '<span class="big-font">Junk Removal</span>', pagetitle: 'Junk Removal', icon: 'assets/imgs/pic4.jpg', id:'23',url:"smallmove"},
        { title: '<span class="big-font">Full Move</span>', pagetitle: 'Residential or Commercial', icon: 'assets/imgs/pic5.jpg', id:'17',url:"move"},
        // { title: '<span class="big-font">Donation Item (FREE!)</span>', pagetitle: 'Charity and Donation Pickup', icon: 'assets/imgs/heart.png', id:'19',url:"charitable"},
      ];

      this.menurole='';
      this.menu.enable(false, 'quick-menu');
      this.menu.enable(false, 'customer-menu');
    }
    else{
      this.isLoggedin = false;
       this.userRole = this.userStoredData['role'];
      //this.userRole = 'vendor';

      if(this.userRole == "customer"){
        this.menu.enable(true, 'customer-menu');
        this.menu.enable(false, 'quick-menu');
      }
      else if(this.userRole == "vendor"){
        this.menu.enable(false, 'customer-menu');
        this.menu.enable(false, 'quick-menu');
      }
      else{
       this.menu.enable(false, 'quick-menu');
         this.menu.enable(false, 'customer-menu');
      }

      if(this.userRole=='vendor'){
        // Vendor options comes Here
        this.services = [
                  { title: 'Order List', icon: 'assets/imgs/vendor-choices.png', id:'0',url:"vendororders"},
                  { title: 'Profile Setting', icon: 'assets/imgs/vendor-settings.png', id:'0',url:"vendorprofilesettings"},
                  { title: 'Vendor Services', icon: 'assets/imgs/vendor-services.png', id:'0',url:"service"},
              ];
        this.menurole='vendor';
        this.isVendor=true;

        this.pagesV = [
          { title: "Click Here for Step by Step setup",url: "readme", color:"secondary"},
          { title: "Customer Messages",url: "messages" ,color:"secondary"},
          { title: "Work Orders",url: "vendororders", color:"secondary" },
          { title: "Account Settings",url: "vendoraccount", color:"secondary" },
          { title: "Service Provider Profile",url:  "vendor-profilesettings", color:"secondary"},
          { title: "Manage Moving Services",url: "service" , color:"secondary"},
          { title: "Resources",url: "resources" , color:"medium"},
          { title: "FAQs",url: "faq", color:"medium" },
          { title: "About Us",url: "aboutus", color:"medium" },
          { title: "View Customer Feedback",url: "feedback", color:"secondary" },
          { title: "Contact HAUL",url: "contactus", color:"medium" },
          { title: "Change Password",  url: "changepassword", color:"medium" },
        ];

      }
      else{
        this.services = [
          { title: '<span class="big-font">Labor Only</span>', pagetitle: 'Labor Only', icon: 'assets/imgs/pic2.jpg', id:'16',url:"truckonly"},
          { title: '<span class="big-font">Item Delivery</span>', pagetitle: 'Item Delivery', icon: 'assets/imgs/pic3.png', id:'18',url:"pickup"},
          { title: '<span class="big-font">Junk Removal</span>', pagetitle: 'Junk Removal', icon: 'assets/imgs/pic4.jpg', id:'23',url:"smallmove"},
          { title: '<span class="big-font">Full Move</span>', pagetitle: 'Residential or Commercial', icon: 'assets/imgs/pic5.jpg', id:'17',url:"move"},
          // { title: '<span class="big-font">Donation Item (FREE!)</span>', pagetitle: 'Charity and Donation Pickup', icon: 'assets/imgs/heart.png', id:'19',url:"CharitablePage"},
        ];
      this.menurole='customer';

      }
    }
  }
  ionViewWillEnter() { 
    console.log("back on page");
    //this.menu.enable(false)
    setTimeout(() => {
      this.content.scrollToTop();
    }, 400)
  }

  async selectType() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Action',
      mode:"ios",
      buttons: [
        {
          text: 'Call',
          handler: () => {
            this.callHaul();
          }
        },
        {
          text: 'SMS',
          handler: () => {
            this.smsHaul();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  callHaul(){
    this.callNumber.callNumber("3362656633", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  smsHaul(){
    this.platform.ready().then(() => {
        if (this.platform.is('android')) {

          var options = {
              replaceLineBreaks: false,
              android: {
                  intent: 'INTENT'
              }
          };

          this.sms.send('3362656633', '', options);
        }
        else{
          this.sms.send('3362656633', '');
        }
    });

  }
  openMenu(evt) {
    console.log(evt);
      if(evt === "quick-menu"){
         this.menu.enable(true, 'quick-menu');
         //this.menu.enable(false, 'vendor-menu');
         this.menu.enable(false, 'customer-menu');
      }else if(evt == "customer"){
        this.menu.enable(true, 'customer-menu');
        this.menu.enable(false, 'quick-menu');
        //this.menu.enable(false, 'vendor-menu');
      }
      else if(evt == "vendor"){
        this.menu.enable(false, 'customer-menu');
        this.menu.enable(false, 'quick-menu');
        //this.menu.enable(true, 'vendor-menu');
      }
      this.menu.toggle();
  }

  removeToken(user_id) {
    this.deviceData.push({
        uuid: this.device.uuid,
        model: this.device.model,
        platform: this.device.platform,
        version: this.device.version,
    });
    this.wordpressService.updateToken(user_id, '', this.deviceData, 'logout')
      .subscribe(res => {
          console.log(res);
      });
  }

 async logOut(){
    this.menu.close();
      const alert = await this.alertCtrl.create({
        header: 'Confirm Logout',
        message: 'Are you sure to logout?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked');

              this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
              let user_id = this.userStoredData.user_id;
              this.util.startloading();
              this.removeToken(user_id);

              this.wordpressService.userLogoutToken(user_id)
                .subscribe(res => { console.log("LG!"); })
               
              localStorage.removeItem('userStoredData');
              this.nav.navigateRoot("login");
              this.util.dismisloading()
            }
          }
        ]
      });
      alert.present();
    }

    goToLogin() {
      this.nav.navigateForward("login",{queryParams:{  role: 'customer'}});
    }
  
    goToVendorLogin() {
      this.nav.navigateForward("login",{queryParams:{  role: 'vendor'}});
    }
  
    goToSignup() {
      this.nav.navigateForward("signup");
    }
  
    contactUs() {
      this.nav.navigateForward("contactus");
    }
  
    goToVendorSignup() {
      this.nav.navigateForward("vendorsignup"); 
    }
  
    openFAQ(){
      this.nav.navigateForward("faq"); 
    }
  
    openWorkOrders(){
      this.nav.navigateForward("orderlist"); 
    }
  
    openCustMsg(){
      this.nav.navigateForward("messages"); 
    }

    doSignup(service){
      console.log(service);
      this.nav.navigateForward(service.url,{queryParams:{
        service: service
      }});
    }
    openPage(page) {
      // close the menu when clicking a link from the menu
      this.menu.close();
      this.nav.navigateForward(page.url);
    }
    charitable(){
      let service={ title: '<span class="big-font">Donation Item (FREE!)</span>', pagetitle: 'Charity and Donation Pickup', icon: 'assets/imgs/heart.png', id:'19',url:"charitable"}
   
      console.log(service);
      this.nav.navigateForward(service.url,{queryParams:{
        service: service
      }});
    }
}
