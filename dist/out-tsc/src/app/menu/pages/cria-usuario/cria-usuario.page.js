import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { ClienteService } from 'src/app/core/services/cliente.service';
var CriaUsuarioPage = /** @class */ (function () {
    // Dependencias
    function CriaUsuarioPage(formBuilder, overlayService, navCtrl, route, usuarioService, storage, camera, platform, file, clienteService) {
        this.formBuilder = formBuilder;
        this.overlayService = overlayService;
        this.navCtrl = navCtrl;
        this.route = route;
        this.usuarioService = usuarioService;
        this.storage = storage;
        this.camera = camera;
        this.platform = platform;
        this.file = file;
        this.clienteService = clienteService;
        this.usuarioId = undefined;
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
    CriaUsuarioPage.prototype.ngOnInit = function () {
        this.criaFormulario();
        if (this.usuarioService.admin) {
            this.usuarioService.init();
            this.admin = true;
        }
        else {
            this.usuarioService.init();
            this.admin = false;
        }
        this.acao();
    };
    CriaUsuarioPage.prototype.openGalery = function (event) {
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
    CriaUsuarioPage.prototype.uploadFile = function (file) {
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
    CriaUsuarioPage.prototype.uploadFileTo = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.usuarioService.id + "/usuario/" + this.usuarioService.id + "/" + this.fileName);
                task2 = ref2.put(file);
                try {
                    task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            this.downloadUrl = ref2.getDownloadURL();
                            this.liberaArquivo = true;
                            this.liberaAlterar = true;
                            this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var usuario;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.usuarioService.init();
                                            return [4 /*yield*/, this.usuarioService.update({
                                                    id: this.usuarioService.id,
                                                    nome: this.usuarioForm.get('nome').value,
                                                    email: this.usuarioForm.get('email').value,
                                                    senha: this.usuarioForm.get('senha').value,
                                                    foto: r
                                                })];
                                        case 1:
                                            usuario = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); })).subscribe();
                }
                catch (error) {
                    alert(error);
                }
                return [2 /*return*/];
            });
        });
    };
    CriaUsuarioPage.prototype.uploadFileToUpdate = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.usuarioService.id + "/usuario/" + this.usuarioService.id + "/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        this.liberaArquivo = true;
                        this.liberaAlterar = true;
                        this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var usuario;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.usuarioService.init();
                                        return [4 /*yield*/, this.usuarioService.update({
                                                id: this.usuarioId,
                                                nome: this.usuarioForm.get('nome').value,
                                                email: this.usuarioForm.get('email').value,
                                                senha: this.usuarioForm.get('senha').value,
                                                foto: r
                                            })];
                                    case 1:
                                        usuario = _a.sent();
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
    CriaUsuarioPage.prototype.deletePicture = function () {
        var ref = this.storage.ref("" + this.fileName);
        ;
        var task = ref.delete();
    };
    // Cria formulários
    // Cria formulários
    CriaUsuarioPage.prototype.criaFormulario = function () {
        this.usuarioForm = this.formBuilder.group({
            senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
            email: this.formBuilder.control('', [Validators.required, Validators.email]),
            nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
            admin: this.formBuilder.control(false, [])
        });
    };
    Object.defineProperty(CriaUsuarioPage.prototype, "senha", {
        // metodos get que pegam o valor do input no formulário
        get: function () {
            return this.usuarioForm.get('senha');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaUsuarioPage.prototype, "nome", {
        get: function () {
            return this.usuarioForm.get('nome');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CriaUsuarioPage.prototype, "email", {
        get: function () {
            return this.usuarioForm.get('email');
        },
        enumerable: true,
        configurable: true
    });
    // verifica se a acao é de criação ou atualização
    CriaUsuarioPage.prototype.acao = function () {
        var _this = this;
        var usuarioId = this.route.snapshot.paramMap.get('id');
        if (!usuarioId) {
            this.pageTitle = 'Cadastrar Administrador';
            this.botaoTitle = 'CADASTRAR';
            this.toastMessage = 'Criando...';
            return;
        }
        this.usuarioId = usuarioId;
        this.pageTitle = 'Atualizar Administrador';
        this.botaoTitle = 'ATUALIZAR';
        this.toastMessage = 'Atualizando...';
        this.usuarioService
            .get(usuarioId)
            .pipe(take(1))
            .subscribe(function (_a) {
            var nome = _a.nome, email = _a.email, senha = _a.senha;
            _this.usuarioForm.get('senha').setValue(senha),
                _this.usuarioForm.get('nome').setValue(nome),
                _this.usuarioForm.get('email').setValue(email);
        });
    };
    CriaUsuarioPage.prototype.cadastraListaGlobal = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usuario;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.usuarioService.init();
                        return [4 /*yield*/, this.usuarioService.createGlobal(this.usuarioForm.value, id)];
                    case 1:
                        usuario = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CriaUsuarioPage.prototype.AtualizaListaGlobal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usuario;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.usuarioService.init();
                        return [4 /*yield*/, this.usuarioService.update({
                                id: this.usuarioId,
                                nome: this.usuarioForm.get('nome').value,
                                senha: this.usuarioForm.get('senha').value,
                                email: this.usuarioForm.get('email').value,
                            })];
                    case 1:
                        usuario = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // método que envia os dados do formulário para o banco de dados
    CriaUsuarioPage.prototype.onSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, usuario, usuario_1, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading({
                            message: this.toastMessage
                        })];
                    case 1:
                        loading = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, 7, 8]);
                        usuario = '';
                        if (!!this.usuarioId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.usuarioService.create(this.usuarioForm.value)];
                    case 3:
                        usuario_1 = _a.sent();
                        this.deletePicture();
                        this.uploadFileTo(this.arquivos);
                        return [3 /*break*/, 4];
                    case 4:
                        console.log('Administrador Criado', usuario);
                        this.navCtrl.navigateBack('/menu/usuario');
                        return [3 /*break*/, 8];
                    case 5:
                        error_2 = _a.sent();
                        return [4 /*yield*/, this.overlayService.toast({
                                message: error_2.message
                            })];
                    case 6:
                        _a.sent();
                        console.log('Erro ao criar administrador: ', error_2);
                        return [3 /*break*/, 8];
                    case 7:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CriaUsuarioPage.prototype.retornaDataNascimento = function (data) {
        if (data.length > 10) {
            //2019-10-04T08:45:55.822-03:00
            var ano = data.substring(0, 4);
            var mes = data.substring(5, 7);
            var dia = data.substring(8, 10);
            return dia + "/" + mes + "/" + ano;
        }
        else {
            return this.retornaDataMMDDYYYY(data);
        }
    };
    CriaUsuarioPage.prototype.retornaDataMMDDYYYY = function (data) {
        if (data.length === 10) {
            //04/03/2001
            var ano = data.substring(6);
            var mes = data.substring(3, 5);
            var dia = data.substring(0, 2);
            return mes + "/" + dia + "/" + ano;
        }
        else {
            return 'error data';
        }
    };
    CriaUsuarioPage = tslib_1.__decorate([
        Component({
            selector: 'app-cria-usuario',
            templateUrl: './cria-usuario.page.html',
            styleUrls: ['./cria-usuario.page.scss'],
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
            UsuarioService,
            AngularFireStorage,
            Camera,
            Platform,
            File,
            ClienteService])
    ], CriaUsuarioPage);
    return CriaUsuarioPage;
}());
export { CriaUsuarioPage };
//# sourceMappingURL=cria-usuario.page.js.map