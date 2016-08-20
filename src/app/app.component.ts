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
import {ConnectFourGameModel} from './connect-four-game/model/connect-four-game-model';
import {ConnectFourService} from './connect-four-game/connect-four.service';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    providers: [ConnectFourService]
})
export class AppComponent implements OnInit, OnDestroy {
    GAME_DIMENSIONS = {columns: 15, cellsPerColumn: 6};
    WORKER_FACTORY: any;
    robotPlayers: ConnectFourAiPlayerWebWorker[] = [];
    game: ConnectFourGameModel;
    playerName: string[] = [];
    displayHelp = false;

    // We ensure that there's at least a few miliseconds between one play and the next
    // so that the Robot feels a bit more human.
    DELAY_PLAY_BY_MS = 600;
    lastPlayTms: number;

    constructor(private changeDetector: ChangeDetectorRef, private gameService: ConnectFourService) {}

    ngOnInit() {
        this.resetGame();
        this.playerName[1] = 'Player 1';
        this.playerName[2] = 'Robot';

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
            if (Date.now() - this.lastPlayTms < this.DELAY_PLAY_BY_MS) {
                setTimeout(() => this.performMove(col, player), Date.now() - this.lastPlayTms);
            } else if (this.game.playAtColumn(col)) {
                this.lastPlayTms = Date.now();
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
        this.game = this.gameService.resetGame();
        for (let robot of this.robotPlayers) {
            if (robot) {
                robot.reset(this.game);
            }
        }
    }

    clickColumn(column: number) {
        if (!this.game.gameOver && !this.robotPlayers[this.game.currentPlayer]) {
            this.performMove(column);
        }
    }

    toggleHelp() {
        this.displayHelp = !this.displayHelp;
    }
}
