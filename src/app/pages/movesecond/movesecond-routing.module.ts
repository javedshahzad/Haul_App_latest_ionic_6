import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovesecondPage } from './movesecond.page';

const routes: Routes = [
  {
    path: '',
    component: MovesecondPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovesecondPageRoutingModule {}
