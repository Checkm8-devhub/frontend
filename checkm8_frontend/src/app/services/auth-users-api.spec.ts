import { TestBed } from '@angular/core/testing';

import { AuthUsersApi } from './auth-users-api';

describe('AuthUsersApi', () => {
  let service: AuthUsersApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthUsersApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
