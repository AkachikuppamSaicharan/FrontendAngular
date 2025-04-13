import { TestBed } from '@angular/core/testing';

import { GetBillsService } from './get-bills.service';

describe('GetBillsService', () => {
  let service: GetBillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetBillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
