import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowFriendsPageRoutingModule } from './show-friends-routing.module';

import { ShowFriendsPage } from './show-friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowFriendsPageRoutingModule
  ],
  declarations: [ShowFriendsPage]
})
export class ShowFriendsPageModule {}
