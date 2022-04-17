import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharitablePage } from './charitable.page';

const routes: Routes = [
  {
    path: '',
    component: CharitablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharitablePageRoutingModule {}
