import { TestBed } from '@angular/core/testing';

import { DadosPessoaisService } from './dados-pessoais.service';

describe('DadosPessoaisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DadosPessoaisService = TestBed.get(DadosPessoaisService);
    expect(service).toBeTruthy();
  });
});
