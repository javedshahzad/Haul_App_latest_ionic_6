import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickupItemPage } from './pickup-item.page';

const routes: Routes = [
  {
    path: '',
    component: PickupItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickupItemPageRoutingModule {}
