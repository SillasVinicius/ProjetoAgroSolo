import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { LaService } from 'src/app/core/services/la.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var CriaLaPage = /** @class */ (function () {
    function CriaLaPage(formBuilder, overlayService, navCtrl, route, licencaAmbientalService, clienteService, usuarioService, storage) {
        this.formBuilder = formBuilder;
        this.overlayService = overlayService;
        this.navCtrl = navCtrl;
        this.route = route;
        this.licencaAmbientalService = licencaAmbientalService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
        this.storage = storage;
        this.licencaAmbientalId = undefined;
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
    CriaLaPage.prototype.ngOnInit = function () {
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
        this.clienteService.id = '';
        this.acao();
    };
    // Cria formulários
    CriaLaPage.prototype.criaFormulario = function () {
        this.licencaAmbientalForm = this.formBuilder.group({
            descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
            dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
                Validators.maxLength(10)]),
            idCliente: this.formBuilder.control('', [Validators.required])
        });
    };
    Object.defineProperty(CriaLaPage.prototype, "descricao", {
        // metodos get que pegam o valor do input no formulário
        get: function () {
            return this.licencaAmbientalForm.get('descricao');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaLaPage.prototype, "dataDeVencimento", {
        get: function () {
            return this.licencaAmbientalForm.get('dataDeVencimento');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaLaPage.prototype, "idCliente", {
        get: function () {
            return this.licencaAmbientalForm.get('idCliente');
        },
        enumerable: true,
        configurable: true
    });
    // verifica se a acao é de criação ou atualização
    CriaLaPage.prototype.acao = function () {
        var _this = this;
        var licencaAmbientalId = this.route.snapshot.paramMap.get('id');
        if (!licencaAmbientalId) {
            this.update = false;
            this.pageTitle = 'Cadastrar Licença Ambiental';
            this.botaoTitle = 'CADASTRAR';
            this.toastMessage = 'Criando...';
            return;
        }
        this.update = true;
        this.licencaAmbientalId = licencaAmbientalId;
        this.pageTitle = 'Atualizar Licença Ambiental';
        this.botaoTitle = 'ATUALIZAR';
        this.toastMessage = 'Atualizando...';
        this.licencaAmbientalService
            .get(licencaAmbientalId)
            .pipe(take(1))
            .subscribe(function (_a) {
            var descricao = _a.descricao, dataDeVencimento = _a.dataDeVencimento, clienteId = _a.clienteId;
            _this.licencaAmbientalForm.get('descricao').setValue(descricao),
                _this.licencaAmbientalForm.get('dataDeVencimento').setValue(dataDeVencimento);
            _this.licencaAmbientalForm.get('idCliente').setValue(clienteId);
        });
    };
    CriaLaPage.prototype.cadastraListaGlobal = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var licencaAmbiental;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.licencaAmbientalService.initLA();
                        return [4 /*yield*/, this.licencaAmbientalService.createGlobal(this.licencaAmbientalForm.value, id)];
                    case 1:
                        licencaAmbiental = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CriaLaPage.prototype.AtualizaListaGlobal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var atualizarFoto;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.licencaAmbientalService.initLA();
                        return [4 /*yield*/, this.licencaAmbientalService.update({
                                id: this.licencaAmbientalId,
                                descricao: this.licencaAmbientalForm.get('descricao').value,
                                dataDeVencimento: this.licencaAmbientalForm.get('dataDeVencimento').value,
                                clienteId: this.licencaAmbientalForm.get('idCliente').value
                            })];
                    case 1:
                        atualizarFoto = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // método que envia os dados do formulário para o banco de dados
    CriaLaPage.prototype.onSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, licencaAmbiental, licencaAmbiental_1, atualizar, error_1;
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
                        licencaAmbiental = '';
                        if (!!this.licencaAmbientalId) return [3 /*break*/, 4];
                        this.licencaAmbientalService.init();
                        return [4 /*yield*/, this.licencaAmbientalService.create(this.licencaAmbientalForm.value)];
                    case 3:
                        licencaAmbiental_1 = _a.sent();
                        this.cadastraListaGlobal(this.licencaAmbientalService.id);
                        this.deletePicture();
                        this.uploadFileTo(this.arquivos);
                        return [3 /*break*/, 6];
                    case 4:
                        // this.deletePicture();
                        //
                        // this.uploadFileToUpdate(this.arquivos);
                        this.licencaAmbientalService.init();
                        return [4 /*yield*/, this.licencaAmbientalService.update({
                                id: this.licencaAmbientalId,
                                descricao: this.licencaAmbientalForm.get('descricao').value,
                                dataDeVencimento: this.licencaAmbientalForm.get('dataDeVencimento').value,
                                clienteId: this.licencaAmbientalForm.get('idCliente').value
                            })];
                    case 5:
                        atualizar = _a.sent();
                        this.AtualizaListaGlobal();
                        _a.label = 6;
                    case 6:
                        console.log('Licença Ambiental Criada', licencaAmbiental);
                        this.navCtrl.navigateBack('/menu/ambiental/LicencaAmbiental');
                        return [3 /*break*/, 10];
                    case 7:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.overlayService.toast({
                                message: error_1.message
                            })];
                    case 8:
                        _a.sent();
                        console.log('Erro ao criar Licença Ambiental: ', error_1);
                        return [3 /*break*/, 10];
                    case 9:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CriaLaPage.prototype.openGalery = function (event) {
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
    CriaLaPage.prototype.uploadFile = function (file) {
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
    CriaLaPage.prototype.uploadFileTo = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.licencaAmbientalService.usuarioId + "/LicencaAmbiental/" + this.licencaAmbientalService.id + "/arquivos/" + this.fileName);
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
                                        this.licencaAmbientalService.init();
                                        return [4 /*yield*/, this.licencaAmbientalService.update({
                                                id: this.licencaAmbientalService.id,
                                                descricao: this.licencaAmbientalForm.get('descricao').value,
                                                dataDeVencimento: this.licencaAmbientalForm.get('dataDeVencimento').value,
                                                clienteId: this.licencaAmbientalForm.get('idCliente').value,
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
    CriaLaPage.prototype.uploadFileToUpdate = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.licencaAmbientalService.usuarioId + "/LicencaAmbiental/" + this.licencaAmbientalService.id + "/arquivos/" + this.fileName);
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
                                        this.licencaAmbientalService.init();
                                        return [4 /*yield*/, this.licencaAmbientalService.update({
                                                id: this.licencaAmbientalId,
                                                descricao: this.licencaAmbientalForm.get('descricao').value,
                                                dataDeVencimento: this.licencaAmbientalForm.get('dataDeVencimento').value,
                                                clienteId: this.licencaAmbientalForm.get('idCliente').value,
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
    CriaLaPage.prototype.deletePicture = function () {
        var ref = this.storage.ref("" + this.fileName);
        var task = ref.delete();
    };
    CriaLaPage = tslib_1.__decorate([
        Component({
            selector: 'app-cria-la',
            templateUrl: './cria-la.page.html',
            styleUrls: ['./cria-la.page.scss'],
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
            LaService,
            ClienteService,
            UsuarioService,
            AngularFireStorage])
    ], CriaLaPage);
    return CriaLaPage;
}());
export { CriaLaPage };
//# sourceMappingURL=cria-la.page.js.map