

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { TruckonlySignupPage } from '../truckonly-signup/truckonly-signup.page';
import { TruckonlyStep2Page } from '../truckonly-step2/truckonly-step2.page';
declare var google: any;

@Component({
  selector: 'app-move',
  templateUrl: './move.page.html',
  styleUrls: ['./move.page.scss'],
})
export class MovePage implements OnInit {
  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;

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
  counterValue: any=2;
  counterValueHour: any=2;
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public modalCtrl: ModalController,
    private nav : NavController,
    private util :UtilsService,
    private activeRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.section = "post";
    this.activeRoute.queryParams.subscribe((res:any)=>{
      this.service = res.service
    })
 

    this.post_form = new FormGroup({
        userid: new FormControl(),
        name: new FormControl(),
        email: new FormControl(),
        password: new FormControl(),
        phone_number: new FormControl(),
        date_of_service: new FormControl('', Validators.required),
        from_type: new FormControl('', Validators.required),
        time_of_day: new FormControl('', Validators.required),
       
    });


      // Defining values if user logged in

      this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
      if(this.userStoredData==undefined){
        this.isLoggedin = true;
      }
      else{
    this.util.startloading();
  
        let user_id = this.userStoredData.user_id;
  
        this.wordpressService.getUserProfile(user_id)
        .subscribe(res => {
           this.util.dismisloading();
  
             this.userName = JSON.parse(res['_body']).first_name;
             this.userEmail = JSON.parse(res['_body']).email;
             this.userPhone = JSON.parse(res['_body']).phone_number;
             this.userId = JSON.parse(res['_body']).user_id;
         },
         err => {
          this.util.dismisloading();
         })
      }

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
    startdate: string = new Date().toISOString();
    enddate: any  = new Date().getUTCFullYear()+1;  
    stripText1(control: FormControl) {
      control.setValue(control.value.replace(/[^0-9]/g, ''));
     }
     moveNextTo(){
      console.log(this.post_form.value);
  
      let form_data = this.post_form.value;
      let pagetitle1 = this.service.pagetitle;
      this.nav.navigateForward("movesecond",{queryParams:{form_data:form_data,pagetitle1:pagetitle1}} )
    }
    helpincrease() {
      this.counterValue++;
      this.post_form.controls['required_helpers'].setValue(this.counterValue)
    }
  
    helpdecrease() {
      if(this.counterValue>0){
        this.counterValue--;
        this.post_form.controls['required_helpers'].setValue(this.counterValue)
      }
    }

    hourincrease() {
      this.counterValueHour++;
      this.post_form.controls['request_hours'].setValue(this.counterValue)
    }
  
    hourdecrease() {
      if(this.counterValueHour>0){
        this.counterValueHour--;
        this.post_form.controls['request_hours'].setValue(this.counterValue)
      }
    }
    back(){
      this.nav.back();
    }
}
