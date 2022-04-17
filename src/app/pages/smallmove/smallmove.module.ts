import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmallmovePageRoutingModule } from './smallmove-routing.module';

import { SmallmovePage } from './smallmove.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmallmovePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SmallmovePage]
})
export class SmallmovePageModule {}
