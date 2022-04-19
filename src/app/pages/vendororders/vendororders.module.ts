import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorordersPageRoutingModule } from './vendororders-routing.module';

import { VendorordersPage } from './vendororders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorordersPageRoutingModule
  ],
  declarations: [VendorordersPage]
})
export class VendorordersPageModule {}
