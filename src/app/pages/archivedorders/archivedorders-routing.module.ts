import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivedordersPage } from './archivedorders.page';

const routes: Routes = [
  {
    path: '',
    component: ArchivedordersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivedordersPageRoutingModule {}
