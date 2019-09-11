import { TestBed } from '@angular/core/testing';

import { LaService } from './la.service';

describe('LaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaService = TestBed.get(LaService);
    expect(service).toBeTruthy();
  });
});
