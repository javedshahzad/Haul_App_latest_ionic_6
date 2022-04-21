import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { TruckonlyStep2Page } from '../truckonly-step2/truckonly-step2.page';
import { TruckonlySignupPage } from '../truckonly-signup/truckonly-signup.page';
import { InstructionsPage } from '../instructions/instructions.page';



@Component({
  selector: 'app-move-video',
  templateUrl: './move-video.page.html',
  styleUrls: ['./move-video.page.scss'],
})
export class MoveVideoPage implements OnInit {
  section: string;
  room_video_form: FormGroup;
  event_form: FormGroup;
  card_form: FormGroup;
  service:any;
  relationship:any;
  categories_checkbox_open: boolean;
  categories_checkbox_result;
  selected_image : any;
  show_datepicker:boolean= false;

  isLoggedin:boolean = false;
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: number;
  userStoredData: any;
  pagetitle: any;

  mediaURI:any;
  imageFileName:any;
  uploaded:any = '';

  inprocess:boolean = false;
  progress:any = 0;

  du:boolean = true;

  public photos : any;
  public filenames : any;
  file_name: any = '';
  forms: any;
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
    private nav : NavController,
    private videoEditor: VideoEditor,
    private mediaCapture: MediaCapture, 
    private file: File, 
  ) { 
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.forms=res;
    })
  }

  ngOnInit() {
    this.room_video_form = new FormGroup({
      video_or_pic: new FormControl(),
      item_decscription: new FormControl(),
    });

    this.du = true;

    this.du = true;
    this.photos = [];
    this.filenames = [];
  }
  async mediaData(){
    let form_data3 = this.forms.form_data
    let form_data1 = this.forms.form_data1
    let form_data2 = this.forms.form_data2
    let form_data= this.room_video_form.value;

    let source = 'move';
    let vendor_id = 0;
    // this.nav.push(VendorslistPage, {pho, form_data1, form_data, source, customer_address, service_date, time_of_day, requested_helpers, requested_hours, to_service_address, from_outside_stairs, from_inside_stairs, to_outside_stairs, to_inside_stairs})

    //////

    // console.log("dd: ", photos);

    this.util.startloading()

    // Check for user Login
    this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(this.userStoredData==undefined){
      let alert =await this.alertCtrl.create({
        backdropDismiss: false,
        header: 'Confirm Action',
        message: 'Please signin or signup before proceeding...',
      buttons: [
        {
          text: 'Signin & Proceed',
          handler: async () => {
            console.log('signin clicked');
            this.util.dismisloading()
            console.log('signin clicked');
            this.util.dismisloading()
            const modal = await this.modalCtrl.create({
             component: TruckonlyStep2Page,
             backdropDismiss: true,
             cssClass: 'modal-form',
             componentProps:{ photos:this.photos, form_data: form_data, form_data1:form_data1,form_data2:form_data2,form_data3:form_data3, vendor_id:vendor_id, source:source}
           });
            await modal.present();
    
          }
        },
        {
          text: 'Signup & Proceed',
          handler: async () => {
            console.log('signup clicked');

            this.util.dismisloading()
            console.log('signup clicked');
            const modal = await this.modalCtrl.create({
              component: TruckonlySignupPage,
              backdropDismiss: true,
              cssClass: 'modal-form',
              componentProps:{ photos:this.photos ,form_data: form_data, form_data1:form_data1,form_data2:form_data2,form_data3:form_data3, vendor_id:vendor_id, source:source }
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

      this.wordpressService.createNoTruckLabourOnlyMove(this.photos,form_data,form_data1,form_data2,form_data3,vendor_id)
      .subscribe(async res => {
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
            const modal = await this.modalCtrl.create({
              component: InstructionsPage,
              backdropDismiss: true,
              cssClass: 'modal-form',
              componentProps:{ photos: this.photos, form_data:form_data, form_data1:form_data1, vendor_id:vendor_id, source:source }
            });
            modal.onDidDismiss().then((data) => {
              this.nav.navigateRoot("walkthrough")
            });
            await modal.present();
          }

        }
        else{
          let alert = await this.alertCtrl.create({
            message:message,
            cssClass: 'category-prompt',
            buttons: [{
            text: 'Ok'
          }]
          });

    
          alert.present();
        }
       },
       err => {
        this.util.dismisloading()
        this.util.toast(err)
       })
    }

    //////


  }



  async uploadFile() {
    this.util.startloading()
    this.du = false;
    this.inprocess = true;
    let ext = this.mediaURI.substr(this.mediaURI.lastIndexOf('.') + 1);
    this.file_name = this.mediaURI.substr(this.mediaURI.lastIndexOf('/') + 1);
  
    ext = ext.toLowerCase();
    console.log("iphone ext: ",ext);
  
    if(ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "gif" && ext != "mp4" && ext != "avi" && ext != "mov" && ext != "3gp" && ext != "mpeg" && ext != "mov"){
     // not supported
     this.util.dismisloading()
     let alert =await this.alertCtrl.create({
       message: 'File format not supported!',
       buttons: [{
        text: 'Ok'
       }]
     });
     alert.present();
     return false;
    }
  
    console.log('this.mediaURI: ',this.mediaURI);
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'img',
      fileName: 'file.'+ext,
      headers: {}
    }

    options.headers = {
      Connection: "close"
    }
    options.chunkedMode = false;
  
    fileTransfer.upload(this.mediaURI, 'https://haulonline.com/gravityupload.php', options)
      .then((data) => { 

        this.util.dismisloading()

        console.log('resp: ', data);
        let d = data.response;
        this.mediaURI = "https://haulonline.com/"+d;

        this.photos.push(this.mediaURI);
        this.photos.reverse();

        this.filenames.push(this.file_name);
        this.filenames.reverse();

        this.inprocess = false;
        this.du = true;

      }, (err) => {
        this.util.dismisloading()
        console.log(err);
      },
      
    );

  
    fileTransfer.onProgress((progressEvent) => {
      console.log(progressEvent);
      if (progressEvent.lengthComputable) {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.progress = perc;

       

        if(perc==100){
          this.util.dismisloading()
          this.du = true;
        }
      } else {
        this.progress = 0;
      }
    });
  
  }

  deletePhoto(index){
    this.photos.splice(index, 1);
    this.filenames.splice(index, 1);
  }


  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 180,
      quality: 50,
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      console.log("here hasan");
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();    
      let fromDirectory = dir.join('/');      
      var toDirectory = this.file.dataDirectory;
      this.mediaURI = capturedFile.fullPath.replace(/\/\//, '');
      this.uploadFile();
      this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
      },err => {
        console.log('err: ', err);
      });
    },
    (err: CaptureError) => console.error(err));
  }

  async selectType() {
    let actionSheet = await this.actionSheetCtrl.create({
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
          text: 'Capture Video',
          handler: () => {
            this.captureVideo();
          }
        },
        {
          text: 'Load from Library',
          handler: () => {
            this.getMedia(this.camera.PictureSourceType.PHOTOLIBRARY);
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
    console.log(sourceType)
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.mediaURI = imageData.replace(/^file:\/\//, '');
      this.uploadFile();
    }, (err) => {
      console.log(err);
    });
  }


  getMedia(sourceType) {
    console.log(sourceType)
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA
    }
    this.camera.getPicture(options).then((imageData) => {
      this.mediaURI = imageData.replace(/^file:\/\//, '');
      this.uploadFileLocal();
    }, (err) => {
      console.log(err);
    });
  }

  async uploadFileLocal() {
    this.util.startloading()
  
    this.du = false;
  
    this.inprocess = true;
    let ext = this.mediaURI.substr(this.mediaURI.lastIndexOf('.') + 1);
    this.file_name = this.mediaURI.substr(this.mediaURI.lastIndexOf('/') + 1);
  
    ext = ext.toLowerCase();
    console.log("iphone ext: ",ext);
  
    if(ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "gif" && ext != "mp4" && ext != "avi" && ext != "mov" && ext != "3gp" && ext != "mpeg" && ext != "mov"){
     // not supported
     this.util.dismisloading()
     let alert =await this.alertCtrl.create({
       message: 'File format not supported!',
       buttons: [{
        text: 'Ok'
       }]
     });
     alert.present();
     return false;
    }


    if (this.platform.is('android')) {
      console.log('Android');
      this.mediaURI = 'file:'+this.mediaURI; 
    }
  
    console.log('this.mediaURI: ',this.mediaURI);
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'img',
      fileName: 'file.'+ext,
      headers: {}
    }

    options.headers = {
      Connection: "close"
    }
    options.chunkedMode = false;
    
    
    if(ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "gif" ){
      this.videoEditor.getVideoInfo({
        fileUri: this.mediaURI,
      })
      .then(async (fileUri) => {
        console.log('video transcode success', fileUri.duration);
          if(fileUri.duration>180){
            this.du = true;
            console.log("file too large");
            this.util.dismisloading()
            let alert =await this.alertCtrl.create({
              message: 'File must be less than of 3 minutes.',
              buttons: [{
               text: 'Ok'
              }]
            });
            alert.present();
          }
          else{
            console.log("file ok");
            fileTransfer.upload(this.mediaURI, 'https://haulonline.com/gravityupload.php', options)
              .then((data) => {
                this.util.dismisloading()
                console.log('resp: ', data);
                let d = data.response;
                this.mediaURI = "https://haulonline.com/"+d;
    
                this.photos.push(this.mediaURI);
                this.photos.reverse();
    
                this.filenames.push(this.file_name);
                this.filenames.reverse();
    
                this.inprocess = false;
                this.du = true;
              }, (err) => {
                this.util.dismisloading()
                console.log('EEE: ', err);
              },
            );
          }
      });
    }
    else{
      console.log("file ok");
        fileTransfer.upload(this.mediaURI, 'https://haulonline.com/gravityupload.php', options)
          .then((data) => {
            this.util.dismisloading()
            console.log('resp: ', data);
            let d = data.response;
            this.mediaURI = "https://haulonline.com/"+d;
  
            this.photos.push(this.mediaURI);
            this.photos.reverse();
  
            this.filenames.push(this.file_name);
            this.filenames.reverse();
  
            this.inprocess = false;
            this.du = true;
          }, (err) => {
            this.util.dismisloading()
            console.log('EEE: ', err);
          },
        );
    }
  
    //
  
    fileTransfer.onProgress((progressEvent) => {
      console.log(progressEvent);
      if (progressEvent.lengthComputable) {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.progress = perc;
        this.util.dismisloading()
        if(perc==100){
          this.util.dismisloading()
          this.du = true;
        }
      } else {
        this.progress = 0;
      }
    });
   } 

   back(){
    this.nav.back()
  }
}
