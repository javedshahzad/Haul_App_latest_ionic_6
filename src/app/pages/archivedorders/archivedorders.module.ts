import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivedordersPageRoutingModule } from './archivedorders-routing.module';

import { ArchivedordersPage } from './archivedorders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivedordersPageRoutingModule
  ],
  declarations: [ArchivedordersPage]
})
export class ArchivedordersPageModule {}
