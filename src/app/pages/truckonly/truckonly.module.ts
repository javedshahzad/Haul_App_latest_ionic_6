import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TruckonlyPageRoutingModule } from './truckonly-routing.module';

import { TruckonlyPage } from './truckonly.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruckonlyPageRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [TruckonlyPage]
})
export class TruckonlyPageModule {}
