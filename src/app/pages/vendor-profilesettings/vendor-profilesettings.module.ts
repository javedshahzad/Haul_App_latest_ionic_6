import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorProfilesettingsPageRoutingModule } from './vendor-profilesettings-routing.module';

import { VendorProfilesettingsPage } from './vendor-profilesettings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorProfilesettingsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VendorProfilesettingsPage]
})
export class VendorProfilesettingsPageModule {}
