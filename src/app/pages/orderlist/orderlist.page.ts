import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { ReviewsPage } from '../reviews/reviews.page';
@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.page.html',
  styleUrls: ['./orderlist.page.scss'],
})
export class OrderlistPage implements OnInit {
  orderList:any=[];
  noOrder: boolean = false;
  bidlist:any='';
  showBtn=-1;
  showPL:any = false;
  noBid:boolean = false;
  allReject:boolean = false;

  custId: any;

  showArc:boolean = false;

  page_no:any;

  morePagesAvailable:boolean = true;

  arcIds:number[] = new Array() 
  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    // public iab: InAppBrowser,
    // public viewCtrl : ViewController,
    // public appCtrl: App,
    private safariViewController: SafariViewController,
    public modalCtrl: ModalController,
    private util:UtilsService
  ) { 
    this.showArc = false;
  }

  ngOnInit() {
  }
back(){
  this.nav.navigateRoot("walkthrough")
}
  loadOrders(){
    this.morePagesAvailable = true;
    this.page_no = 0;
    this.showBtn=-1;
    this.showPL=false;
   this.util.startloading()
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let customer_id = userStoredData.user_id;
    this.custId = userStoredData.user_id;

    this.wordpressService.getVendorOrders(customer_id,this.page_no)
        .subscribe((res:any) => {
         this.util.dismisloading()
          let data = res.json();

          console.log('Load:', data);

          this.orderList = data;

          if(data=='' || data==undefined){
            this.noOrder = true;
            this.morePagesAvailable = false;
          }
          else{
            this.noOrder = false;
            this.morePagesAvailable = true;
          }

    });
  }

  loadMoreOrders(infiniteScroll){
    console.log('Async operation has ended');

    this.page_no = this.page_no + 1;

    this.showBtn=-1;
    this.showPL=false;
    
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let customer_id = userStoredData.user_id;
    this.custId = userStoredData.user_id;

    this.wordpressService.getVendorOrders(customer_id, this.page_no)
        .subscribe((res:any) => {
          
          let data = res.json();

          for(let post of data){
            this.orderList.push(post);
          }

          console.log('Load:', data);

          // this.orderList = data;

          if(data=='' || data==undefined){
            infiniteScroll.target.disabled = true;
          }
          else{
            infiniteScroll.target.disabled= false;
          }

          infiniteScroll.target.complete();
    });

  }

  ionViewWillEnter(){
    this.loadOrders();
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad OrderlistPage');
  }

  enableArchive(){
    this.showArc = !this.showArc;
  }

  viewOrder(order){
    console.log('view',order);
    this.nav.navigateForward("OrderdetailscustPage", {queryParams:{order}});
  }

  makePayment(pay_now_url,order_id){
    console.log(pay_now_url);

    this.safariViewController.isAvailable()
      .then((available: boolean) => {
          if (available) {
            this.safariViewController.show({
              url: pay_now_url,
              hidden: false,
              animated: false,
              transition: 'curl',
              enterReaderModeIfAvailable: true,
              tintColor: '#0080ff',
            })
            .subscribe((result: any) => {
                if(result.event === 'opened'){
                  console.log('Opened');
                }
                else if(result.event === 'loaded'){
                  console.log('Loaded');
                }
                else if(result.event === 'closed'){
                  console.log('Closed');
                  // let loading = this.loadingCtrl.create({content: 'Please wait...'});
                  // loading.present();
                  //   this.wordpressService.getOrderDetails(order_id)
                  //       .subscribe(res => {
                  //         loading.dismiss();
                  //         console.log('Closed 1');
                  //         console.log(res);
                  //         let data = res.json();
                  //         console.log('ostatus: ',data.status);
                  //         if(data.status=='processing'){
                  //           console.log('Closed 2');
                  //           this.wordpressService.paymentNotification(order_id,this.custId)
                  //               .subscribe(res => {
                  //                 console.log('Closed 3');
                  //                 console.log(res);
                  //                 this.loadOrders();
                  //           });
                  //         }
                  //         else{
                  //           this.loadOrders();
                  //         }
                  //   });
                  this.loadOrders();
                }
              },
              (error: any) => console.error(error)
            );
          } else {
          window.open(pay_now_url, '_blank','EnableViewPortScale=yes,location=no,hidden=no,closebuttoncaption=Go to My Account');
        
              // let loading = this.loadingCtrl.create({content: 'Please wait...'});
              // loading.present();
              // this.wordpressService.getOrderDetails(order_id)
              //     .subscribe(res => {
              //       loading.dismiss();
              //       console.log(res);
              //       let data = res.json();
              //       console.log('ostatus: ',data.status);
              //       if(data.status=='processing'){
              //         this.wordpressService.paymentNotification(order_id,this.custId)
              //             .subscribe(res => {
              //               console.log(res);
              //               this.loadOrders();
              //         });
              //       }
              //       else{
              //         this.loadOrders();
              //       }
              // });
        
          }
        }
      );


    // this.keyboard.hideFormAccessoryBar(false);
    // const browser = this.iab.create(pay_now_url, '_blank','EnableViewPortScale=yes,location=no,hidden=no,closebuttoncaption=Go to My Account');

    // const browser = this.iab.create(pay_now_url, '_blank','clearcache=yes,transitionstyle=crossdissolve,toolbarcolor=#f53d3d,closebuttoncolor=#ffffff,hidenavigationbuttons=yes,location=no,hidden=no,closebuttoncaption=Go Back');

  
    // browser.on('exit').subscribe(event => {
    //   this.viewCtrl.dismiss();
    //   // 
    //   this.wordpressService.getOrderDetails(order_id)
    //       .subscribe(res => {
    //         console.log(res);
    //         let data = res.json();
    //         console.log('ostatus: ',data.status);
    //         if(data.status=='processing'){
    //           this.wordpressService.paymentNotification(order_id,this.custId)
    //               .subscribe(res => {
    //                 console.log(res);

    //           });
    //         }
    //   });
    //    this.appCtrl.getRootNav().push(WalkthroughPage);

    // }, err => {
    //   this.viewCtrl.dismiss();
    //   this.appCtrl.getRootNav().push(WalkthroughPage);
    // });

  }

  showUndoBtn(index,order_id){
    this.showPL=true;
    this.showBtn=index;
    this.wordpressService.getVendorBids(order_id)
        .subscribe((res:any) => {
          this.showPL=false;
          let data = res.json();
          this.bidlist = data.bidData;
          console.log(data.code);
          if(data.code=='404'){
            this.noBid = true; 
            this.allReject = false;
          }
          else if(data.code=='408'){
            this.allReject = true;
            this.noBid = false;
          }
          else{
            this.noBid = false;
            this.allReject = false;
          }
          console.log(data);
    });
  }

  async bidApproval(status,role,order_id,vendor_id){
    let msg = 'Are you sure?';
    if(status=='accept'){
      msg = 'Are you sure to accept this bid request?';
    }
    else if(status=='reject'){
      msg = 'Are you sure to reject this bid request?';
    }

    let alert =await this.alertCtrl.create({
      header: 'Please confirm',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {

            let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
            let user_id = userStoredData.user_id;

          this.util.startloading()

            this.wordpressService.approveBid(status,role,user_id,order_id,vendor_id)
                .subscribe((res:any) => {
                 this.util.dismisloading()

                  if(res.json().order_id && res.json().order_id!=''){
                    let orderid = res.json().order_id;
                    let payment_url = res.json().payment_url;

                    this.makePayment(payment_url,orderid);

                  }
                  else{
                    this.loadOrders();
                  }
            });

          }
        }
      ]
    });
    alert.present();
  }

  async bidDetail(desc){

    console.log('d: ',desc);
    let alert =await this.alertCtrl.create({
      header: 'Description',
      message: desc,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    alert.present();
  }

  async setOrderStatus(order_id,order_status){
    console.log('accept',order_id);
    let msg = 'Are you sure?';

    if(order_status=='reject'){
      msg = 'Are you sure to cancel this request?';
    }

    let alert =await this.alertCtrl.create({
      header: 'Please confirm',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            // Accept Order request
            this.util.startloading()
            let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
            let customer_id = userStoredData.user_id;

            this.wordpressService.setOrderStatusByVendor(customer_id,order_id,order_status)
                .subscribe((res:any) => {
                  this.util.dismisloading()
                  let data = res.json();

                  console.log(data.msg);

                  this.loadOrders();

            });

          }
        }
      ]
    });
    alert.present();
  }

  addArc(oid, ev){
    console.log("oid: ", oid);

    if(ev.value) {

      if(this.arcIds.indexOf(oid) > -1){
      }
      else{
        this.arcIds.push(oid);
      }

      console.log("ARR: ", this.arcIds);
    }
    else{

      let index = this.arcIds.indexOf(oid);

      if(index > -1){
        this.arcIds.splice(index, 1);
      }
      console.log("ARR: ", this.arcIds);

    }
  }

  async submitArc(){
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let u_id = userStoredData.user_id;

    let len = this.arcIds.length;

    console.log(len);
    if(len<1){
      console.log("Please select atleast one order to archive!");
      let alert =await this.alertCtrl.create({
        header: "Please select atleast one order to archive!",
        cssClass: 'category-prompt',
        buttons: [{
        text: 'Ok'
      }]
      });
      alert.present();
    }else{
      console.log("yup! That's ok");

      let alert =await this.alertCtrl.create({
        header: 'Confirm Archive',
        message: 'Are you sure to make the selected orders to archive?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked');
              this.util.startloading()

              this.wordpressService.setOrderToArchive(this.arcIds, u_id)
                .subscribe(async (res:any) => {
                  console.log(res);

                  this.util.dismisloading()

                  let alert =await this.alertCtrl.create({
                    backdropDismiss: false,
                    header: res.json().msg,
                    cssClass: 'category-prompt',
                    buttons: [{
                      text: 'Ok',
                      handler: () => {
                        this.loadOrders();
                      }
                      
                    }]
                  });
                  alert.present();

                },
                err =>{   this.util.dismisloading(); }
              );
            }
          }
        ]
      });
      alert.present();

      
    }
  }

  giveRate(order_id, customer_id){
    this.nav.navigateForward("rating",{queryParams: {order_id:order_id, customer_id:customer_id}});
  }

  async showDesc(desc){
    if(desc=='undefined'){
      desc = '';
    }
    console.log('pd: ',desc);
    let alert =await this.alertCtrl.create({
      header: 'Provider Description',
      message: desc,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    alert.present();
  }

  viewArchive(){
    this.nav.navigateForward("archivedorders");
  }

  doRefresh(refresher) {
    this.morePagesAvailable = true;
    this.page_no = 0;

    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');

      this.showBtn=-1;
      this.showPL=false;
      let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
      let customer_id = userStoredData.user_id;
      this.custId = userStoredData.user_id;

      this.wordpressService.getVendorOrders(customer_id, this.page_no)
          .subscribe((res:any) => {
            let data = res.json();
            console.log('Load:', data);
            this.orderList = data;

            if(data=='' || data==undefined){
              this.noOrder = true;
              this.morePagesAvailable = false;
            }
            else{
              this.noOrder = false;
              this.morePagesAvailable = true;
            }
      });

      refresher.target.complete();
    }, 2000);
  }

  async gotoreviews(comments){
    console.log("LL: ", comments.length);
    if(comments.length>0){

      let profileModal =await this.modalCtrl.create({
        component:ReviewsPage,
        componentProps:{comments: comments}
      });
      profileModal.present();
      // this.nav.push(ReviewsPage, {comments: comments});
    }
    else{
      let alert =await this.alertCtrl.create({
        message: 'No review found.',
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
        ]
      });
      alert.present();
    }

    
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
                  this.util.dismisloading()
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

                  console.log("TTT1: ", topName);

                  this.nav.navigateForward("chat",{queryParams:{oid:order.id, vendor_name:order.vendor_name, customer_name:order.billing.first_name,nameFrom: userName, imgFrom:imageURI, idFrom:userId, toEmail: order.customer_email, topName:topName}});
            });
          }
    });
  }
}
