import { TestBed } from '@angular/core/testing';

import { MatchmakingApi } from './matchmaking-api';

describe('MatchmakingApi', () => {
  let service: MatchmakingApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchmakingApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
