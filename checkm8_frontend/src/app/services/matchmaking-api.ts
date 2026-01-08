import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MatchmakingApi {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = "http://localhost:8084/api/v1/seeks";

  seekGame() {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers });
  }
}
