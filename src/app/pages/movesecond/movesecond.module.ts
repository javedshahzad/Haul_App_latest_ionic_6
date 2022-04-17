import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovesecondPageRoutingModule } from './movesecond-routing.module';

import { MovesecondPage } from './movesecond.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovesecondPageRoutingModule
  ],
  declarations: [MovesecondPage]
})
export class MovesecondPageModule {}
