import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  private keycloakBaseUrl = "http://localhost:8083";
  private keycloakRealmBase = `${this.keycloakBaseUrl}/realms/auth/protocol/openid-connect`;
  private redirectUrl = `${window.location.origin}/auth`;

  redirectToLogin() {
    const url =
      `${this.keycloakRealmBase}/auth` +
      `?client_id=main_client` +
      `&response_type=code` +
      `&scope=openid` +
      `&redirect_uri=${this.redirectUrl}`;

    window.location.href = url;
  }

  requestJwtToken(code: string): Observable<any> {
    const body = new HttpParams()
      .set("grant_type", "authorization_code")
      .set("client_id", "main_client")
      .set("code", code)
      .set("redirect_uri", this.redirectUrl);
    const headers = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" })

    console.log(body.toString());
    return this.http.post(`${this.keycloakRealmBase}/token`, body.toString(), { headers });
  }

  saveToken(token: string) {
    localStorage.setItem("authToken", token);
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  deleteToken() {
    localStorage.removeItem("authToken");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
