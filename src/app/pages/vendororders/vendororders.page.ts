import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-vendororders',
  templateUrl: './vendororders.page.html',
  styleUrls: ['./vendororders.page.scss'],
})
export class VendorordersPage implements OnInit {
  orderList:any=[];
  noOrder: boolean = false;
  
  showArc:boolean = true;
  
  page_no:any;
  
  morePagesAvailable:boolean = true;
  
  arcIds:number[] = new Array() 
  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util:UtilsService
  ) { 
    this.showArc = false;
  }

  ngOnInit() {
  }
  loadOrders(){
    this.morePagesAvailable = true;
    this.page_no = 0;

    this.util.startloading();
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    if(userStoredData){
      var vendor_id = userStoredData.user_id;
     }

    this.wordpressService.getVendorOrders(vendor_id,this.page_no)
        .subscribe((res:any) => {
        this.util.dismisloading();
          let data = res.json();
          console.log(data);
          this.orderList = data;

          if(data=='' || data==undefined){
            this.noOrder = false;
            this.morePagesAvailable = false;
          }
          else{
            this.noOrder = true;
            this.morePagesAvailable = true;
          }
    },err=>{
      this.noOrder = false;
      this.morePagesAvailable = true;
    }
    );
  }
  ionViewWillEnter(){
    this.loadOrders();
  }
  viewOrder(order){
    console.log('view',order);
    this.nav.navigateForward("orderdetails",{queryParams: {order:order}});
  }
  back(){
    this.nav.back();
  }
 async setOrderStatus(order_id,order_status){
    console.log('accept',order_id);
    let msg = 'Are you sure?';
    if(order_status=='accept'){
      msg = 'Are you sure to accept this request?';
    }
    else if(order_status=='reject'){
      msg = 'Are you sure to reject this request?';
    }
    else if(order_status=='complete'){
      msg = 'Are you sure to complete this request?';
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
              
            this.util.startloading();
            let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
            let vendor_id = userStoredData.user_id;

            this.wordpressService.setOrderStatusByVendor(vendor_id,order_id,order_status)
                .subscribe((res:any) => {
                  this.util.dismisloading();
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

  async bidNow(orderid,product_type) {

    let alert =await this.alertCtrl.create({
      header: 'Enter the bid amount.',
      inputs: [
        {
          type: 'number',
          name: 'bid_amount',
          placeholder: 'Bid amount'
        },
        {
          type: 'textarea',
          name: 'description',
          placeholder: 'Description',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            if (data.bid_amount!='') {

              let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
              let vendor_id = userStoredData.user_id;

              this.util.startloading();
              this.wordpressService.bidAmount(vendor_id,orderid,data.bid_amount,data.description,product_type)
              .subscribe(res => {
                this.util.dismisloading();
                  this.loadOrders();
               })
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
}

  async bidApproval(status,role,order_id){
  let msg = 'Are you sure?';
  if(status=='reject'){
    msg = 'Are you sure to reject this request?';
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

          this.util.startloading();
          this.wordpressService.approveBid(status,role,user_id,order_id,user_id)
              .subscribe(res => {
                this.util.dismisloading();
                //let data = res.json();

                // let alert = this.alertCtrl.create({
                //   cssClass: 'category-prompt',
                //   buttons: [{
                //    text: 'Ok'
                //  }]
                // });
                
                // alert.setTitle(data.msg);
                // alert.present();

                this.loadOrders();
          });

        }
      }
    ]
  });
  alert.present();
}
enableArchive(){
  this.showArc = !this.showArc;
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
  if(userStoredData){
    var u_id = userStoredData.user_id;
  }

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

         
            this.util.startloading();

            this.wordpressService.setOrderToArchive(this.arcIds, u_id)
              .subscribe(async (res:any) => {
                console.log(res);

                this.util.dismisloading();

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
              err =>{    this.util.dismisloading(); }
            );
          }
        }
      ]
    });
    alert.present();

    
  }
}

viewArchive(){
  this.nav.navigateForward("ArchivedordersPage");
}

async doRefresh(refresher) {
  this.morePagesAvailable = true;
  this.page_no = 0;

  console.log('Begin async operation', refresher);

  setTimeout(() => {
    console.log('Async operation has ended');

    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
   if(userStoredData){
    var vendor_id = userStoredData.user_id;
   }

    this.wordpressService.getVendorOrders(vendor_id, this.page_no)
        .subscribe((res:any) => {
          let data = res.json();
          console.log(data);
          this.orderList = data;

          if(data=='' || data==undefined){
            this.noOrder = false;
            this.morePagesAvailable = true;
          }
          else{
            this.noOrder = false;
            this.morePagesAvailable = true;
          }
    });

    refresher.target.complete();
  }, 2000);
}
loadMoreOrders(infiniteScroll){
  console.log('Async operation has ended');

  this.page_no = this.page_no + 1;


  let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
  let vendor_id = userStoredData.user_id;

  this.wordpressService.getVendorOrders(vendor_id,this.page_no)
      .subscribe((res:any) => {

        let data = res.json();

        for(let post of data){
          this.orderList.push(post);
        }

        if(data=='' || data==undefined){
          infiniteScroll.target.disabled = true;
        }
        else{
          infiniteScroll.target.disabled = false;
        }

        infiniteScroll.target.complete();
  });

}
}
