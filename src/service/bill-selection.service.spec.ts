import { TestBed } from '@angular/core/testing';

import { BillSelectionService } from './bill-selection.service';

describe('BillSelectionService', () => {
  let service: BillSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
