import { Injectable } from '@angular/core';

export type GameStateType = {
  gameId: number,
  gameToken: string,
  cursor: number,
  ucis: Array<string>,
}

@Injectable({
  providedIn: 'root',
})
export class GameState {

  saveGameState(gameState: GameStateType) {
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }
  getGameState(): GameStateType | null {
    let gameState = localStorage.getItem("gameState");
    if (gameState == null) return null;

    return JSON.parse(gameState) as GameStateType;
  }
  deleteGameState() {
    localStorage.removeItem("gameState");
  }
}
