import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { UtilsService } from 'src/app/providers/utils.service';
import { WordpressService } from 'src/app/providers/wordpress.service';

@Component({
  selector: 'app-reportproblem',
  templateUrl: './reportproblem.page.html',
  styleUrls: ['./reportproblem.page.scss'],
})
export class ReportproblemPage implements OnInit {
  report_form: FormGroup;
  order_id: any = '';

  show_msg:any = '';
  constructor(
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public params: NavParams,
    public modalCtrl : ModalController,
    private util:UtilsService
  ) {
    this.report_form = new FormGroup({
      message: new FormControl('', Validators.required)
    })

    this.order_id = this.params.get('order_id');
   }

  ngOnInit() {
  }
  ionViewDidLoad(){
    console.log('ionViewDidLoad ReportproblemPage');
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

  sendEmail(){
 this.util.startloading()
    let userStoredData = JSON.parse(localStorage.getItem('userStoredData'));
    let userId = userStoredData.user_id;
    let role = userStoredData.role;
    let form_data= this.report_form.value;

    if(userId!=''){

      this.wordpressService.reportProblemEmail(form_data,userId,role,this.order_id)
        .subscribe((res:any) => {
             console.log(res.json());
             this.util.dismisloading()

            if(res.json().status=='ok'){
              this.show_msg = '<p class="p-succ">'+res.json().msg;+'</p>';
            }
            else{
              this.show_msg = '<p class="p-err">'+res.json().msg;+'</p>';
            }
            //this.viewCtrl.dismiss();
         },
         err => {
          console.log(err.json());
          this.util.dismisloading();

          this.show_msg = '<p class="p-err">'+err.json().msg;+'</p>';

         })
    }
    
  }
}
