import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmallmovePage } from './smallmove.page';

const routes: Routes = [
  {
    path: '',
    component: SmallmovePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmallmovePageRoutingModule {}
