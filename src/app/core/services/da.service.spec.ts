import { TestBed } from '@angular/core/testing';

import { DaService } from './da.service';

describe('DaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DaService = TestBed.get(DaService);
    expect(service).toBeTruthy();
  });
});
