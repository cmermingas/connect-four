import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import {GameColumn, CellContent} from "../model/connect-four";

@Component({
  moduleId: module.id,
  selector: 'game-column',
  templateUrl: 'game-column.component.html',
  styleUrls: ['game-column.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameColumnComponent implements OnInit {
  @Input() gameColumn:GameColumn;
  @Input() gameOver:boolean;
  @Output() columnClicked = new EventEmitter();
  imgSrc = [];

  constructor() {
    // Hardcoding this path here while I figure out why the images don't show up on Github Pages:
    const IMG_PATH = 'https://raw.githubusercontent.com/cmermingas/connect-four/master/app/img/'
    // const IMG_PATH = '/app/img/';
    this.imgSrc[CellContent.Empty] = IMG_PATH + 'empty.png';
    this.imgSrc[CellContent.Player1] = IMG_PATH + 'player1.png';
    this.imgSrc[CellContent.Player2] = IMG_PATH + 'player2.png';
    this.imgSrc[CellContent.Winning] = IMG_PATH + 'winning.png';
  }

  ngOnInit() {}

  onClick(e) {
    if (!this.gameOver) {
      let pieceAddedAt = this.gameColumn.addPieceForCurrentPlayer();
      this.columnClicked.emit(pieceAddedAt);
    }
  }
}
