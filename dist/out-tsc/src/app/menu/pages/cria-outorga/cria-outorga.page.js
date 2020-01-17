import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var CriaOutorgaPage = /** @class */ (function () {
    // Dependencias
    function CriaOutorgaPage(formBuilder, overlayService, navCtrl, route, outorgaService, clienteService, usuarioService, storage) {
        this.formBuilder = formBuilder;
        this.overlayService = overlayService;
        this.navCtrl = navCtrl;
        this.route = route;
        this.outorgaService = outorgaService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
        this.storage = storage;
        this.outorgaId = undefined;
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
    CriaOutorgaPage.prototype.ngOnInit = function () {
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
    CriaOutorgaPage.prototype.criaFormulario = function () {
        this.outorgaForm = this.formBuilder.group({
            descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
            dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
                Validators.maxLength(10)]),
            idCliente: this.formBuilder.control('', [Validators.required])
        });
    };
    Object.defineProperty(CriaOutorgaPage.prototype, "descricao", {
        // metodos get que pegam o valor do input no formulário
        get: function () {
            return this.outorgaForm.get('descricao');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaOutorgaPage.prototype, "dataDeVencimento", {
        get: function () {
            return this.outorgaForm.get('dataDeVencimento');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaOutorgaPage.prototype, "idCliente", {
        get: function () {
            return this.outorgaForm.get('idCliente');
        },
        enumerable: true,
        configurable: true
    });
    // verifica se a acao é de criação ou atualização
    CriaOutorgaPage.prototype.acao = function () {
        var _this = this;
        var outorgaId = this.route.snapshot.paramMap.get('id');
        if (!outorgaId) {
            this.update = false;
            this.pageTitle = 'Cadastrar Outorga';
            this.botaoTitle = 'CADASTRAR';
            this.toastMessage = 'Criando...';
            return;
        }
        this.update = true;
        this.outorgaId = outorgaId;
        this.pageTitle = 'Atualizar Outorga';
        this.botaoTitle = 'ATUALIZAR';
        this.toastMessage = 'Atualizando...';
        this.outorgaService
            .get(outorgaId)
            .pipe(take(1))
            .subscribe(function (_a) {
            var descricao = _a.descricao, dataDeVencimento = _a.dataDeVencimento, clienteId = _a.clienteId;
            _this.outorgaForm.get('descricao').setValue(descricao),
                _this.outorgaForm.get('dataDeVencimento').setValue(dataDeVencimento),
                _this.outorgaForm.get('idCliente').setValue(clienteId);
        });
    };
    CriaOutorgaPage.prototype.cadastraListaGlobal = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var outorga;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.outorgaService.initOutorga();
                        return [4 /*yield*/, this.outorgaService.createGlobal(this.outorgaForm.value, id)];
                    case 1:
                        outorga = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CriaOutorgaPage.prototype.AtualizaListaGlobal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var atualizarFoto;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.outorgaService.initOutorga();
                        return [4 /*yield*/, this.outorgaService.update({
                                id: this.outorgaId,
                                descricao: this.outorgaForm.get('descricao').value,
                                dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
                                clienteId: this.outorgaForm.get('idCliente').value
                            })];
                    case 1:
                        atualizarFoto = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // método que envia os dados do formulário para o banco de dados
    CriaOutorgaPage.prototype.onSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, outorga, outorga_1, atualizar, error_1;
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
                        outorga = '';
                        if (!!this.outorgaId) return [3 /*break*/, 4];
                        this.outorgaService.init();
                        return [4 /*yield*/, this.outorgaService.create(this.outorgaForm.value)];
                    case 3:
                        outorga_1 = _a.sent();
                        this.cadastraListaGlobal(this.outorgaService.id);
                        this.deletePicture();
                        this.uploadFileTo(this.arquivos);
                        return [3 /*break*/, 6];
                    case 4:
                        // this.deletePicture();
                        //
                        // this.uploadFileToUpdate(this.arquivos);
                        this.outorgaService.init();
                        return [4 /*yield*/, this.outorgaService.update({
                                id: this.outorgaId,
                                descricao: this.outorgaForm.get('descricao').value,
                                dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
                                clienteId: this.outorgaForm.get('idCliente').value
                            })];
                    case 5:
                        atualizar = _a.sent();
                        this.AtualizaListaGlobal();
                        _a.label = 6;
                    case 6:
                        console.log('Outorga Criada', outorga);
                        this.navCtrl.navigateBack('/menu/outorga');
                        return [3 /*break*/, 10];
                    case 7:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.overlayService.toast({
                                message: error_1.message
                            })];
                    case 8:
                        _a.sent();
                        console.log('Erro ao criar Outorga: ', error_1);
                        return [3 /*break*/, 10];
                    case 9:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CriaOutorgaPage.prototype.openGalery = function (event) {
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
    CriaOutorgaPage.prototype.uploadFile = function (file) {
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
    CriaOutorgaPage.prototype.uploadFileTo = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.outorgaService.usuarioId + "/outorga/" + this.outorgaService.id + "/arquivos/" + this.fileName);
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
                                        this.outorgaService.init();
                                        return [4 /*yield*/, this.outorgaService.update({
                                                id: this.outorgaService.id,
                                                descricao: this.outorgaForm.get('descricao').value,
                                                dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
                                                clienteId: this.outorgaForm.get('idCliente').value,
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
    CriaOutorgaPage.prototype.uploadFileToUpdate = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.outorgaService.usuarioId + "/outorga/" + this.outorgaService.id + "/arquivos/" + this.fileName);
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
                                        this.outorgaService.init();
                                        return [4 /*yield*/, this.outorgaService.update({
                                                id: this.outorgaId,
                                                descricao: this.outorgaForm.get('descricao').value,
                                                dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
                                                clienteId: this.outorgaForm.get('idCliente').value,
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
    CriaOutorgaPage.prototype.deletePicture = function () {
        var ref = this.storage.ref("" + this.fileName);
        var task = ref.delete();
    };
    CriaOutorgaPage = tslib_1.__decorate([
        Component({
            selector: 'app-cria-outorga',
            templateUrl: './cria-outorga.page.html',
            styleUrls: ['./cria-outorga.page.scss'],
            animations: [
                trigger('tamanhoArquivo', [
                    state('semArquivo', style({ 'height': '100px' })),
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
            OutorgaService,
            ClienteService,
            UsuarioService,
            AngularFireStorage])
    ], CriaOutorgaPage);
    return CriaOutorgaPage;
}());
export { CriaOutorgaPage };
//# sourceMappingURL=cria-outorga.page.js.map