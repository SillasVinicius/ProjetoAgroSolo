import { TestBed } from '@angular/core/testing';

import { CriaClienteService } from './cria-cliente.service';

describe('CriaClienteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CriaClienteService = TestBed.get(CriaClienteService);
    expect(service).toBeTruthy();
  });
});
