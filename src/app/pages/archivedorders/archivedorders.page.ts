import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-archivedorders',
  templateUrl: './archivedorders.page.html',
  styleUrls: ['./archivedorders.page.scss'],
})
export class ArchivedordersPage implements OnInit {
  orderList:any=[];
  noOrder: boolean = false;
  bidlist:any='';
  showBtn=-1;
  showPL:any = false;
  noBid:boolean = false;
  allReject:boolean = false;
  custId: any;

  showArc:boolean = false;
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
back(){
  this.nav.back();
}
  ngOnInit() {
this.util.startloading()
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
   if(userStoredData){
    var customer_id = userStoredData.user_id;
    this.custId = userStoredData.user_id;
   }

    this.wordpressService.getArchivedOrders(customer_id)
        .subscribe((res:any) => {
      this.util.dismisloading();
          let data = res.json();

          console.log(data);

          this.orderList = data;

          if(data=='' || data==undefined){
            this.noOrder = true;
          }
          else{
            this.noOrder = false;
          }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchivedordersPage');
  }

  viewOrder(order){
    console.log('view',order);
    this.nav.navigateForward("orderdetailscust", {queryParams:{order}});
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

  async submitUnArc(){
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let u_id = userStoredData.user_id;

    let len = this.arcIds.length;

    console.log(len);
    if(len<1){
      let alert =await this.alertCtrl.create({
        header: "Please select atleast one order to unarchive!",
        cssClass: 'category-prompt',
        buttons: [{
        text: 'Ok'
      }]
      });
      alert.present();
    }else{
      console.log("yup! That's ok");

      let alert =await this.alertCtrl.create({
        header: 'Confirm Unarchive',
        message: 'Are you sure to make the selected orders to unarchive?',
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

              this.wordpressService.setOrderToUnArchive(this.arcIds, u_id)
                .subscribe(async (res:any) => {
                  console.log(res);

                  this.util.dismisloading()

                  let alert =await this.alertCtrl.create({
                    backdropDismiss: false,
                    message: res.json().msg,
                    cssClass: 'category-prompt',
                    buttons: [{
                      text: 'Ok',
                      handler: () => {
                        this.ngOnInit();
                      }
                      
                    }]
                  });
                  alert.present();

                },
                err =>{ this.util.dismisloading(); }
              );
            }
          }
        ]
      });
      alert.present();

      
    }
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');

      let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
      let customer_id = userStoredData.user_id;
      this.custId = userStoredData.user_id;

      this.wordpressService.getArchivedOrders(customer_id)
          .subscribe((res:any) => {
            let data = res.json();
            console.log(data);
            this.orderList = data;

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
