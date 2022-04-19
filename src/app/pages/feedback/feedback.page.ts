import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedback:Array<any>;
  user_id: any;
  userStoredData: any;
  total_reviews: any=[];
  morePagesAvailable:boolean = true;
  page_no:any;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util:UtilsService
  ) { }

  ngOnInit() {
    this.morePagesAvailable = true;
    this.page_no=0;
      this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
      if(this.userStoredData){
        this.user_id = this.userStoredData.user_id;
    this.util.startloading();
        this.wordpressService.getFeedack(this.user_id, this.page_no)
        .subscribe((res:any) => {
          this.feedback = res.json().feedback;
          this.total_reviews = res.json().total_reviews;
          
          if(res.json().total_reviews<1){
            this.morePagesAvailable = false;
          }
          else{
            this.morePagesAvailable = true;
          }
         this.util.dismisloading()
        },
        err => {
          this.util.dismisloading()
        })
      }
  }
  back(){
    this.navCtrl.back();
  }
 async doRefresh(refresher) {
    setTimeout(() => {
      this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
          if(this.userStoredData){
            this.morePagesAvailable = true;
            this.page_no=0;
            this.user_id = this.userStoredData.user_id;
            this.wordpressService.getFeedack(this.user_id, this.page_no)
            .subscribe((res:any) => {
              this.feedback = res.json().feedback;
              this.total_reviews = res.json().total_reviews;
              if(res.json().total_reviews<1){
                this.morePagesAvailable = false;
              }
              else{
                this.morePagesAvailable = true;
              }
            },
            err => {
            })
          }
      refresher.target.complete();
    }, 2000);
  }

  loadMoreFB(infiniteScroll){
    this.page_no = this.page_no + 1;
    this.user_id = this.userStoredData.user_id;
    this.wordpressService.getFeedack(this.user_id, this.page_no)
    .subscribe((res:any) => {
      for(let post of res.json().feedback){
        this.feedback.push(post);
      }
      if(res.json().total_reviews.length === 0){
        infiniteScroll.target.disabled = true;
      }
      infiniteScroll.target.complete();
    },
    err => {
      infiniteScroll.target.complete();
    })
  }

}
