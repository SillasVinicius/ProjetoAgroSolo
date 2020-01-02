import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { finalize, take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { DadosPessoaisService } from 'src/app/core/services/dados-pessoais.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
var DadosPessoaisPage = /** @class */ (function () {
    function DadosPessoaisPage(navCtrl, dpService, overlayService, storage, usuarioService, iab, document, platform) {
        this.navCtrl = navCtrl;
        this.dpService = dpService;
        this.overlayService = overlayService;
        this.storage = storage;
        this.usuarioService = usuarioService;
        this.iab = iab;
        this.document = document;
        this.platform = platform;
        this.fileName = '';
    }
    DadosPessoaisPage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, loading2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        this.dpService.initImpostoDeRenda();
                        this.impostoDeRenda$ = this.dpService.getAll();
                        this.impostoDeRenda$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        return [4 /*yield*/, this.overlayService.loading()];
                    case 2:
                        loading2 = _a.sent();
                        this.dpService.initCnh();
                        this.cnh$ = this.dpService.getAll();
                        this.cnh$.pipe(take(1)).subscribe(function () { return loading2.dismiss(); });
                        console.log(this.impostoDeRenda$);
                        console.log(this.cnh$);
                        return [2 /*return*/];
                }
            });
        });
    };
    DadosPessoaisPage.prototype.openLink = function (link) {
        if (this.platform.is("mobile")) {
            var options = {
                title: 'My PDF'
            };
            this.document.viewDocument("" + link, 'application/pdf', options);
        }
        else {
            this.iab.create("" + link, "_system");
        }
        console.log(this.platform.is("mobile"));
    };
    DadosPessoaisPage.prototype.iniciar = function () {
        this.dpService.init();
    };
    DadosPessoaisPage.prototype.openGaleryImpostoDeRendaCreate = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, error_1;
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
                        this.uploadFileToImpostoDeRenda(file);
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
    DadosPessoaisPage.prototype.openGaleryImpostoDeRendaUpdate = function (event, id) {
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
                        this.uploadFileToImpostoDeRendaUpdate(file, id);
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
    DadosPessoaisPage.prototype.openGaleryCnhCreate = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, error_3;
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
                        this.uploadFileToCnh(file);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DadosPessoaisPage.prototype.openGaleryCnhUpdate = function (event, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, error_4;
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
                        this.uploadFileToCnhUpdate(file, id);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DadosPessoaisPage.prototype.uploadFileToImpostoDeRenda = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.usuarioService.id + "/dadosPessoais/1/impostoDeRenda/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var addImpostoDeRenda;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.dpService.initImpostoDeRenda();
                                        return [4 /*yield*/, this.dpService.create({
                                                id: this.dpService.usuarioId,
                                                impostoDeRenda: r
                                            })];
                                    case 1:
                                        addImpostoDeRenda = _a.sent();
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
    DadosPessoaisPage.prototype.uploadFileToImpostoDeRendaUpdate = function (file, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.usuarioService.id + "/dadosPessoais/1/impostoDeRenda/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        if (this.dpService.id) {
                            this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var updateImpostoDeRenda;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.dpService.initImpostoDeRenda();
                                            return [4 /*yield*/, this.dpService.update({
                                                    id: this.dpService.id,
                                                    impostoDeRenda: r
                                                })];
                                        case 1:
                                            updateImpostoDeRenda = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        else {
                            this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var updateImpostoDeRenda;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.dpService.initImpostoDeRenda();
                                            return [4 /*yield*/, this.dpService.update({
                                                    id: id,
                                                    impostoDeRenda: r
                                                })];
                                        case 1:
                                            updateImpostoDeRenda = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                    });
                }); })).subscribe();
                return [2 /*return*/];
            });
        });
    };
    DadosPessoaisPage.prototype.uploadFileToCnh = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.usuarioService.id + "/dadosPessoais/1/cnh/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var addCnh;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.dpService.initCnh();
                                        return [4 /*yield*/, this.dpService.create({
                                                id: this.dpService.usuarioId,
                                                cnh: r
                                            })];
                                    case 1:
                                        addCnh = _a.sent();
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
    DadosPessoaisPage.prototype.uploadFileToCnhUpdate = function (file, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref2, task2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ref2 = this.storage.ref("/users/" + this.usuarioService.id + "/dadosPessoais/1/cnh/" + this.fileName);
                task2 = ref2.put(file);
                task2.snapshotChanges().pipe(finalize(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.downloadUrl = ref2.getDownloadURL();
                        if (this.dpService.id) {
                            this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var updateCnh;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.dpService.initCnh();
                                            return [4 /*yield*/, this.dpService.update({
                                                    id: this.dpService.id,
                                                    cnh: r
                                                })];
                                        case 1:
                                            updateCnh = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        else {
                            this.downloadUrl.subscribe(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var updateCnh;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.dpService.initCnh();
                                            return [4 /*yield*/, this.dpService.update({
                                                    id: id,
                                                    cnh: r
                                                })];
                                        case 1:
                                            updateCnh = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                    });
                }); })).subscribe();
                return [2 /*return*/];
            });
        });
    };
    DadosPessoaisPage = tslib_1.__decorate([
        Component({
            selector: 'app-dados-pessoais',
            templateUrl: './dados-pessoais.page.html',
            styleUrls: ['./dados-pessoais.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            DadosPessoaisService,
            OverlayService,
            AngularFireStorage,
            UsuarioService,
            InAppBrowser,
            DocumentViewer,
            Platform])
    ], DadosPessoaisPage);
    return DadosPessoaisPage;
}());
export { DadosPessoaisPage };
//# sourceMappingURL=dados-pessoais.page.js.map