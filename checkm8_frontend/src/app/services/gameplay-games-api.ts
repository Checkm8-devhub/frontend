import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class GameplayGamesApi {

  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = "http://localhost:8080/api/v1/games";

  getGame(gameId: number) {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${gameId}`, { headers });
  }

  postMoveToGame(gameId: number, gameToken: string, moveUCI: string) {
    const headers = this.auth.getAuthHeaders();
    const body = {
      gameToken,
      moveUCI
    };

    return this.http.post(`${this.apiUrl}/${gameId}/actions`, body, { headers, responseType: 'text' });
  }

  postResignToGame(gameId: number, gameToken: string) {
    const headers = this.auth.getAuthHeaders();
    const body = {
      gameToken,
      resign: true,
    };

    return this.http.post(`${this.apiUrl}/${gameId}/actions`, body, { headers, responseType: 'text' });
  }

  listenToGameEvents(gameId: number, cursor: number) {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${gameId}/events?since=${cursor}`, { headers });
  }
}
