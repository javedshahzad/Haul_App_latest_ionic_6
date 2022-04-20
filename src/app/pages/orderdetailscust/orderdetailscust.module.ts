import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderdetailscustPageRoutingModule } from './orderdetailscust-routing.module';

import { OrderdetailscustPage } from './orderdetailscust.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderdetailscustPageRoutingModule
  ],
  declarations: [OrderdetailscustPage]
})
export class OrderdetailscustPageModule {}
