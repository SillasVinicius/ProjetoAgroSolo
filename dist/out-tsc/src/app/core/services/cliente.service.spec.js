import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';
describe('ClienteService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(ClienteService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=cliente.service.spec.js.map