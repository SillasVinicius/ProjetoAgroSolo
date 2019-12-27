import { TestBed } from '@angular/core/testing';
import { CarService } from './car.service';
describe('CarService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(CarService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=car.service.spec.js.map