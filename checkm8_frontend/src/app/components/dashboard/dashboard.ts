import { Component, inject } from '@angular/core';
import { AuthUsersApi } from '../../services/auth-users-api';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private auth = inject(Auth);
  private authUsersApi = inject(AuthUsersApi);

  username: string = "<PLACEHOLDER>";
  elo: string = "<PLACEHOLDER>";

  ngOnInit() {
    this.getUsername();
    this.getElo();
  }

  getElo() {
    this.authUsersApi.getSelf().subscribe({
      next: (res: any) => {
        if (!res) {
          this.authUsersApi.createSelf().subscribe(); // try creating self
          window.location.reload();
        }

        this.elo = res.elo;
      },
      error: (err) => {
        console.error("could not fetch user.")
        console.error(err);
      }
    });
  }

  getUsername() {
    const prefferedUsername = this.auth.getPrefferedUsernameFromJwt();
    if (prefferedUsername) this.username = prefferedUsername;
  }
}
