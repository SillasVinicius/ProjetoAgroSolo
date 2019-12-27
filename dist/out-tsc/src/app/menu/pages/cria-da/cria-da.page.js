import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { DaService } from 'src/app/core/services/da.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var CriaDaPage = /** @class */ (function () {
    // Dependencias
    function CriaDaPage(formBuilder, overlayService, navCtrl, route, declaracaoAmbientalService, clienteService, usuarioService, storage) {
        this.formBuilder = formBuilder;
        this.overlayService = overlayService;
        this.navCtrl = navCtrl;
        this.route = route;
        this.declaracaoAmbientalService = declaracaoAmbientalService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
        this.storage = storage;
        this.declaracaoAmbientalId = undefined;
        this.admin = false;
        this.update = false;
        //cliente
        this.clientes = [];
        // Validacao
        this.numberPattern = /^[0-9]*$/;
        this.botaoTitle = '...';
        this.pageTitle = '...';
        this.toastMessage = '...';
        this.liberaArquivo = false;
        this.fileName = '';
    }
    // metodo que é chamado quando a pagina é carregada
    CriaDaPage.prototype.ngOnInit = function () {
        var _this = this;
        this.criaFormulario();
        if (this.usuarioService.admin) {
            this.clienteService.initCliente();
            this.clienteService.getAll().subscribe(function (r) {
                for (var i = 0; i < r.length; i++) {
                    _this.clientes[i] = r[i];
                }
            });
            this.admin = true;
        }
        else {
            this.clienteService.init();
            this.clienteService.getAll().subscribe(function (r) {
                for (var i = 0; i < r.length; i++) {
                    _this.clientes[i] = r[i];
                }
            });
            this.admin = false;
        }
        console.log(this.clientes);
        this.clienteService.id = '';
        this.acao();
    };
    // Cria formulários
    CriaDaPage.prototype.criaFormulario = function () {
        this.declaracaoAmbientalForm = this.formBuilder.group({
            descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
            dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
                Validators.maxLength(10)]),
            idCliente: this.formBuilder.control('', [Validators.required])
        });
    };
    Object.defineProperty(CriaDaPage.prototype, "descricao", {
        // metodos get que pegam o valor do input no formulário
        get: function () {
            return this.declaracaoAmbientalForm.get('descricao');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaDaPage.prototype, "dataDeVencimento", {
        get: function () {
            return this.declaracaoAmbientalForm.get('dataDeVencimento');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaDaPage.prototype, "idCliente", {
        get: function () {
            return this.declaracaoAmbientalForm.get('idCliente');
        },
        enumerable: true,
        configurable: true
    });
    // verifica se a acao é de criação ou atualização
    CriaDaPage.prototype.acao = function () {
        var _this = this;
        var declaracaoAmbientalId = this.route.snapshot.paramMap.get('id');
        if (!declaracaoAmbientalId) {
            this.update = false;
            this.pageTitle = 'Cadastrar Declaração Ambiental';
            this.botaoTitle = 'CADASTRAR';
            this.toastMessage = 'Criando...';
            return;
        }
        this.update = true;
        this.declaracaoAmbientalId = declaracaoAmbientalId;
        this.pageTitle = 'Atualizar Declaração Ambiental';
        this.botaoTitle = 'ATUALIZAR';
        this.toastMessage = 'Atualizando...';
        this.declaracaoAmbientalService
            .get(declaracaoAmbientalId)
            .pipe(take(1))
            .subscribe(function (_a) {
            var descricao = _a.descricao, dataDeVencimento = _a.dataDeVencimento, clienteId = _a.clienteId;
            _this.declaracaoAmbientalForm.get('descricao').setValue(descricao),
                _this.declaracaoAmbientalForm.get('dataDeVencimento').setValue(dataDeVencimento),
                _this.declaracaoAmbientalForm.get('idCliente').setValue(clienteId);
        });
    };
    CriaDaPage.prototype.cadastraListaGlobal = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var declaracaoAmbiental;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.declaracaoAmbientalService.initDA();
                        return [4 /*yield*/, this.declaracaoAmbientalService.createGlobal(this.declaracaoAmbientalForm.value, id)];
                    case 1:
                        declaracaoAmbiental = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CriaDaPage.prototype.AtualizaListaGlobal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var atualizarFoto;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.declaracaoAmbientalService.initDA();
                        return [4 /*yield*/, this.declaracaoAmbientalService.update({
                                id: this.declaracaoAmbientalId,
                                descricao: this.declaracaoAmbientalForm.get('descricao').value,
                                dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
                                clienteId: this.declaracaoAmbientalForm.get('idCliente').value
                            })];
                    case 1:
                        atualizarFoto = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // método que envia os dados do formulário para o banco de dados
    CriaDaPage.prototype.onSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, declaracaoAmbiental, declaracaoAmbiental_1, atualizar, error_1;
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
                        declaracaoAmbiental = '';
                        if (!!this.declaracaoAmbientalId) return [3 /*break*/, 4];
                        this.declaracaoAmbientalService.init();
                        return [4 /*yield*/, this.declaracaoAmbientalService.create(this.declaracaoAmbientalForm.value)];
                    case 3:
                        declaracaoAmbiental_1 = _a.sent();
                        this.cadastraListaGlobal(this.declaracaoAmbientalService.id);
                        this.deletePicture();
                        this.uploadFileTo(this.arquivos);
                        return [3 /*break*/, 6];
                    case 4:
                        // this.deletePicture();
                        //
                        // this.uploadFileToUpdate(this.arquivos);
                        this.declaracaoAmbientalService.init();
                        return [4 /*yield*/, this.declaracaoAmbientalService.update({
                                id: this.declaracaoAmbientalId,
                                descricao: this.declaracaoAmbientalForm.get('descricao').value,
                                dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
                                clienteId: this.declaracaoAmbientalForm.get('idCliente').value
                            })];
                    case 5:
                        atualizar = _a.sent();
                        this.AtualizaListaGlobal();
                        _a.label = 6;
                    case 6:
                        console.log('declaracao Ambiental Criada', declaracaoAmbiental);
                        this.navCtrl.navigateBack('/menu/ambiental/DeclaracaoAmbiental');
                        return [3 /*break*/, 10];
                    case 7:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.overlayService.toast({
                                message: error_1.message
                            })];
                    case 8:
                        _a.sent();
                        console.log('Erro ao criar declaraÇão Ambiental: ', error_1);
                        return [3 /*break*/, 10];
                    case 9:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CriaDaPage.prototype.openGalery = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        file = event.item(0);
                        if (!(file.type.split('/')[0] === 'image')) return [3 /*break*/, 2];
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
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CriaDaPage.prototype.uploadFile = function (file) {
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
    CriaDaPage.prototype.uploadFileTo = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.declaracaoAmbientalService.usuarioId + "/DeclaracaoAmbiental/" + this.declaracaoAmbientalService.id + "/arquivos/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        this.liberaArquivo = true;
                        this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var atualizarFoto;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.declaracaoAmbientalService.init();
                                        return [4 /*yield*/, this.declaracaoAmbientalService.update({
                                                id: this.declaracaoAmbientalService.id,
                                                descricao: this.declaracaoAmbientalForm.get('descricao').value,
                                                dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
                                                clienteId: this.declaracaoAmbientalForm.get('idCliente').value,
                                                arquivo: r
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
    CriaDaPage.prototype.uploadFileToUpdate = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.declaracaoAmbientalService.usuarioId + "/DeclaracaoAmbiental/" + this.declaracaoAmbientalService.id + "/arquivos/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        this.liberaArquivo = true;
                        this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var atualizarFoto;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.declaracaoAmbientalService.init();
                                        return [4 /*yield*/, this.declaracaoAmbientalService.update({
                                                id: this.declaracaoAmbientalId,
                                                descricao: this.declaracaoAmbientalForm.get('descricao').value,
                                                dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
                                                clienteId: this.declaracaoAmbientalForm.get('idCliente').value,
                                                arquivo: r
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
    CriaDaPage.prototype.deletePicture = function () {
        var ref = this.storage.ref("" + this.fileName);
        var task = ref.delete();
    };
    CriaDaPage = tslib_1.__decorate([
        Component({
            selector: 'app-cria-da',
            templateUrl: './cria-da.page.html',
            styleUrls: ['./cria-da.page.scss'],
            animations: [
                trigger('tamanhoArquivo', [
                    state('semArquivo', style({ 'height': '67px' })),
                    state('comArquivo', style({ 'height': '210px' })),
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
            DaService,
            ClienteService,
            UsuarioService,
            AngularFireStorage])
    ], CriaDaPage);
    return CriaDaPage;
}());
export { CriaDaPage };
//# sourceMappingURL=cria-da.page.js.map