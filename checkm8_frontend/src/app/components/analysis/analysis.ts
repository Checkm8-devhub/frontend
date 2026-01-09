import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chessboard } from '../chessboard/chessboard';
import { AnalysisApi } from '../../services/analysis-api';
import { GameplayGamesApi } from '../../services/gameplay-games-api';

type EngineLine = {
  pv: string[];
  rank: number;
  score: number;
  scoreType: string;
};

@Component({
  selector: 'app-analysis',
  imports: [Chessboard],
  templateUrl: './analysis.html',
  styleUrl: './analysis.css',
})
export class Analysis {
  private route = inject(ActivatedRoute);
  private analysisApi = inject(AnalysisApi);
  private gameplayGamesApi = inject(GameplayGamesApi);

  @ViewChild("board") board!: Chessboard;

  moves: string[] = []
  analysisResult: EngineLine[][] = [];

  selectedMoveIndex = -1;

  ngAfterViewInit() {
    const gameId = Number(this.route.snapshot.paramMap.get("gameId"));
    queueMicrotask(() => this.getGame(gameId));
  }

  getGame(gameId: number) {
    this.board.startGame('w');

    this.gameplayGamesApi.getGame(gameId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.moves = res.uciAsList as string[];
        this.selectedMoveIndex = this.moves.length ? 0 : -1;
        this.renderBoard();
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.analysisApi.analyzeGame(gameId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.analysisResult = (res ?? []) as EngineLine[][];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  renderBoard() {
    this.board.startGame("w");

    for (let i = 0; i <= this.selectedMoveIndex; i++) {
      this.board.makeMove(this.moves[i]);
    }
  }

  // VIEW functions
  // ----------------------------------------------------------------------------------------------
  selectMove(i: number) {
    if (i < -1) i = -1;
    if (i >= this.moves.length) i = this.moves.length - 1;
    this.selectedMoveIndex = i;

    this.renderBoard();
  }

  get lines(): EngineLine[] {
    if (this.selectedMoveIndex < 0) return [];
    return this.analysisResult?.[this.selectedMoveIndex] ?? [];
  }

  moveLabel(i: number): string {
    if (i < 0) return 'Start';
    const moveNo = Math.floor(i / 2) + 1;
    const side = (i % 2 === 0) ? 'W' : 'B';
    return `${moveNo}${side}: ${this.moves[i]}`;
  }

  sideToMove(i: number): 'White' | 'Black' {
    if (i < 0) return 'White';
    return (i % 2 === 0) ? 'Black' : 'White';
  }

  sideToMoveAtMoveIndex(i: number): 'w' | 'b' {
    if (i < 0) return 'w';
    return (i % 2 === 0) ? 'b' : 'w';
  }

  evalText(line: EngineLine): string {
    let score = line.score;
    if (this.selectedMoveIndex >= 0 && this.sideToMoveAtMoveIndex(this.selectedMoveIndex) === 'b') {
      score = -score;
    }

    if (line.scoreType === 'mate') return `M${score}`;
    const pawns = score / 100;
    const sign = pawns > 0 ? '+' : '';
    return `${sign}${pawns.toFixed(2)}`;
  }
  // ----------------------------------------------------------------------------------------------
}
