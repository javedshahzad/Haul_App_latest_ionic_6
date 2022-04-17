import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { BasenamePipe } from './pipes/basename.pipe';
import { HidevaluePipe } from './pipes/hidevalue.pipe';
import { KeyvaluePipe } from './pipes/keyvalue.pipe';
import { Device } from '@ionic-native/device/ngx'; 
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Camera,  } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [AppComponent, BasenamePipe, HidevaluePipe, KeyvaluePipe],
  entryComponents: [],
  imports: [BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(), 
    AppRoutingModule],
  providers: [
      Device,
      CallNumber,
      SMS,
      StatusBar,
      SplashScreen,
      Camera,
      File,
      FileTransfer,
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppModule {}
