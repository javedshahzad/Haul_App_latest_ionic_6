import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderdetailscustPage } from './orderdetailscust.page';

const routes: Routes = [
  {
    path: '',
    component: OrderdetailscustPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderdetailscustPageRoutingModule {}
