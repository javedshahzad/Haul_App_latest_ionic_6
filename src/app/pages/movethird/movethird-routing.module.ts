import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovethirdPage } from './movethird.page';

const routes: Routes = [
  {
    path: '',
    component: MovethirdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovethirdPageRoutingModule {}
