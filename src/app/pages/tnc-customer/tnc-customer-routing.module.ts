import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TncCustomerPage } from './tnc-customer.page';

const routes: Routes = [
  {
    path: '',
    component: TncCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TncCustomerPageRoutingModule {}
