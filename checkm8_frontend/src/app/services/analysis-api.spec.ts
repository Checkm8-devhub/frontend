import { TestBed } from '@angular/core/testing';

import { AnalysisApi } from './analysis-api';

describe('AnalysisApi', () => {
  let service: AnalysisApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
