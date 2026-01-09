// sources:
// https://www.npmjs.com/package/chess.js
// https://chessboardjs.com/examples#5000
import { Component, inject } from '@angular/core';
import { Chess } from 'chess.js';
import { GameState } from '../../services/game-state';
import { GameplayGamesApi } from '../../services/gameplay-games-api';

declare var ChessBoard: any;

@Component({
  selector: 'app-chessboard',
  imports: [],
  templateUrl: './chessboard.html',
  styleUrl: './chessboard.css',
})
export class Chessboard {
  private gameState = inject(GameState);
  private gameplayGamesApi = inject(GameplayGamesApi);

  board: any;
  game = new Chess();
  status = "";

  loadGame(ucis: Array<string> | null, side: string) {
    this.board = ChessBoard("board", {
      position: 'start',
      draggable: true,
      orientation: (side == "w") ? "white" : "black",
      pieceTheme: 'chesspieces/wikipedia/{piece}.png',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)
    });

    this.game = new Chess();
    if (ucis != null) {
      for (const uci of ucis) { // make moves
        this.makeMove(uci);
      }
      this.updateStatus();
    }
  }
  startGame(side: string) {
    this.loadGame(null, side);
  }

  resetGame() {
    this.game.reset();
    this.board.start();
  }

  makeMove(uci: string) {
    try {
      this.game.move(uci);
      this.board.position(this.game.fen());
    }
    catch (err) {
      console.error(err);
    }
  }

  undoMove() {
    this.game.undo();
    this.board.position(this.game.fen());
  }

  // CONFIG:
  // ----------------------------------------------------------------------------------------------
  onDragStart(source: string, piece: string, position: string, orientaion: string) {

    // do not pick up pieces if the game is over
    if (this.game.isGameOver()) return false

    // only pick up pieces that if its your move and your side
    let gameState = this.gameState.getGameState();
    if (gameState !== null && piece.startsWith(gameState.gameToken) && this.game.turn() === gameState.gameToken)
      return true;
    return false;
  }

  onDrop(source: string, target: string) {
    try {

      // see if the move is legal
      let move = this.game.move({
        from: source,
        to: target,
        promotion: 'q' // TODO:
      });
      this.game.undo(); // undo move internally

      // illegal move
      if (move === null) return 'snapback';

      // on valid move send move to gameplay service
      const gs = this.gameState.getGameState();
      if (gs != null) {
        let moveString = move.lan;
        if (move.promotion != null && this.game.turn() == "w") { // we have to change 'q' to 'Q' if white promoting for gameplay service to be happy
          moveString = moveString.substring(0, 4) + moveString[4].toUpperCase();
        }
        console.log(moveString);

        this.gameplayGamesApi.postMoveToGame(gs.gameId, gs.gameToken, moveString).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.error(err);
          }
        });
      }

      this.updateStatus();
      return undefined;
    }
    catch (err) {
      return 'snapback';
    }
  }

  // update the board position after the piece snap
  onSnapEnd() {
    this.board.position(this.game.fen())
  }

  updateStatus() {
    let moveColor = 'White'
    if (this.game.turn() === 'b') {
      moveColor = 'Black'
    }

    // checkmate?
    if (this.game.isCheckmate()) {
      this.status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (this.game.isDraw()) {
      this.status = 'Game over, drawn position'
    }

    // game still on
    else {
      this.status = moveColor + ' to move'

      // check?
      if (this.game.inCheck()) {
        this.status += ', ' + moveColor + ' is in check'
      }
    }
  }
  // ----------------------------------------------------------------------------------------------
}
