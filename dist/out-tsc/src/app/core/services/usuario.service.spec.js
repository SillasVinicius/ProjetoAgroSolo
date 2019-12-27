import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';
describe('UsuarioService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(UsuarioService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=usuario.service.spec.js.map