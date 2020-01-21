import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosPessoais } from '../../models/dadosPessoais.model';
import { finalize, take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { DadosPessoaisService } from 'src/app/core/services/dados-pessoais.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-dados-pessoais',
  templateUrl: './dados-pessoais.page.html',
  styleUrls: ['./dados-pessoais.page.scss'],
})
export class DadosPessoaisPage implements OnInit {
  impostoDeRenda$: Observable<DadosPessoais[]>;
  cnh$: Observable<DadosPessoais[]>;

  // Arquivos
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  public urlFoto: string;
  arquivos: Object;
  files2: Observable<any[]>;
  fileName = '';

  constructor(
    private navCtrl: NavController,
    private dpService: DadosPessoaisService,
    private overlayService: OverlayService,
    private storage: AngularFireStorage,
    private usuarioService: UsuarioService,
    private iab: InAppBrowser,
    private document: DocumentViewer,
    private platform: Platform
  ) {}

  async ngOnInit(): Promise<void>{
      const loading = await this.overlayService.loading();
      this.dpService.initImpostoDeRenda();
      this.impostoDeRenda$ = this.dpService.getAll();
      this.impostoDeRenda$.pipe(take(1)).subscribe(() => loading.dismiss());

      const loading2 = await this.overlayService.loading();
      this.dpService.initCnh();
      this.cnh$ = this.dpService.getAll();
      this.cnh$.pipe(take(1)).subscribe(() => loading2.dismiss());
  }

  openLink(link: string){
    if (this.platform.is("mobile")) {
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      }
      this.document.viewDocument(`${link}`, 'application/pdf', options)
    }
    else {
      this.iab.create(`${link}`, `_system`);
    }
    console.log(this.platform.is("mobile"));
  }

  iniciar(): void {
    this.dpService.init();
  }

  async openGaleryImpostoDeRendaCreate(event: FileList){
    try {
      const file = event.item(0);
        if (file.type.split('/')[0] === 'image') {
          await this.overlayService.toast({
            message: 'tipo de arquivo não pode ser enviado por esse campo :('
          });
          return;
        }
      this.fileName = file.name;
      this.arquivos = file;
      this.uploadFileToImpostoDeRenda(file);

    }catch(error){
      console.error(error);
    }
  }

  async openGaleryImpostoDeRendaUpdate(event: FileList, id?: string){
    try {
      const file = event.item(0);
        if (file.type.split('/')[0] === 'image') {
          await this.overlayService.toast({
            message: 'tipo de arquivo não pode ser enviado por esse campo :('
          });
          return;
        }
      this.fileName = file.name;
      this.arquivos = file;
      this.uploadFileToImpostoDeRendaUpdate(file, id);

    }catch(error){
      console.error(error);
    }
  }

  async openGaleryCnhCreate(event: FileList){
    try {
      const file = event.item(0);
        if (file.type.split('/')[0] === 'image') {
          await this.overlayService.toast({
            message: 'tipo de arquivo não pode ser enviado por esse campo :('
          });
          return;
        }
      this.fileName = file.name;
      this.arquivos = file;
      this.uploadFileToCnh(file);

    }catch(error){
      console.error(error);
    }
  }

  async openGaleryCnhUpdate(event: FileList, id?: string){
    try {
      const file = event.item(0);
        if (file.type.split('/')[0] === 'image') {
          await this.overlayService.toast({
            message: 'tipo de arquivo não pode ser enviado por esse campo :('
          });
          return;
        }
      this.fileName = file.name;
      this.arquivos = file;
      this.uploadFileToCnhUpdate(file, id);

    }catch(error){
      console.error(error);
    }
  }

  async uploadFileToImpostoDeRenda(file: Object){

      const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/impostoDeRenda/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          this.downloadUrl.subscribe(async r => {
            this.dpService.initImpostoDeRenda();
            const addImpostoDeRenda = await this.dpService.create({
              id: this.dpService.usuarioId,
              impostoDeRenda: r
            });
          });
        })
      ).subscribe();
  }

  async uploadFileToImpostoDeRendaUpdate(file: Object, id?: string){

    const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/impostoDeRenda/${this.fileName}`);
    const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          if (this.dpService.id) {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initImpostoDeRenda();
              const updateImpostoDeRenda = await this.dpService.update({
                id: this.dpService.id,
                impostoDeRenda: r
              });
            });
          }
          else {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initImpostoDeRenda();
              const updateImpostoDeRenda = await this.dpService.update({
                id: id,
                impostoDeRenda: r
              });
            });
          }


        })
      ).subscribe();
  }

  async uploadFileToCnh(file: Object){

      const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/cnh/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          this.downloadUrl.subscribe(async r => {
            this.dpService.initCnh();
            const addCnh= await this.dpService.create({
              id: this.dpService.usuarioId,
              cnh: r
            });
          });
        })
      ).subscribe();
  }

  async uploadFileToCnhUpdate(file: Object, id?: string){

    const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/cnh/${this.fileName}`);
    const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          if (this.dpService.id) {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initCnh();
              const updateCnh = await this.dpService.update({
                id: this.dpService.id,
                cnh: r
              });
            });
          }
          else {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initCnh();
              const updateCnh = await this.dpService.update({
                id: id,
                cnh: r
              });
            });
          }


        })
      ).subscribe();
  }


}
