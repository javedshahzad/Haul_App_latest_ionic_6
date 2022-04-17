import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
declare var google: any;

@Component({
  selector: 'app-charitable',
  templateUrl: './charitable.page.html',
  styleUrls: ['./charitable.page.scss'],
})
export class CharitablePage implements OnInit {
  section: string;

  post_form: FormGroup;
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

  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;

  pagetitle: string;
  constructor(
    
    public nav: NavController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private activeRoute: ActivatedRoute,
    private util : UtilsService
  ) { 
    this.section = "post";
    this.activeRoute.queryParams.subscribe((res:any)=>{
      this.service = res.service;
      this.pagetitle = this.service.pagetitle;
    })
  }

  ngOnInit() {

    this.post_form = new FormGroup({
      userid: new FormControl(),
      name: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      phone_number: new FormControl(),
      pickup_address: new FormControl('', Validators.required),
      //time_of_day: new FormControl('', Validators.required),
      type_of_item: new FormControl('', Validators.required),
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
    dateServiceOnChange(event){
      if(event=='schedule_service'){
         this.show_datepicker= true;
      }else{
         this.show_datepicker= false;
      }
   }
   nextItemPage(){
    let form_data= this.post_form.value;
    let pagetitle1 = this.pagetitle;
    this.nav.navigateForward("donationitem", {queryParams:{form_data:form_data,pagetitle1:pagetitle1}})
  }
  back(){
    this.nav.back();
  }
}
