import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorsignupPageRoutingModule } from './vendorsignup-routing.module';

import { VendorsignupPage } from './vendorsignup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorsignupPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VendorsignupPage]
})
export class VendorsignupPageModule {}
