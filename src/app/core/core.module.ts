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
import { DropzoneDirective } from './directives/dropzone.directive';

@NgModule({
  imports: [
    IonicModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
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
  ],
  declarations: [DropzoneDirective]
})
export class CoreModule {}
