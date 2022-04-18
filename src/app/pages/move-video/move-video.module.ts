import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoveVideoPageRoutingModule } from './move-video-routing.module';

import { MoveVideoPage } from './move-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoveVideoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MoveVideoPage]
})
export class MoveVideoPageModule {}
