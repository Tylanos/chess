import { TestBed, inject } from '@angular/core/testing';

import { InitPlateauService } from './init-plateau.service';

describe('InitPlateauService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitPlateauService]
    });
  });

  it('should be created', inject([InitPlateauService], (service: InitPlateauService) => {
    expect(service).toBeTruthy();
  }));
});
