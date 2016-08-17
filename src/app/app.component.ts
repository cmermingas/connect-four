import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  trigger,
  state,
  transition,
  animate,
  style,
  keyframes
} from '@angular/core';
import {ConnectFourAiPlayerWebWorker} from './connect-four-game/index';
import {ConnectFourGameModel, CellContent} from './connect-four-game/model/connect-four-game-model';

const IMG_PATH = 'img/';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    trigger('dropState', [
      state('up', style({transform: 'translateY(0)', opacity: 0})),
      state('down', style({transform: 'translateY(0)', opacity: 1})),
      transition('* => *', [
        animate('200ms ease-in', keyframes([
          style({transform: 'translateY(-300%)', offset: 0}),
          style({transform: 'translateY(0)', offset: .6}),
          style({transform: 'translateY(-40px)', offset: .7}),
          style({transform: 'translateY(0)', offset: 1}),
        ]))
      ])])]
})
export class AppComponent implements OnInit, OnDestroy {
  GAME_DIMENSIONS = {columns: 15, cellsPerColumn: 6};
  WORKER_FACTORY: any;
  IMAGE_FOR_PLAYER = [];
  IMAGE_FOR_WINNER = IMG_PATH + 'winning.png';
  robotPlayers: ConnectFourAiPlayerWebWorker[] = [];
  game: ConnectFourGameModel;
  playerName: string[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.resetGame();
    this.playerName[1] = 'Player 1';
    this.playerName[2] = 'Robot';

    this.IMAGE_FOR_PLAYER[0] = IMG_PATH + 'empty.png';
    this.IMAGE_FOR_PLAYER[1] = IMG_PATH + 'player1.png';
    this.IMAGE_FOR_PLAYER[2] = IMG_PATH + 'player2.png';

    this.WORKER_FACTORY = require('worker!./connect-four-game/ai-player/connect-four-ai-player-web-worker');
    this.robotPlayers[2] =
      new ConnectFourAiPlayerWebWorker(this.game, 2, this.WORKER_FACTORY(), this.performMove.bind(this));
  }

  ngOnDestroy() {
    this.robotPlayers.forEach(item => item.terminate());
  }

  checkPlayerTurn() {
    if (this.robotPlayers[this.game.currentPlayer]) {
      this.robotPlayers[this.game.currentPlayer].takeTurn();
    }
  }

  performMove(col: number, player: ConnectFourAiPlayerWebWorker = null) {
    // This outer if in case an asynchronous call to performMove is made out of  place
    if (!player || player.myNumber === this.game.currentPlayer) {
      // This inner if to ensure that the play was actually done
      if (this.game.playAtColumn(col)) {
        this.changeDetector.detectChanges();
        this.checkPlayerTurn();
      }
    }
  }

  switchPlayer(p: number) {
    if (p === 1 || p === 2) {
      if (this.robotPlayers[p]) {
        this.robotPlayers[p].terminate();
        this.robotPlayers[p] = null;
        this.playerName[p] = `Player ${p}`;
      } else {
        this.robotPlayers[p] =
          new ConnectFourAiPlayerWebWorker(this.game, p, this.WORKER_FACTORY(), this.performMove.bind(this));
        this.playerName[p] = 'Robot';
        this.checkPlayerTurn();
      }
    }
  }

  resetGame() {
    this.game = new ConnectFourGameModel(this.GAME_DIMENSIONS.columns, this.GAME_DIMENSIONS.cellsPerColumn);
    for (let robot of this.robotPlayers) {
      if (robot) {
        robot.reset(this.game);
      }
    }
  }

  getImageForCell(cell: number): string {
    if (cell === CellContent.Winning) {
      return this.IMAGE_FOR_WINNER;
    } else {
      return this.IMAGE_FOR_PLAYER[cell];
    }
  }

  getDropStateForCell(cell: number): string {
    return cell === 0 ? null : 'down';
  }

  clickColumn(column: number) {
    if (!this.game.gameOver && !this.robotPlayers[this.game.currentPlayer]) {
      this.performMove(column);
    }
  }
}
