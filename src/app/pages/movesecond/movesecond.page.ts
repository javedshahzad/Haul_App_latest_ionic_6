import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WordpressService } from 'src/app/providers/wordpress.service';
declare var google: any;
@Component({
  selector: 'app-movesecond',
  templateUrl: './movesecond.page.html',
  styleUrls: ['./movesecond.page.scss'],
})
export class MovesecondPage implements OnInit {
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
  outside_stairs_ext_level:number=2;
  total_bedrooms=2;
  total_bathrooms=2;
  rooms_upstairs=2;
  rooms_downstairs=2;
  patio_furniture_sqft=2;
  exe_equipment=2;
  gas_equipment=2;

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
      from_service_address: new FormControl('', Validators.required),
      outside_stairs_ext_level: new FormControl(),
      est_sqft_upper_level: new FormControl(),
      est_sqft_lower_level: new FormControl(),
      total_est_living_area: new FormControl(),
      total_bedrooms: new FormControl(),
      total_bathrooms: new FormControl(),
      rooms_upstairs: new FormControl(),
      rooms_downstairs: new FormControl(),
      garage_sqft: new FormControl(),
      attic_sqft: new FormControl(),
      basement_sqft: new FormControl(),
      outside_storage_sqft: new FormControl(),
      total_est_outside_living_area: new FormControl(),
      patio_furniture_sqft: new FormControl(),
      exe_equipment: new FormControl(),
      gas_equipment: new FormControl(),
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

    let form_data1 =  this.service.form_data;

    console.log(this.post_form.value);

    let form_data = this.post_form.value;
    let pagetitle1 = this.pagetitle;
    this.nav.navigateForward("movethird",{queryParams: {form_data1:form_data1,form_data:form_data,pagetitle1:pagetitle1}})

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
      this.outside_stairs_ext_level++;
      this.post_form.controls['outside_stairs_ext_level'].setValue(this.outside_stairs_ext_level)
    }
  
    outstairdecrease() {
      if(this.outside_stairs_ext_level>0){
        this.outside_stairs_ext_level--;
        this.post_form.controls['outside_stairs_ext_level'].setValue(this.outside_stairs_ext_level)
      }
    }

    bedroomincrease() {
      this.total_bedrooms++;
      this.post_form.controls['total_bedrooms'].setValue(this.total_bedrooms)
    }
  
    bedroomdecrease() {
      if(this.total_bedrooms>0){
        this.total_bedrooms--;
        this.post_form.controls['total_bedrooms'].setValue(this.total_bedrooms)
      }
    }
    Bathroomsincrease() {
      this.total_bathrooms++;
      this.post_form.controls['total_bathrooms'].setValue(this.total_bathrooms)
    }
  
    Bathroomsdecrease() {
      if(this.total_bathrooms>0){
        this.total_bathrooms--;
        this.post_form.controls['total_bathrooms'].setValue(this.total_bathrooms)
      }
    }

    Upstairsincrease() {
      this.rooms_upstairs++;
      this.post_form.controls['rooms_upstairs'].setValue(this.rooms_upstairs)
    }
  
    Upstairsdecrease() {
      if(this.rooms_upstairs>0){
        this.rooms_upstairs--;
        this.post_form.controls['rooms_upstairs'].setValue(this.rooms_upstairs)
      }
    }
    Downstairsincrease() {
      this.rooms_downstairs++;
      this.post_form.controls['rooms_downstairs'].setValue(this.rooms_downstairs)
    }
  
    Downstairsdecrease() {
      if(this.rooms_downstairs>0){
        this.rooms_downstairs--;
        this.post_form.controls['rooms_downstairs'].setValue(this.rooms_downstairs)
      }
    }
    Furnitureincrease() {
      this.patio_furniture_sqft++;
      this.post_form.controls['patio_furniture_sqft'].setValue(this.patio_furniture_sqft)
    }
  
    Furnituredecrease() {
      if(this.patio_furniture_sqft>0){
        this.patio_furniture_sqft--;
        this.post_form.controls['patio_furniture_sqft'].setValue(this.patio_furniture_sqft)
      }
    }
    Equipmentincrease() {
      this.exe_equipment++;
      this.post_form.controls['exe_equipment'].setValue(this.exe_equipment)
    }
  
    Equipmentdecrease() {
      if(this.exe_equipment>0){
        this.exe_equipment--;
        this.post_form.controls['exe_equipment'].setValue(this.exe_equipment)
      }
    }
    Poweredincrease() {
      this.gas_equipment++;
      this.post_form.controls['gas_equipment'].setValue(this.gas_equipment)
    }
  
    Powereddecrease() {
      if(this.gas_equipment>0){
        this.gas_equipment--;
        this.post_form.controls['gas_equipment'].setValue(this.gas_equipment)
      }
    }
    back(){
      this.nav.back();
    }
}





