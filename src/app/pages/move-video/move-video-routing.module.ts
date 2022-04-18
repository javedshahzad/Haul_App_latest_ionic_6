import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoveVideoPage } from './move-video.page';

const routes: Routes = [
  {
    path: '',
    component: MoveVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoveVideoPageRoutingModule {}
