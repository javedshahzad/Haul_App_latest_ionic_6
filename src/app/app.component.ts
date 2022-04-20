import { Component } from '@angular/core';
import { AlertController, LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { WordpressService } from './providers/wordpress.service';
import { Device } from '@ionic-native/device/ngx'; 
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public buttonClicked: boolean = false;
  public buttonClicked2: boolean = false;

  deviceData: any = [];

  // make HelloIonicPage the root (or first) page

  pages: Array<{title: string, url: any}>;
  pagesV: Array<{title: string, url: any}>;
  pagesQ: Array<{title: string, url: any}>;
  pagesQ2: Array<{title: string, url: any}>;
  displayname:string; 
  isLoggedin:boolean = false;
  userStoredData: any;
  userRole: string;
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public wordpressService: WordpressService,
    public alertCtrl: AlertController,
    // public inAppBrowser: InAppBrowser,
    public loadingCtrl: LoadingController,
    // private androidFullScreen: AndroidFullScreen,
    private device: Device,
    public fb: Firebase,
    private nav : NavController,
    private router: Router,
  ) {
      // Initialize Firebase
    let config = {
      apiKey: "AIzaSyAFhhDfjdGIpxmgvjpHFbHEKratu-iYVrg",
      authDomain: "haul-1524551148276.firebaseapp.com",
      databaseURL: "https://haul-1524551148276.firebaseio.com",
      projectId: "haul-1524551148276",
      storageBucket: "haul-1524551148276.appspot.com",
      messagingSenderId: "1052633147602"
    };
    firebase.initializeApp(config);
    this.initializeApp()
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.show();
      this.statusBar.backgroundColorByHexString('#19385d');

      this.fb.onNotificationOpen().subscribe(
  			async (notification) => {
            let activeView = this.router.url;

            console.log('activeView: ',activeView);
            if(activeView){
              // this.router.url === '/home'
              let currentPage =this.router.url;
              if(notification.source=='bid_page'){
                  if(currentPage!='orderlist'){

                      let alert =await this.alertCtrl.create({
                      backdropDismiss: false,
                      header: 'Notification',
                      message: notification.msgshow,
                      buttons: [
                        {
                          text: 'Close',
                          handler: () => {
                            console.log('Cancel clicked');
                          }
                        },
                        {
                          text: 'View',
                          handler: () => {
                            this.nav.navigateForward("orderlist");
                          }
                        }
                      ]
                      });
                      alert.present();
                  }
                  else{
                    let alert =await this.alertCtrl.create({
                      backdropDismiss: false,
                      header: 'Notification',
                      message: notification.msgshow,
                      buttons: [
                        {
                          text: 'Close',
                          handler: () => {
                            console.log('Cancel clicked');
                          }
                        },
                        {
                          text: 'View',
                          handler: () => {
                            this.nav.navigateRoot("walkthrough");
                            // this.nav.push(OrderlistPage);
                          }
                        }
                      ]
                      });
                      alert.present();
                    

                  }
              }
              else if(notification.source=='chat'){
                  if(currentPage!='chat'){
                      let alert =await this.alertCtrl.create({
                        header: 'Notification',
                        message: notification.msgshow,
                        buttons: ['OK']
                      });
                      alert.present();
                  }
              }
              else{
                let alert =await this.alertCtrl.create({
                  backdropDismiss: false,
                  header: 'Notification',
                  message: notification.msgshow,
                  buttons: ['OK']
                });
                alert.present();
              }
            }
  			},
  			error => {
  				console.error('Error getting the notification', error);
        });
        
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // this.statusBar.hide();
      // this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();

      this.fb.grantPermission();

      //-------- Get firebase token

      this.fb.getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        localStorage.setItem('dtoken',token);
      }) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token', error));

    this.fb.onTokenRefresh()
      .subscribe((token: string) => {
        console.log(`Got a new token ${token}`);
        localStorage.setItem('dtoken',token);
      });

      //-------------------------
      console.log('PLATFORM: ',this.platform);

      if (this.platform.is('android')) {
        // this.androidFullScreen.isImmersiveModeSupported()
        // .then(() => console.log('Immersive mode supported'))
        // .catch(err => console.log(err));
     }


    });

    this.pages = [
              { title: "Home",url: "walkthrough" },
              { title: "About Us",  url: "aboutus" },
              { title: "Profile Settings",  url: "customer-profile-settings" },
              { title: "Change Password",  url: "changepassword" },
              // { title: "Orders",  url: OrderlistPage },
              // { title: "Messages",  url: MessagesPage },
              // { title: "Settings", url: SettingPage },
            ];

    this.pagesV = [
              { title: "Customer Messages",url: "MessagesPage" },
              { title: "Work Orders",url: "VendorordersPage" },
              { title: "Manage Services Provided",url: "ServicesPage" },
              { title: "Service Provider Profile",url:  "VendorProfilesettingsPage"},
              { title: "Resources",url: "ResourcesPage" },
              { title: "Account Settings",url: "VendoraccountPage" },
              { title: "Contact HAUL",url: "ContactusPage" },
            ];

    this.pagesQ = [
              { title: "About Us",url: "aboutus" },
              { title: "FAQs",url: "faq" },
              // { title: "Become a Hauler",url: BecomehaulerPage },
            ];

        // this.pagesQ2 = [
        //   { title: "FAQs For Customer",url: FaqPage },
        //   { title: "FAQs For Service Provider",url: FaqvendorPage },
        //   // { title: "Become a Hauler",url: BecomehaulerPage },
        // ];

    console.log('App loaded');

    // Check role of logged in user
    let lstorage = localStorage.getItem('userStoredData');

    if(lstorage){
      this.userStoredData = JSON.parse(lstorage);

      console.log(this.userStoredData);
      if(this.userStoredData==undefined){
        this.menu.enable(false, 'quick-menu');
        this.menu.enable(false, 'customer-menu');
      }
      else{
        this.userRole = this.userStoredData['role'];
        console.log(this.userRole);
        if(this.userRole=='vendor'){
          this.menu.enable(false, 'quick-menu');
          this.menu.enable(false, 'customer-menu');
        }
        else if(this.userRole == "customer"){
          this.menu.enable(true, 'customer-menu');
          this.menu.enable(false, 'quick-menu');
        }
        else{
          this.menu.enable(false, 'quick-menu');
          this.menu.enable(false, 'customer-menu');
        }
      }
    }
    else{
      this.menu.enable(false, 'quick-menu');
      this.menu.enable(false, 'customer-menu');
    }
  }

  onButtonClick() {
    this.buttonClicked = !this.buttonClicked;
  }
  onButtonClick2() {
    this.buttonClicked2 = !this.buttonClicked2;
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.navigateForward(page.url);
  }

  async logOut(){
    this.menu.close();

    let alert =await this.alertCtrl.create({
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

            this.removeToken(user_id);

            this.wordpressService.userLogoutToken(user_id)
              .subscribe(res => { console.log("LG!"); })

               this.nav.navigateRoot("walkthrough");
            localStorage.removeItem('userStoredData');
          
           
          }
        }
      ]
    });
   await alert.present();
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
}
