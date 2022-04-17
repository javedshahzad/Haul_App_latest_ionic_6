import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

declare var google: any;

@Component({
  selector: 'app-smallmove',
  templateUrl: './smallmove.page.html',
  styleUrls: ['./smallmove.page.scss'],
})
export class SmallmovePage implements OnInit {
  section: string;
  post_form: FormGroup;
  service:any;

  isLoggedin:boolean = false;
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: number;
  userStoredData: any;
  pagetitle: string;

  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;

  autocompleteItems1: any;
  autocomplete1: any;
  counterValue: number=2;
  counterValueHour: any=2;
  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
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
      date_of_service: new FormControl('', Validators.required),
      time_of_day: new FormControl('', Validators.required),
      // truck_type: new FormControl('Trailer', Validators.required),
      // required_helpers: new FormControl(2, counterRangeValidator(100, 1)),
      // request_hours: new FormControl(2, counterRangeValidator(100, 1)),

      from_service_address: new FormControl('', Validators.required),
      from_outside_stairs: new FormControl(),
      from_inside_stairs: new FormControl(),
      // to_service_address: new FormControl('', Validators.required),
      // to_outside_stairs: new FormControl(),
      // to_inside_stairs: new FormControl(),
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
         this.util.dismisloading()
    
               this.userName = JSON.parse(res['_body']).first_name;
               this.userEmail = JSON.parse(res['_body']).email;
               this.userPhone = JSON.parse(res['_body']).phone_number;
               this.userId = JSON.parse(res['_body']).user_id;
    
           },
           err => {
            this.util.dismisloading()
           })
        }
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
          query: ''
        };
    
        this.autocompleteItems1 = [];
        this.autocomplete1 = {
          query: ''
        };
        
    
  }

  startdate: string = new Date().toISOString();
  enddate: any  = new Date().getUTCFullYear()+1;
  // For From Address

  updateSearch() {
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

  // For To Address

  updateSearch1() {
    if (this.autocomplete1.query == '') {
    this.autocompleteItems1 = [];
    return;
    }
    let self = this;
    let config = {
    //types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
    input: this.autocomplete1.query,
    componentRestrictions: {  }
    }
    this.acService.getPlacePredictions(config, function (predictions, status) {
    console.log('modal > getPlacePredictions > status > ', status);
    self.autocompleteItems1 = [];
    if(predictions!=null){
      predictions.forEach(function (prediction) {
        self.autocompleteItems1.push(prediction);
      });
    }
    });
  }

  chooseItem1(item){
    console.log(item.description);
    this.autocompleteItems1 = [];
    this.autocomplete1.query = item.description;
  }

  moveNextTo(){
    let form_data= this.post_form.value;
    let pagetitle1 = this.pagetitle;
    console.log("form data: ", form_data);
    this.nav.navigateForward("smallmovepic", {queryParams:{form_data:form_data,pagetitle1:pagetitle1}})
  }
  helpincrease() {
    this.counterValue++;
    this.post_form.controls['from_outside_stairs'].setValue(this.counterValue)
  }

  helpdecrease() {
    if(this.counterValue>0){
      this.counterValue--;
      this.post_form.controls['from_outside_stairs'].setValue(this.counterValue)
    }
  }

  hourincrease() {
    this.counterValueHour++;
    this.post_form.controls['from_inside_stairs'].setValue(this.counterValue)
  }

  hourdecrease() {
    if(this.counterValueHour>0){
      this.counterValueHour--;
      this.post_form.controls['from_inside_stairs'].setValue(this.counterValue)
    }
  }
  back(){
    this.nav.back()
  }
}
