import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {ConnectFourComponent} from "./connect-four/connect-four.component";
import {ConnectFour} from "./model/connect-four";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ConnectFourComponent]
})
export class AppComponent implements OnInit, OnDestroy {
  public game: ConnectFour;
  playerName: string[] = [null, 'Player 1', 'Player 2'];

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.resetGame();
  }

  ngOnDestroy() {
  }


  resetGame() {
    this.game = new ConnectFour(15, 6);
  }

  turnAdvanced() {
  }

  playAtColumn(col) {
    this.game.playAtColumn(col.index);
    this.turnAdvanced();
  }

  columnClicked(col) {
    if (!this.game.gameOver) {
      this.playAtColumn(col);
    }
  }
}
