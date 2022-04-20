import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { UtilsService } from 'src/app/providers/utils.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
declare var google: any;

@Component({
  selector: 'app-vendor-profilesettings',
  templateUrl: './vendor-profilesettings.page.html',
  styleUrls: ['./vendor-profilesettings.page.scss'],
})
export class VendorProfilesettingsPage implements OnInit {
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
  dataStatus: any;

  imageURI:any;

  progress:any = 0;
  inprocess:boolean = false;
  du:boolean = true;
  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public transfer: FileTransfer,
    public camera: Camera,
    private util:UtilsService,
    public file: File,
  ) { }

  ngOnInit() {
    this.post_form = new FormGroup({
      service_provider: new FormControl('', Validators.required),
      provider_description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      mileage_radius: new FormControl('', Validators.required),
      same_day_service: new FormControl(),
      imagepath: new FormControl(),
    });

this.util.startloading();
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(userStoredData){
      var vendor_id = userStoredData.user_id;
    }

    this.wordpressService.getVendorServiceSettings(vendor_id)
        .subscribe((res:any) => {
         this.util.dismisloading()
          let data = res.json();

          this.serviceAddress = data.service_address;
          this.mileageRadius = data.mileage_radius;
          this.sameDayService = data.same_day_service;
          this.serviceProvider = data.service_provider;
          this.providerDescription = data.provider_description;
          this.imageURI = data.imagepath;
          this.dataStatus = data.data_status;

          this.autocomplete.query = data.service_address;
    });

    this.du = true;
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }
  back(){
    this.nav.back();
  }
  updateSearch() {
    console.log('modal > updateSearch');
      if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
      }
      let self = this;
      let config = {
      //types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
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
  
    vendorServiceSettings(){
      let form_data = this.post_form.value;
  
      console.log(form_data);
  
      let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
      let vendor_id = userStoredData.user_id;
  
    this.util.startloading()
        this.wordpressService.vendorServiceSettings(form_data,vendor_id)
        .subscribe((res:any) => {
          let data = res.json();
          this.util.toast((data.errormsg))
          this.util.dismisloading()
      
         },
         err => {
          this.util.dismisloading()
         })
    }
  
    getImage() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      }
  
      this.camera.getPicture(options).then((imageData) => {
        this.imageURI = imageData.replace(/^file:\/\//, '');
        console.log(this.imageURI);
  
        this.uploadFile();
      }, (err) => {
        console.log(err);
        this.util.toast(err); 
      });
    }
  
  
  
  uploadFile() {
    this.util.startloading()
    this.du = false;
    this.inprocess = true;

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
  
    fileTransfer.upload(this.imageURI, 'https://haulonline.com/uploadapi.php', options)
      .then((data) => {
        let d = data.response;
        this.imageURI = "https://haulonline.com/"+d;
        console.log(this.imageURI);
        this.util.dismisloading()
        this.inprocess = false;
        //loader.dismiss();
        this.util.toast("Image uploaded successfully");
      }, (err) => {
        console.log(err);
        this.util.dismisloading()
        this.inprocess = false;
        //loader.dismiss();
        this.util.toast(err);
      });
  
      fileTransfer.onProgress((progressEvent) => {
        console.log(progressEvent);
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
          this.progress = perc;
          this.util.dismisloading()
          if(perc==100){
            this.util.dismisloading()
            this.inprocess = false;
            this.du = true;
          }
        } else {
          this.progress = 0;
        }
      });
  }
  

  
  vendorManageServiceLink(){
    this.nav.navigateForward("service");
  }
  
}
