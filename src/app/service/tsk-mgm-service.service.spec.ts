import { TestBed } from '@angular/core/testing';

import { TskMgmServiceService } from './tsk-mgm-service.service';

describe('TskMgmServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TskMgmServiceService = TestBed.get(TskMgmServiceService);
    expect(service).toBeTruthy();
  });
});
