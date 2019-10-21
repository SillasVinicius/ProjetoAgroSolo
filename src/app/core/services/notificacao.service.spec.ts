import { TestBed } from '@angular/core/testing';

import { NotificacaoService } from './notificacao.service';

describe('NotificacaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificacaoService = TestBed.get(NotificacaoService);
    expect(service).toBeTruthy();
  });
});
