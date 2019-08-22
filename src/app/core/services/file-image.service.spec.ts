import { TestBed } from '@angular/core/testing';

import { FileImageService } from './file-image.service';

describe('FileImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileImageService = TestBed.get(FileImageService);
    expect(service).toBeTruthy();
  });
});
