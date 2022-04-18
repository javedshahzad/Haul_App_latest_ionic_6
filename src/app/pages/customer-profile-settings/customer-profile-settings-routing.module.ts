import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerProfileSettingsPage } from './customer-profile-settings.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerProfileSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerProfileSettingsPageRoutingModule {}
