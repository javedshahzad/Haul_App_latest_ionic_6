import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { WordpressService } from 'src/app/providers/wordpress.service';
import distanceInWordsToNow from 'date-fns/formatDistanceToNow';
import firebase from 'firebase';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  chatbox:any;
  ref:any;
  messagesList:any;
  newmessage:any;
  current_page = 9;
  per_page = 9;
  morePagesAvailable:boolean = true;
  isCust:boolean=false;
  chatEnd:boolean=true;
  chatEndDealer:boolean=true;
  dealerDeviceToken:any;
  spDeviceToken:any;
  senderDeviceToken:any;
  userRole:any;
  
  fromPage: any = '';
  senderName: any;
  someTextUrl:any;
  selectedPhoto;
  loadings;
  currentImage;
  pdffilepath:any;
  imgfilepath:any;
  d_addr:any;
  d_contact:any;
  c_zip:any;

  userId:any;
  userStoredData: any;
  userName:any;
  role:any;
  nameTo:any;
  imageURI:any = '';
  toEmail:any;

  orderId: any;
  topName:any;
  orderStatus:any='';

  ref3:any;

  cust_id:any;
  ven_id:any;

  chat_id:any;
  constructor(
    public activeRoute:ActivatedRoute,
    public wordpressService: WordpressService,
    private nav:NavController
  ) {
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res)
      this.orderId = res.oid;

      this.userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
  
      this.userId = this.userStoredData.user_id;
      this.role = this.userStoredData.role;
  
      if(this.role=='customer'){
        this.nameTo = res.vendor_name; 
      }else{
        this.nameTo = res.customer_name; 
      }
  
      this.cust_id = res.cust_id; 
      this.ven_id = res.ven_id;
  
      this.topName = res.topName;
  
      console.log("TTT: ", this.topName);
  
      this.toEmail = res.toEmail;   
  
      this.imageURI = res.imgFrom;
      this.userName = res.nameFrom;
      this.userId = res.idFrom;
    })
    this.chatbox = {
      id: this.orderId,
      topDetails: 'Order Id: '+this.orderId,
      nameTo: this.nameTo,
      nameFrom: this.userName,
      idFrom: this.userId,
      picFrom: this.imageURI,
    };

    console.log("OID: ", this.chatbox);

    this.chat_id = this.chatbox.id+'-'+this.cust_id+'-'+this.ven_id;

    console.log("chat id: ", this.chat_id);
   }

  ngOnInit() {
  }
  back(){
    this.nav.back();
  }
  ionViewDidLoad(){
    //Get order status : START
    this.wordpressService.getOrderStatus(this.orderId)
    .subscribe((res:any) => { 
      this.orderStatus = res.json().os;
      console.log('oS1: ',this.orderStatus);

      console.log('chat: ', this.chatbox);

      this.ref.orderByKey().limitToLast(this.current_page).on('value',data => {
        let tmp = [];
        data.forEach( data => {

        tmp.push({
          key: data.key,
          name: data.val().name,
          message: data.val().message,
          userid:parseInt(data.val().userid),
          user_image:data.val().user_image,
          read_msg:data.val().read_msg,
          time: distanceInWordsToNow(data.val().time),
        })

        if(data.val().read_msg=='0'){
          if(parseInt(data.val().userid)!=parseInt(this.userId)){
             firebase.database().ref('chatbox/'+this.chat_id+'/'+data.key).update({ read_msg: "1" });
          }
        }

        setTimeout(() => {
          var elements = document.getElementsByClassName('gr-bg');
          console.log(elements);
          while(elements.length > 0){
            elements[0].classList.remove('gr-bg');
          }
  
          var elements2 = document.getElementsByClassName('unread');
          console.log(elements2);
          while(elements2.length > 0){
            elements2[0].classList.remove('unread');
          }
  
        }, 6000);

      });
      this.messagesList = tmp;
      this.current_page = this.current_page + this.per_page;

      let k = 0;
      this.messagesList.forEach(function (prediction) {
        if(prediction['read_msg']==0 && k!=1){
          prediction['latest'] = 1;
          k=1;
        }       
      });
      console.log(this.messagesList);
      this.scrollToBottomFunction();
    });
    })

    this.wordpressService.readMessage(this.orderId, this.userId, this.chat_id)
      .subscribe(res => {

      });
  }

  ionViewWillLeave(){
    this.ref.off();
    this.wordpressService.readMessage(this.orderId, this.userId, this.chat_id)
      .subscribe(res => {

      });
  }

  ionViewDidLeave(){

  }

  sendMessage(order_id){
   console.log(order_id);
   console.log(this.newmessage);
   if (this.newmessage == undefined || this.newmessage == 'undefined' || (this.newmessage).trim() == '') { this.newmessage=''; return false; }
   let time = Date.now();
   this.ref.push({
     name: this.chatbox.nameFrom,
     message: this.newmessage,
     userid: parseInt(this.chatbox.idFrom),
     user_image:this.chatbox.picFrom,
     time:time,
     read_msg: '0'
   });
   this.scrollToBottomFunction();
   this.newmessage='';

   this.wordpressService.updateMessage(order_id, this.userId, this.chat_id)
   .subscribe(res => {

   });

   //Send push notifications

   //this.send_push_notification(this.chatbox.dealerDeviceToken);
   let user: any;
   this.wordpressService.getUser()
   .then(res => {
     user = res;
     this.senderDeviceToken = user.deviceToken;
     this.senderName = user.displayname;
   });

   console.log("userRole: ", this.role);
  
   this.wordpressService.send_chat_notification(this.chatbox.id, this.role, this.chat_id, this.cust_id, this.ven_id)
   .subscribe(res => {
     console.log('send_push_notification');
   })

 }

 scrollToBottomFunction() {
    setTimeout(() => {
      if(this.content.scrollX) this.content.scrollToBottom();
    }, 400)
  }

  loadMoreLeads(infiniteScroll) {
    setTimeout(() => {
      this.ref.orderByKey().limitToLast(this.current_page).on('value',data => {
        let tmp = [];
        data.forEach( data => {
          tmp.push({
            key: data.key,
            name: data.val().name,
            message: data.val().message,
            userid:parseInt(data.val().userid),
            user_image:data.val().user_image,
            read_msg:data.val().read_msg,
            time: distanceInWordsToNow(data.val().time),
          })
    
          // console.log("USER B4 RR:", this.userId+' ---- '+data.val().userid);
    
          if(data.val().read_msg=='0'){
            if(parseInt(data.val().userid)!=parseInt(this.userId)){
               firebase.database().ref('chatbox/'+this.chat_id+'/'+data.key).update({ read_msg: "1" });
            }
          }
    
        });
        this.messagesList = tmp;
        this.current_page = this.current_page + this.per_page;
    
        let k = 0;
        this.messagesList.forEach(function (prediction) {
          if(prediction['read_msg']==0 && k!=1){
            prediction['latest'] = 1;
            k=1;
          }       
        });
    
      });
      infiniteScroll.target.complete();
    }, 2000);

 }

 onTouch(){
   console.log('here touch');
 }

}
