import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy, style, state, animate, transition, trigger, keyframes
} from '@angular/core';
import {GameColumn} from "../model/connect-four";

@Component({
  moduleId: module.id,
  selector: 'game-column',
  templateUrl: 'game-column.component.html',
  styleUrls: ['game-column.component.css'],
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
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameColumnComponent implements OnInit {
  @Input() gameColumn: GameColumn;
  @Output() columnClicked = new EventEmitter();
  imgSrc = [];
  winningImgSrc = '';
  // stateForCell = [];

  constructor() {
    // Hardcoding this path here while I figure out why the images don't show up on Github Pages:
    const IMG_PATH = 'https://raw.githubusercontent.com/cmermingas/connect-four/master/src/app/img/';
    // const IMG_PATH = '/app/img/';
    this.imgSrc[0] = IMG_PATH + 'empty.png';
    this.imgSrc[1] = IMG_PATH + 'player1.png';
    this.imgSrc[2] = IMG_PATH + 'player2.png';
    this.winningImgSrc = IMG_PATH + 'winning.png';

    // this.stateForCell[CellContent.Empty] = nul;
    // this.stateForCell[CellContent.Player1] = 'down';
    // this.stateForCell[CellContent.Player2] = 'down';
    // this.stateForCell[CellContent.Winning] = 'down';
  }

  ngOnInit() {}

  onClick(e) {
    this.columnClicked.emit(this.gameColumn);
  }
}
