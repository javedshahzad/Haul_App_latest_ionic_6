import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
  rating: number = 1;
  rating_form: FormGroup;

  order_id:any = '';
  customer_id:any = '';
  comment:any = '';

  vendor: any = '';
  show_msg:any = '';
  constructor(
    public loadingCtrl: LoadingController, 
    public wordpressService: WordpressService,
    public alertCtrl: AlertController,
    public nav: NavController,
    private activeRoute: ActivatedRoute,
    private util:UtilsService
  ) { 
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.order_id = res.order_id;
      this.customer_id = res.customer_id;
    })
  }

  ngOnInit() {
    
    this.rating_form = new FormGroup({
      comment: new FormControl(),
    })
    if(this.order_id!='' && this.customer_id!=''){
     this.util.startloading();

      this.wordpressService.checkRating(this.order_id, this.customer_id)
        .subscribe((res:any) => {
          this.util.dismisloading();
          let data = res.json().rateData;

          console.log("DATA: ", data);
          
           this.comment = data.comment;
           this.rating = data.rating;
          
          this.vendor = data.vendor;

        },
        err => {
          this.util.dismisloading();
        })

    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

  giveRating(){

    this.comment = this.rating_form.value.comment;
    console.log("here give rating!",this.comment+' '+ this.rating);

    

    if(this.order_id!='' && this.customer_id!=''){
      this.util.startloading();

      this.wordpressService.setRating(this.order_id, this.customer_id, this.rating, this.comment)
        .subscribe(async res => {

          this.util.dismisloading();
            let alert =await this.alertCtrl.create({
              backdropDismiss: false,
              cssClass: 'category-prompt',
              message:"Successfully submitted.",
              buttons: [{
                text: 'Ok',
                handler: () => {
                    this.nav.pop();
                }
              }]
            });
            alert.present();

            // this.show_msg = '<p class="p-succ">Successfully submitted.</p>';

        },
        err => {
          this.show_msg = '<p class="p-succ">Error Accurred.</p>';
          this.util.dismisloading();
        })

    }

  }
  logRatingChange(event){
    console.log(event)
    this.rating = event;
    console.log(this.rating )
  }
  back(){
    this.nav.back();
  }
}
