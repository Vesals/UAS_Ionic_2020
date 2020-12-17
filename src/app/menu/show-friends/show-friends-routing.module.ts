import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowFriendsPage } from './show-friends.page';

const routes: Routes = [
  {
    path: '',
    component: ShowFriendsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowFriendsPageRoutingModule {}
