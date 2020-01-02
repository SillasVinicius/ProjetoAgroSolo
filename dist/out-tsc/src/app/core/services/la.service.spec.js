import { TestBed } from '@angular/core/testing';
import { LaService } from './la.service';
describe('LaService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(LaService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=la.service.spec.js.map