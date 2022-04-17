import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickupItemPageRoutingModule } from './pickup-item-routing.module';

import { PickupItemPage } from './pickup-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickupItemPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PickupItemPage]
})
export class PickupItemPageModule {}
