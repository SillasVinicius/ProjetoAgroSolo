import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NavController } from '@ionic/angular';
var LoginPage = /** @class */ (function () {
    function LoginPage(formBuilder, overlayService, usuarioService, navCtrl) {
        this.formBuilder = formBuilder;
        this.overlayService = overlayService;
        this.usuarioService = usuarioService;
        this.navCtrl = navCtrl;
        // variáveis login
        this.version = '';
        this.author = '';
        this.logado = false;
        this.numberPattern = /^[0-9]*$/;
        this.configs = {
            login: true,
            acao: 'Login'
        };
        this.nomeControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.rgControl = new FormControl('', [
            Validators.required,
            Validators.minLength(1)
        ]);
        this.cpfControl = new FormControl('', [
            Validators.required,
            Validators.minLength(14),
            Validators.maxLength(18)
        ]);
        this.telefoneControl = new FormControl('', [
            Validators.required,
            Validators.minLength(14),
            Validators.maxLength(15)
        ]);
        this.dataNascimentoControl = new FormControl('', [
            Validators.required
        ]);
    }
    LoginPage.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            senha: this.formBuilder.control('123456', [Validators.required, Validators.minLength(6)]),
            email: this.formBuilder.control('admin@gmail.com', [Validators.required, Validators.email]),
            admin: this.formBuilder.control(false, [])
        });
        var packageJsonInfo = require('package.json');
        this.version = packageJsonInfo.version;
        this.author = packageJsonInfo.author;
    };
    Object.defineProperty(LoginPage.prototype, "cpf", {
        get: function () {
            return this.loginForm.get('cpf');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "senha", {
        get: function () {
            return this.loginForm.get('senha');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "nome", {
        get: function () {
            return this.loginForm.get('nome');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "rg", {
        get: function () {
            return this.loginForm.get('rg');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "email", {
        get: function () {
            return this.loginForm.get('email');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "telefone", {
        get: function () {
            return this.loginForm.get('telefone');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "dataNascimento", {
        get: function () {
            return this.loginForm.get('dataNascimento');
        },
        enumerable: true,
        configurable: true
    });
    LoginPage.prototype.mudarAcaoForm = function () {
        this.configs.login = !this.configs.login;
        var login = this.configs.login;
        this.configs.acao = login ? 'Login' : 'Cadastrar';
        if (!login) {
            this.loginForm.addControl('nome', this.nomeControl);
            this.loginForm.addControl('rg', this.rgControl);
            this.loginForm.addControl('cpf', this.cpfControl);
            this.loginForm.addControl('telefone', this.telefoneControl);
            this.loginForm.addControl('dataNascimento', this.dataNascimentoControl);
            this.loginForm.reset();
        }
        else {
            this.loginForm.removeControl('nome');
            this.loginForm.removeControl('rg');
            this.loginForm.removeControl('cpf');
            this.loginForm.removeControl('telefone');
            this.loginForm.removeControl('dataNascimento');
        }
    };
    LoginPage.prototype.logar = function () {
        this.logado = true;
    };
    LoginPage.prototype.login = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, _a, error_1;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading({
                            message: 'Logando...'
                        })];
                    case 1:
                        loading = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, 6, 7]);
                        _a = this;
                        return [4 /*yield*/, this.usuarioService.loginDb(this.loginForm.get('email').value, this.loginForm.get('senha').value)];
                    case 3:
                        _a.user = _b.sent();
                        this.user.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(r.length >= 1)) return [3 /*break*/, 1];
                                        console.log('Usuário Logado', this.user);
                                        this.usuarioService.setId(r[0].id);
                                        this.logar();
                                        console.log(r[0].id);
                                        console.log(this.logado);
                                        this.navCtrl.navigateForward('/menu');
                                        this.usuarioService.logado = true;
                                        this.usuarioService.nomeUser = r[0].nome;
                                        this.usuarioService.urlFoto = r[0].foto;
                                        this.usuarioService.admin = r[0].admin;
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, this.overlayService.toast({
                                            message: 'Usuário inválido! Verifique os dados e tente novamente!'
                                        })];
                                    case 2:
                                        _a.sent();
                                        this.usuarioService.logado = false;
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 7];
                    case 4:
                        error_1 = _b.sent();
                        return [4 /*yield*/, this.overlayService.toast({
                                message: error_1.message
                            })];
                    case 5:
                        _b.sent();
                        console.log('Erro ao Logar usuário: ', error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.onSubmit = function () {
        if (this.configs.login) {
            this.login();
        }
        else {
        }
    };
    LoginPage = tslib_1.__decorate([
        Component({
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
        }),
        tslib_1.__metadata("design:paramtypes", [FormBuilder,
            OverlayService,
            UsuarioService,
            NavController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map