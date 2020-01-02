import { TestBed } from '@angular/core/testing';

import { CreditoService } from './credito.service';

describe('CreditoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditoService = TestBed.get(CreditoService);
    expect(service).toBeTruthy();
  });
});
