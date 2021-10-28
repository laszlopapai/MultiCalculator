import { TestBed } from '@angular/core/testing';

import { AnnuityService } from './annuity.service';

describe('AnnuityService', () => {
  let service: AnnuityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnuityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
