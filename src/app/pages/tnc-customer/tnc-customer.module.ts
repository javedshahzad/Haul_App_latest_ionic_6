import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TncCustomerPageRoutingModule } from './tnc-customer-routing.module';

import { TncCustomerPage } from './tnc-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TncCustomerPageRoutingModule
  ],
  declarations: [TncCustomerPage]
})
export class TncCustomerPageModule {}
