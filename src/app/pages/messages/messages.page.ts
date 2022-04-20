import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  orderList: any;
  noOrder: boolean = false;
  userStoredData:any;
  userId:any;
  role:any;
  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util:UtilsService
  ) { }

  ngOnInit() {
    this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(this.userStoredData){
      this.userId = this.userStoredData.user_id;
      this.role = this.userStoredData.role;
    }

  }
  back(){
    this.nav.back();
  }
  ionViewWillEnter(){
    this.util.startloading();
    var userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(userStoredData){
      var user_id = userStoredData.user_id;
    }
  

    this.wordpressService.getOrdersChat(user_id)
        .subscribe((res:any) => {
        this.util.dismisloading();
          let data = res.json();
          this.orderList = data;

          console.log(this.orderList);

          this.orderList.sort(function(a, b) {
            if (parseInt(a.last_chat) < parseInt(b.last_chat)) {
                  return 1;
              } else if (parseInt(a.last_chat) > parseInt(b.last_chat)) {
                  return -1;
              }
              return 0;
          });

          if(data=='' || data==undefined){
            this.noOrder = true;
          }
          else{
            this.noOrder = false;
          }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }



  gotochat(order, vendor_id){
    console.log("ORDER: ", order);

    this.util.startloading();

    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let userId = userStoredData.user_id;
    let role = userStoredData.role;

    this.wordpressService.getUserProfile(userId)
    .subscribe(res => {
          
          if(role=='customer'){
           this.util.dismisloading();
            let userName = order.billing.first_name;
            if(userName==''){
              userName = order.billing.email;
            }
            let imageURI = '';

            this.wordpressService.getVendorDetails(vendor_id, order.id)
              .subscribe((res:any) => {
               this.util.dismisloading();
                let data = res.json();
                let vendor_name_show = data.vendor_name_show;
                let vendor_email_show = data.vendor_email_show;

                let topName = '';
                if(vendor_name_show!=''){
                  topName = vendor_name_show;              
                }
                else{
                  topName = vendor_email_show;
                } 

                console.log("TTT1: ", topName);

                let cust_id = userId;
                let ven_id = vendor_id;

                this.nav.navigateForward("chat",{queryParams:{oid:order.id, vendor_name:order.vendor_name, customer_name:order.billing.first_name,nameFrom: userName, imgFrom:imageURI, idFrom:userId, toEmail: order.vendor_email, topName:topName, cust_id: cust_id, ven_id: ven_id}});
            
            });

          }
          else if(role=='vendor'){
            this.wordpressService.getVendorServiceSettings(userId)
                .subscribe((res:any) => {
                 this.util.dismisloading();
                  let data = res.json();
                  let userName = order.vendor_name;
                  if(userName==''){
                    userName = order.vendor_email;
                  }
                  let imageURI = data.imagepath;

                  let topName = '';
                  if(order.customer_name_show!=''){
                    topName = order.customer_name_show;              
                  }
                  else{
                    topName = order.customer_email_show;
                  } 

                  let cust_id = order.customer_id;
                  let ven_id = userId;

                  console.log("TTT1: ", topName);

                  this.nav.navigateForward("chat",{queryParams:{oid:order.id, vendor_name:order.vendor_name, customer_name:order.billing.first_name,nameFrom: userName, imgFrom:imageURI, idFrom:userId, toEmail: order.customer_email, topName:topName, cust_id: cust_id, ven_id: ven_id}});
            });
          }
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');

    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let user_id = userStoredData.user_id;

    this.wordpressService.getOrdersChat(user_id)
        .subscribe((res:any) => {
          let data = res.json();
          this.orderList = data;

          console.log(this.orderList);

          this.orderList.sort(function(a, b) {
            if (parseInt(a.last_chat) < parseInt(b.last_chat)) {
                  return 1;
              } else if (parseInt(a.last_chat) > parseInt(b.last_chat)) {
                  return -1;
              }
              return 0;
          });

          if(data=='' || data==undefined){
            this.noOrder = true;
          }
          else{
            this.noOrder = false;
          }
    });

      refresher.target.complete();
    }, 2000);
  }
}
