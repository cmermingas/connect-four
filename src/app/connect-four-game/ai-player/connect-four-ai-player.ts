import {ConnectFourGameModel} from '../model/connect-four-game-model';
// import {ConnectFourService} from '../connect-four.service';
// import {ReflectiveInjector} from '@angular/core';

const MAX_DEPTH = 4;
enum MoveType {Offensive, Defensive, Neutral, Stupid}
interface MinimaxResult {
    move: number;
    score: number;
    moveType: MoveType;
}

abstract class FilterMovesHeuristic {
    abstract filter(moves: number[], game: ConnectFourGameModel): number[];
}

// This heuristic selects the available moves that are on top of or next to existing pieces
export class HighestConcentrationHeuristic extends FilterMovesHeuristic {
    filter(moves: number[], game: ConnectFourGameModel): number[] {
        const concentration = game.columnIndex.map(item => game.cellsPerColumn - item - 1);
        let result = moves.filter(item =>
            concentration[item] > 0 ||
            item > 0 && concentration[item - 1] > 0 ||
            item < game.columns.length - 1 && concentration[item + 1] > 0
        );
        return (result.length > 0 ? result : [moves[Math.floor(moves.length / 2)]]);
    }
}

export class ConnectFourAiPlayer {
    private isThinking = false;
    private plannedMoves: number[];
    // private gameService: ConnectFourService;

    constructor(public heuristic: FilterMovesHeuristic = null) {
        // let injector = ReflectiveInjector.resolveAndCreate([ConnectFourService]);
        // this.gameService = injector.get(ConnectFourService);
    }

    // This is the function to be called to get the move for the current player
    play(gameState: ConnectFourGameModel): number {
        if (!this.isThinking) {
            this.isThinking = true;
            let result;

            if (this.plannedMoves && this.plannedMoves[gameState.lastMove.column] !== null) {
                // console.log('Robot picking up planned move');
                result = this.plannedMoves[gameState.lastMove.column];
            } else {
                // console.log('Robot thinking current move');
                let bestMove = this._minimaxMove(gameState, MAX_DEPTH, gameState.currentPlayer);
                result = bestMove.move;
            }

            this.plannedMoves = null;
            this.isThinking = false;
            return result;
        }
    }

    // This function is used to plan the next move.
    // The game should be in a state such that the opponent is the current player.
    // We'll consider removing this assumption. But for now, let's go...
    plan(gameState: ConnectFourGameModel) {
        if (!this.isThinking && gameState) {
            // console.log('*** Robot planning ***', gameState);
            this.isThinking = true;
            this.plannedMoves = gameState.columns.map(item => null);
            let availableMoves = this.heuristic.filter(gameState.getAvailableMoves(), gameState);
            for (let move of availableMoves) {
                let gameCopy = gameState.copy();
                gameCopy.playAtColumn(move);
                let bestMove = this._minimaxMove(gameCopy, MAX_DEPTH, gameCopy.currentPlayer);
                this.plannedMoves[move] = bestMove.move;
            }
            this.isThinking = false;
            // console.log('Done planning', this.plannedMoves);
        }
    }

    // Simple implementation of the minimax algorithm to find the best move
    _minimaxMove(game: ConnectFourGameModel, maxDepth: number, player: number, currentDepth: number = null): MinimaxResult {
        currentDepth = currentDepth === null ? maxDepth : currentDepth;
        let availableMoves = game.getAvailableMoves();
        if (this.heuristic) {
            availableMoves = this.heuristic.filter(availableMoves, game);
        }

        if (game.gameOver || currentDepth === 0 || availableMoves.length === 0) {
            // We give a heavier score to "sooner" results
            // (e.g. losing in this move is heavier than winning in the next one)
            let score = 0;
            if (game.winner === player) {
                score = currentDepth + 1; // 1 * (depthLevel + 1)
            } else if (game.winner) {
                score = -currentDepth - 1; // -1 * (depthLevel + 1)
            }
            return {move: null, score: score, moveType: MoveType.Neutral};
        }

        let bestScore, bestMove;
        let losingMoves = 0, winningMoves = 0, neutralMoves = 0, offensiveMoves = 0;
        let fn = game.currentPlayer === player ? Math.max : Math.min;

        // This is used for debugging, if needed
        // let moves_with_score = '';

        for (let move of availableMoves) {
            let gameCopy = game.copy();
            gameCopy.playAtColumn(move);
            let miniMaxMove = this._minimaxMove(gameCopy, maxDepth, player, currentDepth - 1);
            let score = miniMaxMove.score;

            losingMoves +=
                (game.currentPlayer === player && score < 0 || game.currentPlayer !== player && score > 0) ? 1 : 0;
            winningMoves +=
                (game.currentPlayer === player && score > 0 || game.currentPlayer !== player && score < 0) ? 1 : 0;
            neutralMoves += (score === 0) ? 1 : 0;
            offensiveMoves += (miniMaxMove.moveType === MoveType.Defensive) ? 1 : 0;

            // if (currentDepth === MAX_DEPTH) {
            //   moves_with_score += (moves_with_score.length > 0 ? ' , [' : '[') + move + ', ' + score + ']';
            // }

            if (bestScore === undefined ||
                bestScore !== fn(bestScore, score) ||
                (bestScore === score && Math.random() >= .8)) {
                bestScore = score;
                bestMove = move;
            }
            if (currentDepth === maxDepth && gameCopy.gameOver && gameCopy.winner === player) {
                break;
            }
        }

        // Experimenting with this...
        let moveType = MoveType.Neutral;

        if (offensiveMoves > 0) {
            moveType = MoveType.Offensive;
        } else if (bestScore === 0 && losingMoves > 0) {
            moveType = MoveType.Defensive;
        } else if (bestScore === 0 && winningMoves > 0) {
            moveType = MoveType.Stupid;
        } else if (game.currentPlayer === player && bestScore > 0 && losingMoves + neutralMoves > 0) {
            moveType = MoveType.Offensive;
        } else if (game.currentPlayer !== player && bestScore < 0 && losingMoves + neutralMoves > 0) {
            moveType = MoveType.Offensive;
        }

        /*
         if (currentDepth === MAX_DEPTH) {
         console.log('Evaluated: ', moves_with_score);
         console.log('Chose: [' + bestMove + ', ' + bestScore + '] ' + MoveType[moveType]);
         }
         */

        return {move: bestMove, score: bestScore, moveType: moveType};
    }

    reset() {
        this.plannedMoves = null;
        this.isThinking = false;
    }
}
