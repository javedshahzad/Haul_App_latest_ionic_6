import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmallmovepicPageRoutingModule } from './smallmovepic-routing.module';

import { SmallmovepicPage } from './smallmovepic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmallmovepicPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SmallmovepicPage]
})
export class SmallmovepicPageModule {}
