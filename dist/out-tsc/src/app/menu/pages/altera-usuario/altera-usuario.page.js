import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
var AlteraUsuarioPage = /** @class */ (function () {
    // Dependencias
    function AlteraUsuarioPage(formBuilder, overlayService, navCtrl, route, usuarioService, storage, database, camera, platform, file) {
        this.formBuilder = formBuilder;
        this.overlayService = overlayService;
        this.navCtrl = navCtrl;
        this.route = route;
        this.usuarioService = usuarioService;
        this.storage = storage;
        this.database = database;
        this.camera = camera;
        this.platform = platform;
        this.file = file;
        this.updateUsuarioId = undefined;
        // Validacao
        this.numberPattern = /^[0-9]*$/;
        this.liberaArquivo = false;
        this.liberaAlterar = false;
        this.fileName = '';
    }
    // metodo que é chamado quando a pagina é carregada
    AlteraUsuarioPage.prototype.ngOnInit = function () {
        this.criaFormulario();
        this.usuarioService.init();
        this.acao();
    };
    AlteraUsuarioPage.prototype.retornaDataNascimento = function (data) {
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
    AlteraUsuarioPage.prototype.retornaDataMMDDYYYY = function (data) {
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
    AlteraUsuarioPage.prototype.openGalery = function (event) {
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
    AlteraUsuarioPage.prototype.uploadFile = function (file) {
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
    AlteraUsuarioPage.prototype.uploadFileTo = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.updateUsuarioId + "/fotoPerfil/" + this.fileName);
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
                                                id: this.updateUsuarioId,
                                                nome: this.updateUsuarioForm.get('nome').value,
                                                email: this.updateUsuarioForm.get('email').value,
                                                senha: this.updateUsuarioForm.get('senha').value,
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
    AlteraUsuarioPage.prototype.deletePicture = function () {
        var ref = this.storage.ref("" + this.fileName);
        var task = ref.delete();
    };
    // Cria formulários
    AlteraUsuarioPage.prototype.criaFormulario = function () {
        this.updateUsuarioForm = this.formBuilder.group({
            senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
            email: this.formBuilder.control('', [Validators.required, Validators.email]),
            nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)])
        });
    };
    // atualização
    AlteraUsuarioPage.prototype.acao = function () {
        var _this = this;
        var updateUsuarioId = this.route.snapshot.paramMap.get('id');
        this.updateUsuarioId = updateUsuarioId;
        this.usuarioService
            .get(updateUsuarioId)
            .pipe(take(1))
            .subscribe(function (_a) {
            var nome = _a.nome, email = _a.email, senha = _a.senha;
            _this.updateUsuarioForm.get('senha').setValue(senha),
                _this.updateUsuarioForm.get('nome').setValue(nome),
                _this.updateUsuarioForm.get('email').setValue(email);
        });
    };
    Object.defineProperty(AlteraUsuarioPage.prototype, "senha", {
        // metodos get que pegam o valor do input no formulário
        get: function () {
            return this.updateUsuarioForm.get('senha');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlteraUsuarioPage.prototype, "nome", {
        get: function () {
            return this.updateUsuarioForm.get('nome');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlteraUsuarioPage.prototype, "email", {
        get: function () {
            return this.updateUsuarioForm.get('email');
        },
        enumerable: true,
        configurable: true
    });
    // método que envia os dados do formulário para o banco de dados
    AlteraUsuarioPage.prototype.onSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading({
                            message: 'Alterando Perfil...'
                        })];
                    case 1:
                        loading = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 3, 5, 6]);
                        this.deletePicture();
                        this.uploadFileTo(this.arquivos);
                        this.navCtrl.navigateBack('/login');
                        this.usuarioService.logado = false;
                        return [3 /*break*/, 6];
                    case 3:
                        error_2 = _a.sent();
                        return [4 /*yield*/, this.overlayService.toast({
                                message: error_2.message
                            })];
                    case 4:
                        _a.sent();
                        console.log('Erro ao atualizar perfil:', error_2);
                        return [3 /*break*/, 6];
                    case 5:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AlteraUsuarioPage = tslib_1.__decorate([
        Component({
            selector: 'app-altera-usuario',
            templateUrl: './altera-usuario.page.html',
            styleUrls: ['./altera-usuario.page.scss'],
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
            AngularFirestore,
            Camera,
            Platform,
            File])
    ], AlteraUsuarioPage);
    return AlteraUsuarioPage;
}());
export { AlteraUsuarioPage };
//# sourceMappingURL=altera-usuario.page.js.map