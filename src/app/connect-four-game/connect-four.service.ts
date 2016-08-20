import {Injectable} from '@angular/core';
import {ConnectFourGameModel} from './model/connect-four-game-model';

@Injectable()
export class ConnectFourService {
    game: ConnectFourGameModel;
    columns = 15;
    cellsPerColumn = 6;

    constructor() { }

    getGame(): ConnectFourGameModel {
        return !this.game ? this.resetGame() : this.game;
    }

    resetGame(): ConnectFourGameModel {
        this.game = new ConnectFourGameModel(this.columns, this.cellsPerColumn);
        return this.game;
    }
}
