import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerProfileSettingsPageRoutingModule } from './customer-profile-settings-routing.module';

import { CustomerProfileSettingsPage } from './customer-profile-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerProfileSettingsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CustomerProfileSettingsPage]
})
export class CustomerProfileSettingsPageModule {}
