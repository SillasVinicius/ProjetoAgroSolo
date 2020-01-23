import { TestBed } from '@angular/core/testing';

import { ParametrizacaoService } from './parametrizacao.service';

describe('ParametrizacaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametrizacaoService = TestBed.get(ParametrizacaoService);
    expect(service).toBeTruthy();
  });
});
