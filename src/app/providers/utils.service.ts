import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingCtrl: LoadingController,
    private toastr: ToastController
  ) { }

  
  async toast(message){
    const  toast = await this.toastr.create({
  message:message,
  position:'bottom',
  color:"primary",
  duration:3000,
  mode:"ios"
  
  });
  toast.present();
  //end of toast
  }
  async startloading(){
    const loading= await this.loadingCtrl.create({
      message:"Please wait...",
      spinner:"bubbles",
      showBackdrop:true,
      duration:10000
    });
    loading.present();
  }
  async dismisloading(){
    return await this.loadingCtrl.dismiss();
    }
}
