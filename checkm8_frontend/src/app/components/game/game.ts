import { Component, inject } from '@angular/core';
import { MatchmakingApi } from '../../services/matchmaking-api';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  private matchMakingApi = inject(MatchmakingApi);

  gameId = 0;
  gameToken = "";
  isResigning = false;

  ngOnInit() {
    this.getGame();
  }

  getGame() {
    console.log("Searching for game...")
    this.matchMakingApi.seekGame().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.game_id && res?.game_token) {
          this.gameId = res.game_id;
          this.gameToken = res.game_token;
          console.log("Found game!");
        }
        else this.getGame();
      },
      error: (err) => {
        console.error("Error seeking game!")
        console.error(err);
        this.getGame();
      }
    });
  }

  resign() { }
}
