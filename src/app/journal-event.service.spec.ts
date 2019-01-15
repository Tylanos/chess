import { TestBed, inject } from '@angular/core/testing';

import { JournalEventService } from './journal-event.service';

describe('JournalEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JournalEventService]
    });
  });

  it('should be created', inject([JournalEventService], (service: JournalEventService) => {
    expect(service).toBeTruthy();
  }));
});
