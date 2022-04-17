import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {
  contact_form: FormGroup;
  show_msg: any = '';

  senderName: any = '';
  senderEmail: any = '';
  constructor(
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    private util :UtilsService,
    public nav: NavController,
  ) { }

  ngOnInit() {
    this.contact_form = new FormGroup({
      sender_name: new FormControl('', Validators.required),
      sender_email: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      contact_number: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    })

    let lstorage = localStorage.getItem('userStoredData');

    if(lstorage){
      let userStoredData = JSON.parse(lstorage);
      if(userStoredData!=undefined){
        this.util.startloading()
  
        let user_id = userStoredData.user_id;
  
        this.wordpressService.getUserProfile(user_id)
        .subscribe((res:any) => {
            this.util.dismisloading()
             let resData = res.json();
             this.senderName = resData.first_name;
             this.senderEmail = resData.email;
         },
         err => {
          this.util.dismisloading()
         })
      }
    }
  }
  contactHaul(){
  this.util.startloading()
    let form_data= this.contact_form.value;

    this.wordpressService.contactHaulEmail(form_data)
      .subscribe((res:any) => {
          console.log(res.json());
          this.util.dismisloading()

          if(res.json().status=='ok'){
            this.show_msg = '<p class="p-succ">'+res.json().msg;+'</p>';
          }
          else{
            this.show_msg = '<p class="p-err">'+res.json().msg;+'</p>';
          }
        },
        err => {
          console.log(err.json());
          this.util.dismisloading()
          this.show_msg = '<p class="p-err">'+err.json().msg;+'</p>';
        })
  }
  back(){
    this.nav.back()
  }
}
