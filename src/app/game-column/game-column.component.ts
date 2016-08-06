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
    this.imgSrc[CellContent.Empty] = '/app/img/empty.png';
    this.imgSrc[CellContent.Player1] = '/app/img/player1.png';
    this.imgSrc[CellContent.Player2] = '/app/img/player2.png';
    this.imgSrc[CellContent.Winning] = '/app/img/winning.png';
  }

  ngOnInit() {}

  onClick(e) {
    if (!this.gameOver) {
      let pieceAddedAt = this.gameColumn.addPieceForCurrentPlayer();
      this.columnClicked.emit(pieceAddedAt);
    }
  }

}
