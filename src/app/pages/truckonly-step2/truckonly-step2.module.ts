import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TruckonlyStep2PageRoutingModule } from './truckonly-step2-routing.module';

import { TruckonlyStep2Page } from './truckonly-step2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruckonlyStep2PageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TruckonlyStep2Page]
})
export class TruckonlyStep2PageModule {}
