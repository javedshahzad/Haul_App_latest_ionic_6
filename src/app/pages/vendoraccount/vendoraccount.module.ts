import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendoraccountPageRoutingModule } from './vendoraccount-routing.module';

import { VendoraccountPage } from './vendoraccount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendoraccountPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VendoraccountPage]
})
export class VendoraccountPageModule {}
