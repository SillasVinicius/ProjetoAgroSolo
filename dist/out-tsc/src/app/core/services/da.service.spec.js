import { TestBed } from '@angular/core/testing';
import { DaService } from './da.service';
describe('DaService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(DaService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=da.service.spec.js.map