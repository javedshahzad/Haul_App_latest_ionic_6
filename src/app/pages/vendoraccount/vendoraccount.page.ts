import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
declare var cordova:any;
declare var google: any;

@Component({
  selector: 'app-vendoraccount',
  templateUrl: './vendoraccount.page.html',
  styleUrls: ['./vendoraccount.page.scss'],
})
export class VendoraccountPage implements OnInit {

  imageURI_pid_arr:any=[];
  imageURI_irs_arr:any=[];
  imageURI_ins_arr:any=[];
  imageURI_oth_arr:any=[];
  fru:any=[];
  
  section: string;
  post_form: FormGroup;
  event_form: FormGroup;
  card_form: FormGroup;
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

  serviceAddress: string;
  mileageRadius: string;
  sameDayService: string;

  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;

  serviceProvider: any;
  providerDescription: any;

  imageURI_pid:any;
  imageURI_irs:any;
  imageURI_ins:any;
  imageURI_oth:any;


  mailingAddres:any;
  mailingPhone:any;
  mailingEmail:any;
  routingNumber:any;
  accountNumber:any;

  pdffilepath: any = '';

  progress:any = 0;
  inprocess:boolean = false;
  du:boolean = true;

  fn:any;
  ln:any;

  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util:UtilsService,
    public transfer: FileTransfer,
    public camera: Camera,
    public document: DocumentViewer,
    public file: File,
  ) { 
    this.post_form = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      mailing_address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      routing_number: new FormControl('', Validators.required),
      account_number: new FormControl('', Validators.required),

      ip_pid: new FormControl(),
      ip_irs: new FormControl(),
      ip_ins: new FormControl(),
      ip_oth: new FormControl(),
    });

    this.util.startloading();
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(userStoredData){
      var vendor_id = userStoredData.user_id;
    }

    this.wordpressService.getVendorAccountSettings(vendor_id)
        .subscribe((res:any) => {
       this.util.dismisloading();
          let data = res.json();

          this.fn = data.firstname;
          this.ln = data.lastname;

          this.mailingAddres = data.mailing_address;
          this.mailingPhone = data.mailing_phone;
          this.mailingEmail = data.mailing_email;
          this.routingNumber = data.routing_number;
          this.accountNumber = data.account_number;
          this.autocomplete.query = data.mailing_address;

          this.imageURI_pid_arr = data.vendor_photo_id;          
          this.imageURI_irs_arr = data.vendor_irs_form;
          this.imageURI_ins_arr = data.vendor_insurance;
          this.imageURI_oth_arr = data.vendor_other_document;

          console.log('PID: ', JSON.stringify(data));
    });

  }

  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  updateSearch() {
    console.log('modal > updateSearch');
      if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
      }
      let self = this;
      let config = {
      input: this.autocomplete.query,
      componentRestrictions: {  }
      }
      this.acService.getPlacePredictions(config, function (predictions, status) {
      console.log('modal > getPlacePredictions > status > ', status);
      self.autocompleteItems = [];
      if(predictions!=null){
        predictions.forEach(function (prediction) {
          self.autocompleteItems.push(prediction);
        });
      }
      });
    }
  
    chooseItem(item){
      console.log(item.description);
      this.autocompleteItems = [];
      this.autocomplete.query = item.description;
    }
  
    getImage(str) {
      // const options1 = {
      //   quality: 100,
      //   destinationType: this.camera.DestinationType.FILE_URI,
      //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      //   encodingType: this.camera.EncodingType.JPEG,
      //   mediaType: this.camera.MediaType.PICTURE,
      // }
  
      // this.imagePicker.getPictures(options1).then((results) => {
      //   for (var i = 0; i < results.length; i++) {
      //       console.log('Image URI: ' + results[i]);
      //   }
      // }, (err) => { });
  
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
      }
  
      this.camera.getPicture(options).then((imageData) => {
        if(str=='pid'){
          this.imageURI_pid = imageData.replace(/^file:\/\//, '');
        }
        else if(str=='irs'){
          this.imageURI_irs = imageData.replace(/^file:\/\//, '');
        }
        else if(str=='ins'){
          this.imageURI_ins = imageData.replace(/^file:\/\//, '');
        }
        else if(str=='oth'){
          this.imageURI_oth = imageData.replace(/^file:\/\//, '');
        }
  
        this.uploadFile(str);
      }, (err) => {
        console.log(err);
        //this.presentToast(err);
      });
    }
  
    uploadFile(str) {
      this.du = false;
    this.inprocess = true;
    
      this.util.startloading();
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile.jpg',
      mimeType: "image/jpeg",
      headers: {}
    }
  
    options.headers = {
      Connection: "close"
    }
    options.chunkedMode = false;
  
    if(str=='pid'){
      fileTransfer.upload(this.imageURI_pid, 'https://haulonline.com/uploadapi.php', options)
        .then((data) => {
          let d = data.response;
          this.imageURI_pid = "https://haulonline.com/"+d;
  
          this.imageURI_pid_arr.push(this.imageURI_pid);
  
          this.util.dismisloading();
          this.inprocess = false;
        }, (err) => {
          console.log(err);
          this.util.dismisloading();
          this.inprocess = false;
        });
    }
    else if(str=='irs'){
      fileTransfer.upload(this.imageURI_irs, 'https://haulonline.com/uploadapi.php', options)
        .then((data) => {
          this.inprocess = false;
          let d = data.response;
          this.imageURI_irs = "https://haulonline.com/"+d;
          this.imageURI_irs_arr.push(this.imageURI_irs);
  
            this.util.dismisloading();
        }, (err) => {
          console.log(err);
          this.inprocess = false;
            this.util.dismisloading();
        });
    }
    else if(str=='ins'){
      fileTransfer.upload(this.imageURI_ins, 'https://haulonline.com/uploadapi.php', options)
        .then((data) => {
          let d = data.response;
          this.imageURI_ins = "https://haulonline.com/"+d;
  
          this.imageURI_ins_arr.push(this.imageURI_ins);
  
            this.util.dismisloading();
          this.inprocess = false;
        }, (err) => {
          console.log(err);
          this.inprocess = false;
            this.util.dismisloading();
        });
    }
    else if(str=='oth'){
      fileTransfer.upload(this.imageURI_oth, 'https://haulonline.com/uploadapi.php', options)
        .then((data) => {
          let d = data.response;
          this.imageURI_oth = "https://haulonline.com/"+d;
  
          this.imageURI_oth_arr.push(this.imageURI_oth);
  
            this.util.dismisloading();
          this.inprocess = false;
        }, (err) => {
          console.log(err);
            this.util.dismisloading();
          this.inprocess = false;
        });
  
    }
  
    fileTransfer.onProgress((progressEvent) => {
      console.log(progressEvent);
      if (progressEvent.lengthComputable) {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.progress = perc;
  
       
  
        if(perc==100){
          this.inprocess = false;
          this.du = true;
            this.util.dismisloading();
        }
      } else {
        this.progress = 0;
          this.util.dismisloading();
      }
    });
  }
  
  vendorAccountSettings(){
    let form_data = this.post_form.value;
  
    console.log(form_data);
  
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let vendor_id = userStoredData.user_id;
  
    this.util.startloading();
  
      this.wordpressService.vendorAccountSettings(form_data,vendor_id)
      .subscribe(async (res:any) => {
        let data = res.json();
  
            this.util.dismisloading();
           let alert =await this.alertCtrl.create({
             cssClass: 'category-prompt',
             message:data.errormsg,
             buttons: [{
              text: 'Ok'
            }]
           });
       
           alert.present();
       },
       err => {
          this.util.dismisloading();
       })
     }
  
    downloadForm(str){
      console.log(str);
  
      if(str == 'agreement'){
        this.util.startloading();
        this.wordpressService.getVAgreements()
        .subscribe((res:any) => {
           this.util.dismisloading();
          let html = res.json();
          this.pdffilepath = html;
          this.createPDF(this.pdffilepath,'contractor_agreement.pdf');
        })
      }
      else if(str == 'policy'){
        this.util.startloading();
        this.wordpressService.getPrivacyPolicy()
        .subscribe((res:any) => {
           this.util.dismisloading();
          let html = res.json();
          this.pdffilepath = html;
          this.createPDF(this.pdffilepath,'policy_privacy.pdf');
        })
      }
    }
  back(){
    this.nav.back();
  }
    vendorProfileLink(){
      this.nav.navigateForward("vendor-profilesettings");
    }
  
    createPDF(htmldata, fn){
      document.addEventListener('deviceready', () => {
        cordova.plugins.pdf.htmlToPDF({
                data: htmldata,
                documentSize: "A4",
                landscape: "portrait",
                fileName: fn,
                type: "share"
            },
            (sucess) => {
              console.log('sucess: ', sucess);
            },
            (error) => console.log('error:', error));
      });
  
    }
  
    delImg(t,i){
      if(t=='pid'){
        this.imageURI_pid_arr.splice(i, 1);
      }
      else if(t=='ins'){
        this.imageURI_ins_arr.splice(i, 1);
      }
      else if(t=='oth'){
        this.imageURI_oth_arr.splice(i, 1);
      }
  
    }

}
