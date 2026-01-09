import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnalysisApi {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = "http://localhost:8081/api/v1/analyses";

  analyzeGame(gameId: number) {
    const headers = this.auth.getAuthHeaders();
    const body = {
      gameId,
    };
    return this.http.post(this.apiUrl, body, { headers });
  }
}
