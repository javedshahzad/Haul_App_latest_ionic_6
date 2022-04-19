import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorordersPage } from './vendororders.page';

const routes: Routes = [
  {
    path: '',
    component: VendorordersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorordersPageRoutingModule {}
