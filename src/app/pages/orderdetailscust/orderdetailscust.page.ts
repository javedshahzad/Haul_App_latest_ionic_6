import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { ReportproblemPage } from '../reportproblem/reportproblem.page';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
@Component({
  selector: 'app-orderdetailscust',
  templateUrl: './orderdetailscust.page.html',
  styleUrls: ['./orderdetailscust.page.scss'],
})
export class OrderdetailscustPage implements OnInit {
  orderData:any;
  order_id:any;
  constructor(
    private activeRoute: ActivatedRoute,
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public modalCtrl: ModalController,
    private util :UtilsService,
    private streamingMedia: StreamingMedia
  ) {
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.orderData = res.order;
    })
   }

  ngOnInit() {
    
  }

  playVideo(v_url){
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      shouldAutoClose: true,
      controls: false
    };
    
    this.streamingMedia.playVideo(v_url, options);
  }

  gotochat(){
 this

    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let userId = userStoredData.user_id;
    let role = userStoredData.role;
    this.util.startloading()
    this.wordpressService.getUserProfile(userId)
    .subscribe(res => {

      console.log('CHAT ORDER INSIDE: ', this.orderData);
          
          if(role=='customer'){
            this.util.dismisloading();
            let userName = this.orderData.billing.first_name;
            if(userName==''){
              userName = this.orderData.billing.email;
            }
            let imageURI = '';

            let topName = '';
            if(this.orderData.vendor_name_show!=''){
              topName = this.orderData.vendor_name_show;              
            }
            else{
              topName = this.orderData.vendor_email_show;
            } 

            let cust_id = userId;
            let ven_id = this.orderData.vendor_id;


            this.nav.navigateForward("chat",{queryParams:{oid:this.orderData.id, vendor_name:this.orderData.vendor_name, customer_name:this.orderData.billing.first_name,nameFrom: userName, imgFrom:imageURI, idFrom:userId, toEmail: this.orderData.vendor_email,topName:topName, cust_id: cust_id, ven_id: ven_id}});
          }
          else{
            this.util.dismisloading();
          }
    });

  }

  async reportProblem(order_id){
    console.log("order id: ", order_id);

    let profileModal =await this.modalCtrl.create({
      component:ReportproblemPage,
      componentProps:{ order_id: order_id }
    });
    profileModal.present();

  }

  gotoreviews(comments){
    this.nav.navigateForward("reviews",{queryParams: {comments: comments}});
  }
  back(){
    this.nav.back();
  }
}
