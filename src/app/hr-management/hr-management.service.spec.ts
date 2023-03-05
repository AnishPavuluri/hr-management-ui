import { TestBed } from '@angular/core/testing';

import { HrManagementService } from './hr-management.service';

describe('HrManagementService', () => {
  let service: HrManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
