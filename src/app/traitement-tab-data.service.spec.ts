import { TestBed, inject } from '@angular/core/testing';

import { TraitementTabDataService } from './traitement-tab-data.service';

describe('TraitementTabDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraitementTabDataService]
    });
  });

  it('should be created', inject([TraitementTabDataService], (service: TraitementTabDataService) => {
    expect(service).toBeTruthy();
  }));
});
