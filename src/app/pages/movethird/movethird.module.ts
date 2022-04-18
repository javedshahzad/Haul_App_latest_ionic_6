import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovethirdPageRoutingModule } from './movethird-routing.module';

import { MovethirdPage } from './movethird.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovethirdPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MovethirdPage]
})
export class MovethirdPageModule {}
