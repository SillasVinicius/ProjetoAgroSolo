import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var CriaClientePage = /** @class */ (function () {
    // Dependencias
    function CriaClientePage(formBuilder, overlayService, navCtrl, route, clienteService, storage, usuarioService) {
        this.formBuilder = formBuilder;
        this.overlayService = overlayService;
        this.navCtrl = navCtrl;
        this.route = route;
        this.clienteService = clienteService;
        this.storage = storage;
        this.usuarioService = usuarioService;
        this.clienteId = undefined;
        this.admin = false;
        this.update = false;
        // Validacao
        this.botaoTitle = '...';
        this.pageTitle = '...';
        this.toastMessage = '...';
        this.liberaArquivo = false;
        this.liberaAlterar = false;
        this.fileName = '';
    }
    // metodo que é chamado quando a pagina é carregada
    CriaClientePage.prototype.ngOnInit = function () {
        this.criaFormulario();
        if (this.usuarioService.admin) {
            this.clienteService.initCliente();
            console.log('this.clienteService.initCliente();');
            this.admin = true;
        }
        else {
            this.clienteService.init();
            console.log('this.clienteService.init();');
            this.admin = false;
        }
        this.acao();
    };
    CriaClientePage.prototype.openGalery = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        file = event.item(0);
                        if (!(file.type.split('/')[0] !== 'image')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.overlayService.toast({
                                message: 'tipo de arquivo não pode ser enviado por esse campo :('
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.fileName = file.name;
                        this.arquivos = file;
                        this.uploadFile(file);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CriaClientePage.prototype.uploadFile = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref, task;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref = this.storage.ref("" + this.fileName);
                task = ref.put(file);
                //
                this.uploadPercent = task.percentageChanges();
                task.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var loading;
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.overlayService.loading({
                                    message: "Carregando Foto..."
                                })];
                            case 1:
                                loading = _a.sent();
                                this.downloadUrl = ref.getDownloadURL();
                                this.liberaArquivo = true;
                                this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    return tslib_1.__generator(this, function (_a) {
                                        this.urlFoto = r;
                                        return [2 /*return*/];
                                    });
                                }); });
                                loading.dismiss();
                                return [2 /*return*/];
                        }
                    });
                }); })).subscribe();
                return [2 /*return*/];
            });
        });
    };
    CriaClientePage.prototype.uploadFileTo = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.clienteService.usuarioId + "/cliente/" + this.clienteService.id + "/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        this.liberaArquivo = true;
                        this.liberaAlterar = true;
                        this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var atualizarFoto;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.clienteService.init();
                                        return [4 /*yield*/, this.clienteService.update({
                                                id: this.clienteService.id,
                                                cpf: this.clienteForm.get('cpf').value,
                                                nome: this.clienteForm.get('nome').value,
                                                foto: r,
                                                patrimonio: this.clienteForm.get('patrimonio').value,
                                                pdtvAgro: this.clienteForm.get('pdtvAgro').value,
                                                informacoesAdicionais: this.clienteForm.get('informacoesAdicionais').value,
                                                rg: this.clienteForm.get('rg').value,
                                                dataNascimento: this.clienteForm.get('dataNascimento').value,
                                                telefone: this.clienteForm.get('telefone').value,
                                                email: this.clienteForm.get('email').value,
                                                senha: this.clienteForm.get('senha').value,
                                            })];
                                    case 1:
                                        atualizarFoto = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); })).subscribe();
                return [2 /*return*/];
            });
        });
    };
    CriaClientePage.prototype.uploadFileToUpdate = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.clienteService.usuarioId + "/cliente/" + this.clienteService.id + "/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        this.liberaArquivo = true;
                        this.liberaAlterar = true;
                        this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var cliente;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.clienteService.init();
                                        return [4 /*yield*/, this.clienteService.update({
                                                id: this.clienteId,
                                                cpf: this.clienteForm.get('cpf').value,
                                                rg: this.clienteForm.get('rg').value,
                                                dataNascimento: this.clienteForm.get('dataNascimento').value,
                                                telefone: this.clienteForm.get('telefone').value,
                                                email: this.clienteForm.get('email').value,
                                                nome: this.clienteForm.get('nome').value,
                                                senha: this.clienteForm.get('senha').value,
                                                foto: r,
                                                patrimonio: this.clienteForm.get('patrimonio').value,
                                                pdtvAgro: this.clienteForm.get('pdtvAgro').value,
                                                informacoesAdicionais: this.clienteForm.get('informacoesAdicionais').value
                                            })];
                                    case 1:
                                        cliente = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); })).subscribe();
                return [2 /*return*/];
            });
        });
    };
    CriaClientePage.prototype.deletePicture = function () {
        var ref = this.storage.ref("" + this.fileName);
        var task = ref.delete();
    };
    // Cria formulários
    CriaClientePage.prototype.criaFormulario = function () {
        this.clienteForm = this.formBuilder.group({
            nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
            cpf: this.formBuilder.control('', [
                Validators.required,
                Validators.minLength(14),
                Validators.maxLength(18)
            ]),
            rg: this.formBuilder.control('', [
                Validators.required,
                Validators.minLength(1),
            ]),
            telefone: this.formBuilder.control('', [
                Validators.required,
                Validators.minLength(14),
                Validators.maxLength(15)
            ]),
            dataNascimento: this.formBuilder.control('', [
                Validators.required,
            ]),
            email: this.formBuilder.control('', [
                Validators.required,
                Validators.email
            ]),
            senha: this.formBuilder.control('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            patrimonio: this.formBuilder.control('', [
                Validators.required,
                Validators.minLength(3)
            ]),
            pdtvAgro: this.formBuilder.control('', [
                Validators.required,
                Validators.minLength(3)
            ]),
            informacoesAdicionais: this.formBuilder.control('', [Validators.minLength(0), Validators.maxLength(400)])
        });
    };
    Object.defineProperty(CriaClientePage.prototype, "cpf", {
        // metodos get que pegam o valor do input no formulário
        get: function () {
            return this.clienteForm.get('cpf');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "pdtvAgro", {
        get: function () {
            return this.clienteForm.get('pdtvAgro');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "nome", {
        get: function () {
            return this.clienteForm.get('nome');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "rg", {
        get: function () {
            return this.clienteForm.get('rg');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "telefone", {
        get: function () {
            return this.clienteForm.get('telefone');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "dataNascimento", {
        get: function () {
            return this.clienteForm.get('dataNascimento');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "email", {
        get: function () {
            return this.clienteForm.get('email');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "senha", {
        get: function () {
            return this.clienteForm.get('senha');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "patrimonio", {
        get: function () {
            return this.clienteForm.get('patrimonio');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaClientePage.prototype, "informacoesAdicionais", {
        get: function () {
            return this.clienteForm.get('informacoesAdicionais');
        },
        enumerable: true,
        configurable: true
    });
    // verifica se a acao é de criação ou atualização
    CriaClientePage.prototype.acao = function () {
        var _this = this;
        var clienteId = this.route.snapshot.paramMap.get('id');
        if (!clienteId) {
            this.update = false;
            this.pageTitle = 'Cadastrar Cliente';
            this.botaoTitle = 'CADASTRAR';
            this.toastMessage = 'Criando...';
            return;
        }
        this.update = true;
        this.clienteId = clienteId;
        this.pageTitle = 'Atualizar Cliente';
        this.botaoTitle = 'ATUALIZAR';
        this.toastMessage = 'Atualizando...';
        this.clienteService
            .get(clienteId)
            .pipe(take(1))
            .subscribe(function (_a) {
            var nome = _a.nome, cpf = _a.cpf, patrimonio = _a.patrimonio, pdtvAgro = _a.pdtvAgro, informacoesAdicionais = _a.informacoesAdicionais, rg = _a.rg, telefone = _a.telefone, dataNascimento = _a.dataNascimento, email = _a.email, senha = _a.senha;
            _this.clienteForm.get('nome').setValue(nome),
                _this.clienteForm.get('cpf').setValue(cpf),
                _this.clienteForm.get('patrimonio').setValue(patrimonio),
                _this.clienteForm.get('pdtvAgro').setValue(pdtvAgro),
                _this.clienteForm.get('informacoesAdicionais').setValue(informacoesAdicionais),
                _this.clienteForm.get('rg').setValue(rg),
                _this.clienteForm.get('telefone').setValue(telefone),
                _this.clienteForm.get('dataNascimento').setValue(dataNascimento),
                _this.clienteForm.get('email').setValue(email),
                _this.clienteForm.get('senha').setValue(senha);
        });
    };
    CriaClientePage.prototype.cadastraListaGlobal = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cliente;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clienteService.initCliente();
                        return [4 /*yield*/, this.clienteService.createGlobal(this.clienteForm.value, id)];
                    case 1:
                        cliente = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CriaClientePage.prototype.AtualizaListaGlobal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cliente;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clienteService.initCliente();
                        return [4 /*yield*/, this.clienteService.update({
                                id: this.clienteId,
                                cpf: this.clienteForm.get('cpf').value,
                                nome: this.clienteForm.get('nome').value,
                                patrimonio: this.clienteForm.get('patrimonio').value,
                                pdtvAgro: this.clienteForm.get('pdtvAgro').value,
                                informacoesAdicionais: this.clienteForm.get('informacoesAdicionais').value,
                                rg: this.clienteForm.get('rg').value,
                                telefone: this.clienteForm.get('telefone').value,
                                dataNascimento: this.clienteForm.get('dataNascimento').value,
                                email: this.clienteForm.get('email').value,
                                senha: this.clienteForm.get('senha').value,
                            })];
                    case 1:
                        cliente = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // método que envia os dados do formulário para o banco de dados
    CriaClientePage.prototype.onSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, cliente, cliente_1, cliente_2, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading({
                            message: this.toastMessage
                        })];
                    case 1:
                        loading = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, 9, 10]);
                        cliente = '';
                        if (!!this.clienteId) return [3 /*break*/, 4];
                        this.clienteService.init();
                        return [4 /*yield*/, this.clienteService.create(this.clienteForm.value)];
                    case 3:
                        cliente_1 = _a.sent();
                        this.cadastraListaGlobal(this.clienteService.id);
                        this.deletePicture();
                        this.uploadFileTo(this.arquivos);
                        return [3 /*break*/, 6];
                    case 4:
                        // this.deletePicture();
                        //
                        // this.uploadFileToUpdate(this.arquivos);
                        this.clienteService.init();
                        return [4 /*yield*/, this.clienteService.update({
                                id: this.clienteId,
                                cpf: this.clienteForm.get('cpf').value,
                                nome: this.clienteForm.get('nome').value,
                                patrimonio: this.clienteForm.get('patrimonio').value,
                                pdtvAgro: this.clienteForm.get('pdtvAgro').value,
                                informacoesAdicionais: this.clienteForm.get('informacoesAdicionais').value,
                                rg: this.clienteForm.get('rg').value,
                                telefone: this.clienteForm.get('telefone').value,
                                dataNascimento: this.clienteForm.get('dataNascimento').value,
                                email: this.clienteForm.get('email').value,
                                senha: this.clienteForm.get('senha').value,
                            })];
                    case 5:
                        cliente_2 = _a.sent();
                        this.AtualizaListaGlobal();
                        _a.label = 6;
                    case 6:
                        console.log('Cliente Criado', cliente);
                        this.navCtrl.navigateBack('/menu/cliente');
                        return [3 /*break*/, 10];
                    case 7:
                        error_2 = _a.sent();
                        return [4 /*yield*/, this.overlayService.toast({
                                message: error_2.message
                            })];
                    case 8:
                        _a.sent();
                        console.log('Erro ao criar cliente: ', error_2);
                        return [3 /*break*/, 10];
                    case 9:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CriaClientePage = tslib_1.__decorate([
        Component({
            selector: 'app-cria-cliente',
            templateUrl: './cria-cliente.page.html',
            styleUrls: ['./cria-cliente.page.scss'],
            animations: [
                trigger('tamanhoArquivo', [
                    state('semArquivo', style({ 'height': '100px' })),
                    state('comArquivo', style({ 'height': '250px' })),
                    transition('antes => depois', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')]),
                    transition('depois => antes', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')])
                ]),
                trigger('marginBotao', [
                    state('semArquivo', style({ 'margin-top': '2px' })),
                    state('comArquivo', style({ 'margin-top': '30px' })),
                    transition('antes => depois', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')]),
                    transition('depois => antes', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')])
                ]),
            ]
        }),
        tslib_1.__metadata("design:paramtypes", [FormBuilder,
            OverlayService,
            NavController,
            ActivatedRoute,
            ClienteService,
            AngularFireStorage,
            UsuarioService])
    ], CriaClientePage);
    return CriaClientePage;
}());
export { CriaClientePage };
//# sourceMappingURL=cria-cliente.page.js.map