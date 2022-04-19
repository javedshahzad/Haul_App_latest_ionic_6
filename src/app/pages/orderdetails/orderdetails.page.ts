import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { ReportproblemPage } from '../reportproblem/reportproblem.page';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.page.html',
  styleUrls: ['./orderdetails.page.scss'],
})
export class OrderdetailsPage implements OnInit {
  orderData:any;
order_id:any;
  constructor(
    private activeRoute: ActivatedRoute,
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public modalCtrl: ModalController,
    private util :UtilsService
    // private streamingMedia: StreamingMedia
  ) { 
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.orderData = res.order;
    })
  }

  ngOnInit() {
  }

  playVideo(v_url){
    // let options: StreamingVideoOptions = {
    //   successCallback: () => { console.log('Video played') },
    //   errorCallback: (e) => { console.log('Error streaming') },
    //   shouldAutoClose: true,
    //   controls: false
    // };
    
    // this.streamingMedia.playVideo(v_url, options);
  }

  gotochat(){
  this.util.startloading()
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let userId = userStoredData.user_id;
    let role = userStoredData.role;

    this.wordpressService.getUserProfile(userId)
    .subscribe(res => {
          
          if(role=='vendor'){

            let cn = this.orderData.billing.first_name;
            if(cn==''){
              cn = this.orderData.billing.email;
            }

            this.wordpressService.getVendorServiceSettings(userId)
                .subscribe((res:any) => { 
                this.util.dismisloading()
                  let data = res.json();

                  console.log("V: ", data);
                  let userName = this.orderData.vendor_name;
                  if(userName==''){
                    userName = this.orderData.vendor_email;
                  }
                  
                  let imageURI = data.imagepath;

                  let topName = '';
                  if(this.orderData.customer_name_show!=''){
                    topName = this.orderData.customer_name_show;              
                  }
                  else{
                    topName = this.orderData.customer_email_show;
                  } 

                  if(userName=='' || userName==null || userName==undefined){
                    console.log('vn: ', data.vendor_name);
                    let userName = this.hd(data.vendor_name);


                    console.log("TTT1: ", userName);

                    let cust_id = this.orderData.customer_id;
                    let ven_id = userId;
  
                    this.nav.navigateForward("chat",{queryParams:{oid:this.orderData.id, vendor_name:this.orderData.vendor_name, customer_name:cn,nameFrom: userName, imgFrom:imageURI, idFrom:userId, toEmail: this.orderData.vendor_email,topName:topName, cust_id: cust_id, ven_id: ven_id}});
                  }
                  else{
                    let cust_id = this.orderData.customer_id;
                    let ven_id = userId;
  
                    this.nav.navigateForward("chat",{queryParams:{oid:this.orderData.id, vendor_name:this.orderData.vendor_name, customer_name:cn,nameFrom: userName, imgFrom:imageURI, idFrom:userId, toEmail: this.orderData.vendor_email,topName:topName, cust_id: cust_id, ven_id: ven_id}});
                  }
                  
                  

                  
            });
      
          }
          else{
            this.util.dismisloading()
          }
    });

  }

  hd(value){
    let hideEle = '';
    if(value){
      let w = value;
      let wlen = w.length;
      
  
      for(let i=0;i<wlen;i++){
        if(i<3){
          hideEle += w[i];
        }
        else{
          hideEle += '.';
        }
      }
    }
    else{
      hideEle = '.....';
    }
    
    return hideEle;
  }

  async reportProblem(order_id){
    console.log("order id: ", order_id);

    let profileModal =await this.modalCtrl.create({
      component:ReportproblemPage,
      componentProps:{ order_id: order_id }
    });
    profileModal.present();

  }
  back(){
    this.nav.back();
  }
}
