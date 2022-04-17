import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { BlogFeedModel } from './blog-post.model';
declare var google: any;


@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.page.html',
  styleUrls: ['./pickup.page.scss'],
})
export class PickupPage implements OnInit {
  section: string;
  post_form: FormGroup;
  event_form: FormGroup;
  card_form: FormGroup;
  service:any;
  relationship:any;
  categories_checkbox_open: boolean;
  categories_checkbox_result;
  selected_image : any;
  show_datepicker:boolean = false;
  show_spacial_items:boolean = false;
  specialty_item: string;
  isLoggedin:boolean = false;

  userName: string;
  userEmail: string;
  userPhone: string;
  userId: number;
  userStoredData: any;
  feed: BlogFeedModel = new BlogFeedModel();

  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;

  autocompleteItems1: any;
  autocomplete1: any;

  pagetitle: string;

  public categoryTypeData: any;
  //stype:any;
  currDate: string = new Date().toISOString();
  counterValueHour: number=2;
  counterValue: any=2;
  outside: any=2;
  inside: any=2;
  constructor(
    private activeRoute : ActivatedRoute,
    public nav: NavController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util:UtilsService
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
  
      service_schedule_type: new FormControl('', Validators.required),
      date_of_service: new FormControl(),
      required_helpers: new FormControl('', Validators.required),
      from_service_address: new FormControl('', Validators.required),
      from_type: new FormControl('', Validators.required),
      outside_stairs_from: new FormControl(),
      inside_stairs_from: new FormControl(),
      to_service_address: new FormControl('', Validators.required),
      to_type: new FormControl('', Validators.required),
      outside_stairs_to: new FormControl(),
      inside_stairs_to: new FormControl(),
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

 this.wordpressService.getCategoryTypes()
 .subscribe((res:any) => {
  this.util.dismisloading()
      this.categoryTypeData = res.json();
  })
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
  ionViewWillEnter() {
    this.wordpressService.getSpecialPosts()
        .subscribe((data:any) => {

          for(let post of data.json()){
            this.feed.posts.push(post);
          }

          console.log(this.feed.posts);
          //loading.dismiss();
    });
  }
  createPickupDelivery(){
    let form_data= this.post_form.value;
    let pagetitle1 = this.pagetitle;
    console.log("form data: ", form_data);
    this.nav.navigateForward("pickup-item",{queryParams:{form_data:form_data,pagetitle1:pagetitle1}})
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

dateServiceOnChange(event){
 if(event=='Scheduled'){
    this.show_datepicker= true;
 }else{
    this.show_datepicker= false;
 }
}

itemCategoryOnChange(event){
console.log(event);
 if(event=='Specialty Item'){
    this.show_spacial_items= true;
 }else{
    this.show_spacial_items= false;
 }
}

// chooseCategory(){
// let alert = this.alertCtrl.create({
//   cssClass: 'category-prompt'
// });
// alert.setTitle('Category');

// alert.addInput({
//   type: 'checkbox',
//   label: 'Alderaan',
//   value: 'value1',
//   checked: true
// });

// alert.addInput({
//   type: 'checkbox',
//   label: 'Bespin',
//   value: 'value2'
// });

// alert.addButton('Cancel');
// alert.addButton({
//   text: 'Confirm',
//   handler: data => {
//     console.log('Checkbox data:', data);
//     this.categories_checkbox_open = false;
//     this.categories_checkbox_result = data;
//   }
// });
// alert.present().then(() => {
//   this.categories_checkbox_open = true;
// });
// }

// openImagePicker(){
//  this.imagePicker.hasReadPermission().then(
//    (result) => {
//      if(result == false){
//        // no callbacks required as this opens a popup which returns async
//        this.imagePicker.requestReadPermission();
//      }
//      else if(result == true){
//        this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
//          (results) => {
//            for (var i = 0; i < results.length; i++) {
//              this.cropService.crop(results[i], {quality: 75}).then(
//                newImage => {
//                  let image = newImage;
//                  if (this.platform.is('ios')) {
//                     image = image.replace(/^file:\/\//, '');
//                  }
//                  this.selected_image = image;
//                },
//                error => console.error("Error cropping image", error)
//              );
//            }
//          }, (err) => console.log(err)
//        );
//      }
//    }
//  )
// }

stripText(control: FormControl) {
control.setValue(control.value.replace(/[^0-9]/g, ''));
}

helpincrease() {
  this.counterValue++;
  this.post_form.controls['outside_stairs_to'].setValue(this.counterValue)
}

helpdecrease() {
  if(this.counterValue>0){
    this.counterValue--;
    this.post_form.controls['outside_stairs_to'].setValue(this.counterValue)
  }
}

hourincrease() {
  this.counterValueHour++;
  this.post_form.controls['inside_stairs_to'].setValue(this.counterValueHour)
}

hourdecrease() {
  if(this.counterValueHour>0){
    this.counterValueHour--;
    this.post_form.controls['inside_stairs_to'].setValue(this.counterValueHour)
  }
}

outsidencrease() {
  this.outside++;
  this.post_form.controls['outside_stairs_from'].setValue(this.outside)
}

outsidedecrease() {
  if(this.outside>0){
    this.outside--;
    this.post_form.controls['outside_stairs_from'].setValue(this.outside)
  }
}
insideincrease() {
  this.inside++;
  this.post_form.controls['inside_stairs_from'].setValue(this.inside)
}

insidedecrease() {
  if(this.inside>0){
    this.inside--;
    this.post_form.controls['inside_stairs_from'].setValue(this.inside)
  }
}
back(){
  this.nav.back()
}
}
