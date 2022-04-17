import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharitablePageRoutingModule } from './charitable-routing.module';

import { CharitablePage } from './charitable.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharitablePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CharitablePage]
})
export class CharitablePageModule {}
