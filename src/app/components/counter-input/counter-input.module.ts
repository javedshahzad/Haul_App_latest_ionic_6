import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CounterInputPageRoutingModule } from './counter-input-routing.module';

import { CounterInputPage } from './counter-input.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CounterInputPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CounterInputPage]
})
export class CounterInputPageModule {}
