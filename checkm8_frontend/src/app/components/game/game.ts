import { Component, inject, ViewChild } from '@angular/core';
import { MatchmakingApi } from '../../services/matchmaking-api';
import { Chessboard } from '../chessboard/chessboard';
import { GameState, GameStateType } from '../../services/game-state';
import { GameplayGamesApi } from '../../services/gameplay-games-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [Chessboard],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  private matchMakingApi = inject(MatchmakingApi);
  private gameState = inject(GameState);
  private gameplayGamesApi = inject(GameplayGamesApi);
  private router = inject(Router);

  @ViewChild("board") board!: Chessboard;

  gameId = 0;
  gameToken = "";
  isOver = false;

  ngAfterViewInit() {
    queueMicrotask(() => this.getGame());
    queueMicrotask(() => this.listenForEvents());
  }

  loadGame(ucis: Array<string> | null, side: string) {
    this.board.loadGame(ucis, side);
  }

  getGame() {
    console.log("Searching for game...")

    let gameState = this.gameState.getGameState();
    // if already in a game
    if (gameState != null) {

      // load game
      this.gameId = gameState.gameId;
      this.gameToken = gameState.gameToken;
      this.loadGame(gameState.ucis, gameState.gameToken);
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
          } as GameStateType;
          this.gameState.saveGameState(gameState);

          // load game
          this.loadGame(null, gameState.gameToken);
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

  resign() {
    const gs = this.gameState.getGameState();
    if (gs == null) return;

    this.gameplayGamesApi.postResignToGame(gs.gameId, gs.gameToken).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  listenForEvents() {
    if (this.board != null && this.board.game.isGameOver()) {
      this.isOver = true;
    }

    const gs = this.gameState.getGameState();
    if (gs == null) {
      setTimeout(() => this.listenForEvents(), 500);
      return;
    }

    console.log("Waiting for event...")
    this.gameplayGamesApi.listenToGameEvents(gs.gameId, gs.cursor).subscribe({
      next: (res) => {
        const resArray = res as string[];
        // on success, update gameState and board and relisten
        console.log("GamplayGamesApi:")
        console.log(res);

        if (res != null) {
          // on end of game
          if (resArray[resArray.length - 1] === "EOG") {
            this.isOver = true;
            return;
          }

          // updating game state
          gs.cursor += resArray.length;
          gs.ucis.push(...resArray);
          this.gameState.saveGameState(gs);

          // updating board
          for (const uci of resArray) {
            this.board.makeMove(uci);
          }
          this.board.updateStatus();
        }
        this.listenForEvents();
      },
      error: (err) => {
        // if EOG
        if (err.error == "EOG") this.isOver = true;

        // else stop listening
        console.error(err);
      }
    });
  }

  leave() {
    this.gameState.deleteGameState();
    this.router.navigate(['/dashboard']);
  }

  analyze() {
    const gs = this.gameState.getGameState();
    if (gs != null) this.router.navigate(['/analysis', gs.gameId]);

    else this.router.navigate(['/dashboard']);
  }
}
