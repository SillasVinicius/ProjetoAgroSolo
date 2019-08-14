import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CriaClienteService } from 'src/app/core/services/cria-cliente.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cria-cliente',
  templateUrl: './cria-cliente.page.html',
  styleUrls: ['./cria-cliente.page.scss']
})
export class CriaClientePage implements OnInit {
  clienteForm: FormGroup;
  numberPattern = /^[0-9]*$/;
  botaoTitle = '...';
  pageTitle = '...';
  clienteId: string = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private criaClienteService: CriaClienteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.clienteForm = this.formBuilder.group({
      id: this.formBuilder.control('' + this.id(), []),
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      cpf: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      patrimonio: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      pdtvAgro: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      foto: this.formBuilder.control('', [])
    });

    this.inicio();
  }

  inicio(): void {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (!clienteId) {
      this.pageTitle = 'Cadastrar Cliente';
      this.botaoTitle = 'CADASTRAR';
      return;
    }
    this.clienteId = clienteId;
    this.pageTitle = 'Atualizar Cliente';
    this.botaoTitle = 'ATUALIZAR';
    this.criaClienteService
      .get(clienteId)
      .then(
        (result: any) => (
          this.clienteForm.get('nome').setValue(result.nome),
          this.clienteForm.get('cpf').setValue(result.cpf),
          this.clienteForm.get('pdtvAgro').setValue(result.pdtvAgro),
          this.clienteForm.get('patrimonio').setValue(result.patrimonio)
        )
      );
  }

  get cpf(): FormControl {
    return this.clienteForm.get('cpf') as FormControl;
  }
  get foto(): FormControl {
    return this.clienteForm.get('foto') as FormControl;
  }
  get pdtvAgro(): FormControl {
    return this.clienteForm.get('pdtvAgro') as FormControl;
  }
  get nome(): FormControl {
    return this.clienteForm.get('nome') as FormControl;
  }
  get patrimonio(): FormControl {
    return this.clienteForm.get('patrimonio') as FormControl;
  }
  get pegaId(): FormControl {
    return this.clienteForm.get('id') as FormControl;
  }

  id(): number {
    return Math.floor(Math.random() * 89999 + 10000);
  }

  async criaCliente() {
    const loading = await this.overlayService.loading({
      message: 'Criando...'
    });
    // tslint:disable-next-line: max-line-length
    await this.criaClienteService
      .criaCliente(
        this.pegaId.value,
        this.nome.value,
        this.cpf.value,
        this.patrimonio.value,
        this.pdtvAgro.value,
        this.foto.value
      )
      .then((result: any) => {
        this.overlayService.toast({ message: 'Cliente Criado com Sucesso!' });
        this.navCtrl.navigateBack('/menu');
      })
      .catch((error: any) => {
        this.overlayService.toast({ message: error.message });
      });

    loading.dismiss();
  }
  async atualizaCliente(cliente: any) {
    const loading = await this.overlayService.loading({
      message: 'Atualizando...'
    });
    // tslint:disable-next-line: max-line-length
    await this.criaClienteService
      .atualizaCliente(cliente)
      .then((result: any) => {
        this.overlayService.toast({ message: 'Cliente Atualizado com Sucesso!' });
        this.navCtrl.navigateBack('/menu');
      })
      .catch((error: any) => {
        this.overlayService.toast({ message: error.message });
      });

    loading.dismiss();
  }

  async onSubmit(): Promise<void> {
    if (!this.clienteId) {
      this.criaCliente();
    } else {
      this.atualizaCliente({
        id: this.clienteId,
        nome: this.clienteForm.get('nome').value,
        cpf: this.clienteForm.get('cpf').value,
        patrimonio: this.clienteForm.get('patrimonio').value,
        pdtvAgro: this.clienteForm.get('pdtvAgro').value
      });
    }
  }
}
