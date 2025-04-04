import { TestBed } from '@angular/core/testing';

import { SuspensionTerminationService } from './suspension-termination.service';

describe('SuspensionTerminationService', () => {
  let service: SuspensionTerminationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuspensionTerminationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
