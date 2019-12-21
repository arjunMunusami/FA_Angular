import { TestBed } from '@angular/core/testing';

import { ProjectserviceService } from './projectservice.service';

describe('ProjectserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectserviceService = TestBed.get(ProjectserviceService);
    expect(service).toBeTruthy();
  });
});
