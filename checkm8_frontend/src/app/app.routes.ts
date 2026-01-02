import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Authenticate } from './components/authenticate/authenticate';

export const routes: Routes = [
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "auth", component: Authenticate },
  { path: "dashboard", canActivate: [authGuard], component: Dashboard },
];
