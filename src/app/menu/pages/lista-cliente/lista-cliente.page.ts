import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { RelatorioClientePage } from "../relatorio-cliente/relatorio-cliente.page";


@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.page.html',
  styleUrls: ['./lista-cliente.page.scss']
})
export class ListaClientePage implements OnInit {
  clientes$: Observable<Cliente[]>;
  pdfObject: any;
  constructor(
    private navCtrl: NavController,
    private ModalController: ModalController,
    private clienteService: ClienteService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService
  ) {
   }


  listaCliente: Array<any> = [];
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.clienteService.initCliente();
      this.clientes$ = this.clienteService.getAll();
      this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    else {
      this.clientes$ = this.clienteService.initClienteId(this.usuarioService.id);
      this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
  } 

  atualizar(cliente: Cliente): void {
    this.navCtrl.navigateForward(`/menu/updateCliente/${cliente.id}`);
  }

  async deletar(cliente: Cliente): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o cliente "${cliente.nome}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.clienteService.init();
            await this.clienteService.delete(cliente);
            await this.clienteService.initCliente();
            await this.clienteService.delete(cliente);
            await this.overlayService.toast({
              message: `Cliente "${cliente.nome}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioClientePage
    })
    modal.present();
  } 

  async OpenEmailComposer()
  {

  //   const nodemailer = require("nodemailer");
  //   let testAccount = await nodemailer.createTestAccount();

  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass // generated ethereal password
  //   }
  // });

  // // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //   to: "bar@example.com, baz@example.com", // list of receivers
  //   subject: "Hello ✔", // Subject line
  //   text: "Hello world?", // plain text body
  //   html: "<b>Hello world?</b>" // html body
  // });

  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

}
