import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    trigger,
    state,
    transition,
    animate,
    style,
    keyframes
} from '@angular/core';
import {ConnectFourGameModel, CellContent, GameCell} from '../model/connect-four-game-model';

@Component({
    selector: 'connect-four',
    templateUrl: 'connect-four.component.html',
    styleUrls: ['connect-four.component.scss'],
    animations: [
        trigger('dropState', [
            // state('up', style({transform: 'translateY(0)', opacity: .7})),
            state('down', style({transform: 'translateY(0)', opacity: 1})),
            transition('void => down', [
                animate('200ms ease-in', keyframes([
                    style({transform: 'translateY(-300%)', offset: 0}),
                    style({transform: 'translateY(0)', offset: .6}),
                    style({transform: 'translateY(-40px)', offset: .7}),
                    style({transform: 'translateY(0)', offset: 1}),
                ]))
            ])])]
})
export class ConnectFourComponent implements OnInit {
    @Input() game: ConnectFourGameModel;
    @Output() onColumnClick = new EventEmitter<number>();

    IMAGE_FOR_PLAYER = ['img/empty.png', 'img/player1.png', 'img/player2.png'];
    IMAGE_FOR_WINNER = 'img/winning.png';

    constructor() { }

    ngOnInit() {}

    getImageForCell(cell: GameCell): string {
        return (cell.content === CellContent.Winning) ?
            this.IMAGE_FOR_WINNER : this.IMAGE_FOR_PLAYER[cell.content];
    }

    getDropStateForCell(column: number, cell: number): string {
        return (column === this.game.lastMove.column && cell === this.game.lastMove.cell) ? 'down' : null;
    }

    clickColumn(column: number) {
        this.onColumnClick.emit(column);
    }
}
