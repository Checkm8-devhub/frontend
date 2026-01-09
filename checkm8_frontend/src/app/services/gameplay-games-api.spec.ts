import { TestBed } from '@angular/core/testing';

import { GameplayGamesApi } from './gameplay-games-api';

describe('GameplayGamesApi', () => {
  let service: GameplayGamesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameplayGamesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
