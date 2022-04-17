import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TruckonlyStep2Page } from './truckonly-step2.page';

const routes: Routes = [
  {
    path: '',
    component: TruckonlyStep2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckonlyStep2PageRoutingModule {}
