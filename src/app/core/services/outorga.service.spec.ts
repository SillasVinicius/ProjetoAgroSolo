import { TestBed } from '@angular/core/testing';

import { OutorgaService } from './outorga.service';

describe('OutorgaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutorgaService = TestBed.get(OutorgaService);
    expect(service).toBeTruthy();
  });
});
