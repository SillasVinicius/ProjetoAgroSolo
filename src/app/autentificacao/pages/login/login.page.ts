import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NavController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Usuario } from './model/usuario.model';
import { RecuperarSenhaPage} from 'src/app/autentificacao/recuperar-senha/recuperar-senha.page';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('movDiv', [
      state('cadastro', style({ 'margin-top': '-14%', 'height': '105%', 'border-radius': '3%' })),
      state('login', style({ 'margin-top': '33%', 'height': '79%', 'border-radius': '5%' })),
      transition('login => cadastro', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')]),
      transition('cadastro => login', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')])
    ]),
  ]
})
export class LoginPage implements OnInit {
  // variáveis login
  version: string = '';
  author: string = '';
  loginForm: FormGroup;
  logado = false;
  numberPattern = /^[0-9] * $/;

  private user: Observable<Usuario[]>;


  constructor(
    private formBuilder: FormBuilder,
    private ModalController: ModalController,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private network: Network
  ) {}

  ngOnInit() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
      const loading = await this.overlayService.loading({
        message: "sem internet!"
      });
        let connectSubscription = this.network.onConnect().subscribe(async () => {
        loading.dismiss();
      });
    });

    this.loginForm = this.formBuilder.group( {
      senha:this.formBuilder.control('123456', [Validators.required, Validators.minLength(6)]), 
      email:this.formBuilder.control('admin@gmail.com', [Validators.required, Validators.email]), 
      admin:this.formBuilder.control(false, [])
    }); 

    var packageJsonInfo = require('package.json'); 
    this.version = packageJsonInfo.version; 
    this.author = packageJsonInfo.author; 
  }

  get senha(): FormControl {
    return this.loginForm.get('senha') as FormControl;
  }
  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  logar(): void {
    this.logado = true;
  }
  async login() {
    const loading = await this.overlayService.loading({
      message: 'Logando...'
    });

    try {
      const sha1 = require('sha1');
      this.user = await this.usuarioService.loginDb(
        this.loginForm.get('email').value,
        sha1(this.loginForm.get('senha').value),
      );
      this.user.subscribe(async (r: Usuario[]) => {
        if (r.length >= 1) {
          console.log('Usuário Logado', this.user);
          this.usuarioService.setId(r[0].id);
          this.logar();
          this.navCtrl.navigateForward('/menu');
          this.usuarioService.logado = true;
          this.usuarioService.nomeUser = r[0].nome;
          this.usuarioService.urlFoto = r[0].foto;
          this.usuarioService.admin = r[0].admin;
        } else {
          this.user = await this.usuarioService.loginDbCliente(
            this.loginForm.get('email').value,
            sha1(this.loginForm.get('senha').value));
          this.user.subscribe(async (r: Usuario[]) => {
            if (r.length >= 1) {
              console.log('Usuário Logado', this.user);
              this.usuarioService.setId(r[0].id);
              this.logar();
              this.usuarioService.logado = true;
              this.usuarioService.nomeUser = r[0].nome;
              this.usuarioService.urlFoto = r[0].foto;
              this.usuarioService.admin = r[0].admin;
              this.navCtrl.navigateForward('/menu');
            }
            else {
              if (this.usuarioService.logado == true) {
                if (this.usuarioService.admin) this.navCtrl.navigateForward('/menu/usuario');
                else this.navCtrl.navigateForward('/menu/cliente'); 
              }
              else {
                await this.overlayService.toast({
                  message: 'Dados incorretos! Verifique-os e tente novamente!'
                });
                this.usuarioService.logado = false;
              }

            }
          });
        }

      });

    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao Logar usuário: ', error);
    } finally {
      loading.dismiss();
    }
  }

  onSubmit() {
    this.login();
  }


  async openModal() {
    const modal = await this.ModalController.create({
      component: RecuperarSenhaPage
    })
    modal.present();
  }


}
