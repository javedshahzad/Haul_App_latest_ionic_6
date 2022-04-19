import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportproblemPageRoutingModule } from './reportproblem-routing.module';

import { ReportproblemPage } from './reportproblem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportproblemPageRoutingModule
  ],
  declarations: [ReportproblemPage]
})
export class ReportproblemPageModule {}
