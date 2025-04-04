import { TestBed } from '@angular/core/testing';

import { SysParameterGeneralService } from './sys-parameter-general.service';

describe('SysParameterGeneralService', () => {
  let service: SysParameterGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysParameterGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
