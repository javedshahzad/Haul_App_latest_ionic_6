import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportproblemPage } from './reportproblem.page';

const routes: Routes = [
  {
    path: '',
    component: ReportproblemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportproblemPageRoutingModule {}
