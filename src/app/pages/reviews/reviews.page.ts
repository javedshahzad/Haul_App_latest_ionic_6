import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  comments:any=[];
  constructor(
    public navCtrl: NavController,
     public activeRoute: ActivatedRoute
  ) { 
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.comments = res.comments;
    })
  }

  ngOnInit() {
  }
back(){
  this.navCtrl.back();
}
}
