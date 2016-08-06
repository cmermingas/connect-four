import {Component, OnInit, Input} from '@angular/core';
import {GameColumnComponent} from "../game-column/game-column.component";
import {ConnectFour} from "../model/connect-four";

@Component({
  moduleId: module.id,
  selector: 'connect-four',
  templateUrl: 'connect-four.component.html',
  styleUrls: ['connect-four.component.css'],
  directives: [GameColumnComponent]
})
export class ConnectFourComponent implements OnInit {
  @Input() game:ConnectFour;

  constructor() { }

  ngOnInit() {
    console.log(this.game);
  }

  pieceAdded(pieceAddedAt: {column: number, cell: number}) {
    if (pieceAddedAt) {
      this.game.advanceTurn();
      let hasWinner = this.game.hasWinner(pieceAddedAt.column, pieceAddedAt.cell);
    }
  }

}
