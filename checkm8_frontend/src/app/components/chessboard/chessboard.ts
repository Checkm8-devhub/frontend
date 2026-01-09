// sources:
// https://www.npmjs.com/package/chess.js
// https://chessboardjs.com/examples#5000
import { Component } from '@angular/core';
import { Chess } from 'chess.js';
import { GameState } from '../../services/game-state';

declare var ChessBoard: any;

@Component({
  selector: 'app-chessboard',
  imports: [],
  templateUrl: './chessboard.html',
  styleUrl: './chessboard.css',
})
export class Chessboard {
  private gameState = new GameState();

  board: any;
  private game = new Chess();
  status = "";

  loadGame(ucis: Array<string> | null) {
    this.board = ChessBoard("board", {
      position: 'start',
      draggable: true,
      pieceTheme: 'chesspieces/wikipedia/{piece}.png',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)
    });

    this.game = new Chess();
    ucis?.forEach(uci => { // make moves
      this.makeMove(uci);
    });
  }
  startGame() {
    this.loadGame(null);
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
      })

      // illegal move
      if (move === null) return 'snapback';

      // TODO: on valid move send move to gameplay service
      console.log(move);

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
