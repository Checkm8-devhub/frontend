import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AuthUsersApi {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = "http://localhost:8082/api/v1/users";

  getSelf() {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  createSelf() {
    const headers = this.auth.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, null, { headers });
  }

  deleteSelf() {
    const headers = this.auth.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/me`, { headers });
  }
}
