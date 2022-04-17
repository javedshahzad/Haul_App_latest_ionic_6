import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovePageRoutingModule } from './move-routing.module';

import { MovePage } from './move.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MovePage]
})
export class MovePageModule {}
