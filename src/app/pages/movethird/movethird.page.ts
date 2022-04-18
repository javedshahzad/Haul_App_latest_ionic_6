import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WordpressService } from 'src/app/providers/wordpress.service';
declare var google: any;
@Component({
  selector: 'app-movethird',
  templateUrl: './movethird.page.html',
  styleUrls: ['./movethird.page.scss'],
})
export class MovethirdPage implements OnInit {
  section: string;
  post_form: FormGroup;
  event_form: FormGroup;
  card_form: FormGroup;
  service:any;
  categories_checkbox_open: boolean;
  categories_checkbox_result;
  selected_image : any;
  packingYes: string;
  specialty_item: string;
  value: any;

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

  a1:number;
  a2:number;
  a3:number = 0;

  b1:number;
  b2:number;
  b3:number = 0;
  packers_requested:number=2;
  hours_requested=2;
  outside_stairs_add_level=2;
  inside_stairs_add_level=2;


  arr50:number[] = new Array() 
  arr100:number[] = new Array() 
  constructor(
    private activeRoute:ActivatedRoute,
    public nav: NavController,
    public wordpressService: WordpressService
  ) { 
    this.section = "post";
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.service = res;
      this.pagetitle = res.pagetitle1
    })
  }

  ngOnInit() {
    this.post_form = new FormGroup({
      packers_requested: new FormControl(),
      hours_requested: new FormControl(),
      to_service_address: new FormControl('', Validators.required),
      to_type: new FormControl('', Validators.required),
      outside_stairs_add_level: new FormControl(),
      inside_stairs_add_level: new FormControl(),
    });

   

    console.log("ee: ",this.pagetitle);

    for(let i=100;i<=3500;){
      this.arr100.push(i);
      i = i+100;
    }

    for(let i=50;i<=2000;){
      this.arr50.push(i);
      i = i+50;
    }
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }
  moveNextTo(){

    // let form_data1 =  this.service.form_data;

    // console.log(this.post_form.value);

    // let form_data = this.post_form.value;
    // let pagetitle1 = this.pagetitle;
    // this.nav.navigateForward("movethird",{queryParams: {form_data1:form_data1,form_data:form_data,pagetitle1:pagetitle1}})


    let form_data1 = this.service.form_data1;
    let form_data2 = this.service.form_data;

    console.log(this.post_form.value);

    let form_data= this.post_form.value;
    this.nav.navigateForward("move-video",{queryParams:{form_data1:form_data1,form_data2:form_data2,form_data:form_data}})

  }

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
        console.log(predictions)
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

    onChange(v1,v2){
      console.log('v1: ', v1);
      console.log('v2: ', v2);
      if(v1=='' || v1==null || v1=='null'){
        v1 = 0;
      }
      if(v2=='' || v2==null || v2=='null'){
        v2 = 0;
      }
      this.a3 = parseInt(v1) + parseInt(v2);
    }

    onChange2(v1,v2,v3,v4){
      if(v1=='' || v1==null || v1=='null'){
        v1 = 0;
      }
      if(v2=='' || v2==null || v2=='null'){
        v2 = 0;
      }
      if(v3=='' || v3==null || v3=='null'){
        v3 = 0;
      }
      if(v4=='' || v4==null || v4=='null'){
        v4 = 0;
      }
      this.b3 = parseInt(v1) + parseInt(v2)+ parseInt(v3)+ parseInt(v4);
    }

    outstairincrease() {
      this.packers_requested++;
      this.post_form.controls['packers_requested'].setValue(this.packers_requested)
    }
  
    outstairdecrease() {
      if(this.packers_requested>0){
        this.packers_requested--;
        this.post_form.controls['packers_requested'].setValue(this.packers_requested)
      }
    }

    Hoursincrease() {
      this.hours_requested++;
      this.post_form.controls['hours_requested'].setValue(this.hours_requested)
    }
  
    Hoursdecrease() {
      if(this.hours_requested>0){
        this.hours_requested--;
        this.post_form.controls['hours_requested'].setValue(this.hours_requested)
      }
    }
    Additionalincrease() {
      this.outside_stairs_add_level++;
      this.post_form.controls['outside_stairs_add_level'].setValue(this.outside_stairs_add_level)
    }
  
    Additionaldecrease() {
      if(this.outside_stairs_add_level>0){
        this.outside_stairs_add_level--;
        this.post_form.controls['outside_stairs_add_level'].setValue(this.outside_stairs_add_level)
      }
    }

    inOutdecrease() {
      this.inside_stairs_add_level++;
      this.post_form.controls['inside_stairs_add_level'].setValue(this.inside_stairs_add_level)
    }
  
    inOutincrease() {
      if(this.inside_stairs_add_level>0){
        this.inside_stairs_add_level--;
        this.post_form.controls['inside_stairs_add_level'].setValue(this.inside_stairs_add_level)
      }
    }
   
    back(){
      this.nav.back();
    }
}





