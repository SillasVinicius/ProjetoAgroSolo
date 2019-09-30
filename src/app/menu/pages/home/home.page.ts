import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  nomeUser = '...';
  urlFoto = '...';
  constructor(
    private usuario: UsuarioService,
    private navCtrl: NavController
  ) {}
  linkCliente() {
    this.navCtrl.navigateForward('/menu/cliente');
  }
  linkOutorga() {
    this.navCtrl.navigateForward('/menu/outorga');
  }
  linkAmbiental() {
    this.navCtrl.navigateForward('/menu/ambiental');
  }
  linkAlterarUsuario() {
    this.navCtrl.navigateForward(`/menu/updateUsuario/${this.usuario.id}`);
  }
  ngOnInit() {
    this.nomeUser = this.usuario.nomeUser;
    this.urlFoto = this.usuario.urlFoto;
  }
  // async openGalery(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //     correctOrientation: true
  //   };
  //
  //   try {
  //     const fileUrl: string = await this.camera.getPicture(options);
  //     let file: string;
  //
  //     if (this.platform.is('ios')) {
  //       file = fileUrl.split('/').pop();
  //     } else {
  //       file= fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.indexOf('?'));
  //     }
  //
  //     const path: string = fileUrl.substring(0, fileUrl.lastIndexOf('/'));
  //
  //     const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
  //
  //     const blob: Blob = new Blob([buffer], {type: "image/jpeg"});
  //
  //     this.uploadPicture(blob);
  //
  //   }catch(error){
  //     console.error(error);
  //   }
  // }
  //
  // uploadPicture(blob: Blob){
  //     const ref = this.afStorage.ref('ionic.jpg');
  //     const task = ref.put(blob);
  //
  //     this.uploadPercent = task.percentageChanges();
  //     task.snapshotChanges().pipe(
  //       finalize(() => this.downloadUrl = ref.getDownloadURL())
  //     ).subscribe();
  // }

}
