import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorsignupPage } from './vendorsignup.page';

const routes: Routes = [
  {
    path: '',
    component: VendorsignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorsignupPageRoutingModule {}
