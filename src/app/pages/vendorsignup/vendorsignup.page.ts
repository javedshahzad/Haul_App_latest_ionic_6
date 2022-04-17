import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { TncPage } from '../tnc/tnc.page';
declare var google: any;
@Component({
  selector: 'app-vendorsignup',
  templateUrl: './vendorsignup.page.html',
  styleUrls: ['./vendorsignup.page.scss'],
})
export class VendorsignupPage implements OnInit {
  section: string;
  post_form: any=FormGroup;
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

  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;
  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public modalCtrl: ModalController,
    private util:UtilsService
  ) { }

  ngOnInit() {
    this.post_form = new FormGroup({
      email: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      service_provider: new FormControl('', Validators.required),
      provider_description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      mileage_radius: new FormControl('', Validators.required),
      accept_tnc: new FormControl(false,Validators.requiredTrue),
  });

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

    createVendors(){
      let form_data = this.post_form.value;
  
    this.util.startloading();
  
      //console.log('formdata: ',form_data); 
  
      this.wordpressService.VendorRegistration(form_data)
      .subscribe(res => {
        this.util.dismisloading()
  
           console.log("success");
  
          this.util.toast("Successfully registered!")
  
           this.nav.navigateForward("login",{queryParams:{  role: 'vendor'}});
       },
       err => {
         this.util.dismisloading()
      this.util.toast(JSON.parse(err['_body']).errormsg)
       })
    }
    back(){
      this.nav.back()
    }
   async openTnc(){
      const modal = await this.modalCtrl.create({
        component: TncPage,
        cssClass: 'my-custom-class'
      });
      return await modal.present();
    }
}
