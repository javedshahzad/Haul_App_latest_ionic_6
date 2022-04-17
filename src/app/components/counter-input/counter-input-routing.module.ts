import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CounterInputPage } from './counter-input.page';

const routes: Routes = [
  {
    path: '',
    component: CounterInputPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounterInputPageRoutingModule {}
