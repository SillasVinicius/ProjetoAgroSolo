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
import { FileImageService } from './services/file-image.service';
import { ChangeDetectorRef } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { DataService } from './services/data.service';

@NgModule({
  imports: [
    IonicModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDXI4oKUtQB00mbxl4lLMyb3xaJoD_1TM4',
      authDomain: 'agrosolo-a5c19.firebaseapp.com',
      databaseURL: 'https://agrosolo-a5c19.firebaseio.com',
      projectId: 'agrosolo-a5c19',
      storageBucket: 'agrosolo-a5c19.appspot.com',
      messagingSenderId: '842160787962',
      appId: '1:842160787962:web:9a6aadedee803a2a'
    }),
    AngularFirestoreModule
  ],
  exports: [BrowserModule, IonicModule, BrowserAnimationsModule, HttpClientModule, HttpModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    HttpClientModule,
    CriaClienteService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ImagePicker,
    FileImageService,
    DataService
  ]
})
export class CoreModule {}
