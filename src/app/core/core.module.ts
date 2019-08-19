import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CriaClienteService } from './services/cria-cliente.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
@NgModule({
  imports: [IonicModule.forRoot(), BrowserAnimationsModule, HttpClientModule, HttpModule],
  exports: [BrowserModule, IonicModule, BrowserAnimationsModule, HttpClientModule, HttpModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    HttpClientModule,
    CriaClienteService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ImagePicker
  ]
})
export class CoreModule {}
