import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonationitemPageRoutingModule } from './donationitem-routing.module';

import { DonationitemPage } from './donationitem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonationitemPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DonationitemPage]
})
export class DonationitemPageModule {}
