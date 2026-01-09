import { Component, inject, ViewChild } from '@angular/core';
import { MatchmakingApi } from '../../services/matchmaking-api';
import { Chessboard } from '../chessboard/chessboard';
import { GameState, GameStateType } from '../../services/game-state';

@Component({
  selector: 'app-game',
  imports: [Chessboard],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  private matchMakingApi = inject(MatchmakingApi);
  private gameState = inject(GameState);

  @ViewChild("board") board!: Chessboard;

  gameId = 0;
  gameToken = "";
  isResigning = false;

  ngAfterViewInit() {
    this.getGame();
  }

  loadGame(ucis: Array<string> | null) {
    this.board.loadGame(ucis);
  }

  getGame() {
    console.log("Searching for game...")

    let gameState = this.gameState.getGameState();
    // if already in a game
    if (gameState != null) {

      // if game over remove game state and try again
      if (gameState.isOver) {
        this.gameState.deleteGameState();
        this.getGame();
        return;
      }

      // else load game
      this.gameId = gameState.gameId;
      this.gameToken = gameState.gameToken;
      this.loadGame(gameState.ucis);
      console.log("Already in a game");
      return;
    }

    // else
    this.matchMakingApi.seekGame().subscribe({
      next: (res: any) => {

        // if got game
        if (res?.game_id && res?.game_token) {
          this.gameId = res.game_id;
          this.gameToken = res.game_token;
          console.log("Found game!");

          // save gameState
          let gameState = {
            gameId: this.gameId,
            gameToken: this.gameToken,
            cursor: 0,
            ucis: [],
            isOver: false,
          } as GameStateType;
          this.gameState.saveGameState(gameState);

          // load game
          this.loadGame(null);
        }
        else this.getGame(); // else try again
      },
      error: (err) => {
        // on error stop
        console.error("Error seeking game!")
        console.error(err);
      }
    });
  }

  resign() { }
}
