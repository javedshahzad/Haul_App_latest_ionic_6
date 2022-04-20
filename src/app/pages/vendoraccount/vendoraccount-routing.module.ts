import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendoraccountPage } from './vendoraccount.page';

const routes: Routes = [
  {
    path: '',
    component: VendoraccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendoraccountPageRoutingModule {}
