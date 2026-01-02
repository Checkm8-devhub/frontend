import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-authenticate',
  imports: [],
  templateUrl: './authenticate.html',
  styleUrl: './authenticate.css',
})
export class Authenticate {
  private activatedRoute = inject(ActivatedRoute);
  private auth = inject(Auth);
  private router = inject(Router);

  error: string = "";

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(["./dashboard"]);
      return;
    }

    this.activatedRoute.queryParams.subscribe(params => {
      // if no code yet => redirect
      if (!params["code"]) {
        this.auth.redirectToLogin();
        return;
      }

      // else => get JWT token and save it
      this.auth.requestJwtToken(params["code"]).subscribe({
        next: (res) => {
          this.auth.saveToken(res.access_token);
          this.router.navigate(["./dashboard"]);
        },
        error: (err) => {
          console.error("Login error", err);
          this.error = "Login failed. Please refresh and try again";
        },
      });
    });
  }
}
