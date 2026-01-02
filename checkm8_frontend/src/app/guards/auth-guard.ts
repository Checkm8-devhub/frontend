import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  const jwt = auth.getToken();
  if (!jwt) return router.createUrlTree(['']);

  try {
    const token = auth.decodeJwt();
    if (!token) return router.createUrlTree(['']);
    const now = Math.floor(Date.now() / 1000);

    if (token.exp <= now) {
      // auto log out if invalid token
      auth.deleteToken();
      return router.createUrlTree(['']);
    }

    return true
  } catch (Error) {
    auth.deleteToken();
    return router.createUrlTree(['']);
  }
};
