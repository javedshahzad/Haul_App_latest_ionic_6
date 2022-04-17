import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { UtilsService } from 'src/app/providers/utils.service';
import { TruckonlyStep2Page } from '../truckonly-step2/truckonly-step2.page';
import { TruckonlySignupPage } from '../truckonly-signup/truckonly-signup.page';
@Component({
  selector: 'app-donationitem',
  templateUrl: './donationitem.page.html',
  styleUrls: ['./donationitem.page.scss'],
})
export class DonationitemPage implements OnInit {
  section: string;
  pickup_item_form: any;
  donation_item_form: FormGroup;
  card_form: FormGroup;
  service:any;
  relationship:any;
  categories_checkbox_open: boolean;
  categories_checkbox_result;
  selected_image: any;
  show_datepicker: boolean= false;

  isLoggedin:boolean = false;
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: number;
  userStoredData: any;

  videoURI:any;
  imageFileName:any;
  pagetitle: string;

  imageURI:any;

  inprocess:boolean = false;
  uploaded:any = '';

  progress:any = 0;

  du:boolean = true;

  public photos : any;
  public filenames : any;
  file_name: any = '';
  form_data: any;
  
  constructor(
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private transfer: FileTransfer,
    private camera: Camera,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private util : UtilsService,
    private nav : NavController
  ) { 
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.form_data=res.form_data
      this.pagetitle = res.pagetitle1
    })


   

    this.donation_item_form = new FormGroup({
      imagepath: new FormControl(),
      description: new FormControl(),
    });

    this.du = true;
  }

  ngOnInit() {
    this.photos = [];
    this.filenames = [];
  }
  async selectType() {
    let actionSheet =await this.actionSheetCtrl.create({
      header: 'Select Media Type',
      mode:"ios",
      buttons: [
        {
          text: 'Capture Picture',
          handler: () => {
            this.getImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Load from Library',
          handler: () => {
            this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  getImage(sourceType) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
    this.imageURI = imageData.replace(/^file:\/\//, '');

      console.log("1: ", this.imageURI);
      this.uploadFile();
    }, (err) => {
      console.log(err);
    });
  }

 async uploadFile() {
    let loading =await this.loadingCtrl.create({
      message: 'Please wait...',
      cssClass: 'xx'
    });
     
    loading.present();

    this.du = false;


    // const fileInfo = {};

    // this.transfer.resolveLocalFilesystemUrl(this.imageURI)
    //   .then((entry: FileEntry) => {
    //     return new Promise((resolve, reject) => {
    //       entry.file(meta => resolve(meta), error => reject(error));
    //     });
    //   })
    //   .then((meta: IFile) => {
    //     fileInfo.name = meta.name;
    //     fileInfo.type = meta.type; // This is a value compatible with the 'Content-Type' HTTP header
    //     fileInfo.size = meta.size;
    //     return fileInfo;
    //   })

    this.inprocess = true;
    let ext = this.imageURI.substr(this.imageURI.lastIndexOf('.') + 1);
    this.file_name = this.imageURI.substr(this.imageURI.lastIndexOf('/') + 1);
  
    ext = ext.toLowerCase();
    console.log("iphone ext: ",ext);

    
  
    // if(ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "gif" && ext != "mp4" && ext != "avi" && ext != "mov" && ext != "3gp" && ext != "mpeg" && ext != "mov"){
    //  // not supported
    //  let alert = this.alertCtrl.create({
    //    title: 'File format not supported!',
    //    buttons: [{
    //     text: 'Ok'
    //    }]
    //  });
    //  alert.present();

    //  loading.dismiss();
    //  return false;
    // }
  
    console.log('this.mediaURI: ',this.imageURI);
    const fileTransfer: FileTransferObject = this.transfer.create();

    ////
    
    ////
  
    let options: FileUploadOptions = {
      fileKey: 'img',
      fileName: 'file.jpg',
      headers: {}
    }

    options.headers = {
      Connection: "close"
    }
    options.chunkedMode = false;
  
    fileTransfer.upload(this.imageURI, 'https://haulonline.com/gravityupload.php', options)
      .then((data) => {
        loading.dismiss();
        console.log('resp: ', data);
        let d = data.response;
        this.imageURI = "https://haulonline.com/"+d;

        this.photos.push(this.imageURI);
        this.photos.reverse();

        this.filenames.push(this.file_name);
        this.filenames.reverse();

        this.inprocess = false;
        this.du = true;
      }, (err) => {
        loading.dismiss();
        console.log(err);
      },
      
    );

    fileTransfer.onProgress((progressEvent) => {
      console.log(progressEvent);
      if (progressEvent.lengthComputable) {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.progress = perc;

      

        if(perc==100){
          loading.dismiss();
          this.du = true;
        }
      } else {
        this.progress = 0;
      }
    });
  
  } 

 async itemData(){
    let form_data1 =  this.form_data;
    let form_data = this.donation_item_form.value;
    console.log(form_data1)
    console.log(form_data)
    let source = 'donation';

 this.util.startloading()
    // Check for user Login
    this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(this.userStoredData==undefined){
      let alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Confirm Action',
      message: 'Please signin or signup before proceeding...',
      buttons: [
        {
          text: 'Signin & Proceed',
          handler: async () => {
            console.log('signin clicked');
            this.util.dismisloading()
            const modal = await this.modalCtrl.create({
             component: TruckonlyStep2Page,
             backdropDismiss: true,
             cssClass: 'modal-form',
             componentProps: { photos: this.photos,form_data: form_data, form_data1: form_data1, source:source }
           });
            await modal.present();
          }
        },
        {
          text: 'Signup & Proceed',
          handler: async () => {
            this.util.dismisloading()
            console.log('signup clicked');

            this.util.dismisloading()
            console.log('signup clicked');
            const modal = await this.modalCtrl.create({
              component: TruckonlySignupPage,
              backdropDismiss: true,
              cssClass: 'modal-form',
              componentProps:{ photos: this.photos,form_data: form_data, form_data1: form_data1, source:source }
            });
             await modal.present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            this.util.dismisloading()
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();

    }
    else{
      this.wordpressService.createCharitableContribution(this.photos,form_data,form_data1)
      .subscribe(async res => {
        console.log(res);
        this.util.dismisloading()
        let alert =await this.alertCtrl.create({
          message: "Thank You for submitting a request to have your charitable item collected.  An agent from a local charity will be in contact with you shortly.",
          cssClass: 'category-prompt',
          buttons: [{
           text: 'Ok'
         }]
        });
        
        alert.present();

        this.nav.navigateRoot("walkthrough")
        //this.appCtrl.getRootNav();
       },
       async err => {
        this.util.dismisloading()
         console.log(err);
         let alert =await this.alertCtrl.create({
           message:JSON.parse(err['_body']).errormsg,
           cssClass: 'category-prompt',
           buttons: [{
            text: 'Ok'
          }]
         });
         alert.present();
       })
    }

  }
  back(){
    this.nav.back()
  }

}
