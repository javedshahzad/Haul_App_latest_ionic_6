import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TruckonlySignupPageRoutingModule } from './truckonly-signup-routing.module';

import { TruckonlySignupPage } from './truckonly-signup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruckonlySignupPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TruckonlySignupPage]
})
export class TruckonlySignupPageModule {}
