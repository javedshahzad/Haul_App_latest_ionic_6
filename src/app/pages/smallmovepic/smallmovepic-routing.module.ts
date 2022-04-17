import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmallmovepicPage } from './smallmovepic.page';

const routes: Routes = [
  {
    path: '',
    component: SmallmovepicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmallmovepicPageRoutingModule {}
