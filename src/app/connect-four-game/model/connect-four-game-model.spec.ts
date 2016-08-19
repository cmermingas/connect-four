/* tslint:disable:no-unused-variable */

// import {addProviders, async, inject} from '@angular/core/testing';
import {ConnectFourGameModel} from './connect-four-game-model';

// These are the dimensions used in the test game below
// The original intention was to be able to change these as constants but then some tests got some hardcoded states
// that were easier to check. So, don't change these constants. If a test is needed with a different dimension,
// then create that game wherever is needed.
const COLUMNS = 6;
const CELLS_PER_COLUMN = 7;

describe('ConnectFourGameModel', () => {
    let game;

    /* Parses a string that represents a game state and converts it into an array of arrays.
     * The input string is a visual representation of the game, like this:
     *
     *  0 1 0 0 0 0
     *  0 2 0 0 0 0
     *  0 1 0 0 0 0
     *  0 2 0 0 0 0
     *
     * Each number represents the content of that cell. In the above example the numbers represent players 1 and 2.
     *
     * This string is converted into an array like this:
     *
     *  [['0', '1', '0', '0', '0', '0'],
     *   ['0', '2', '0', '0', '0', '0'],
     *   ['0', '1', '0', '0', '0', '0'],
     *   ['0', '2', '0', '0', '0', '0']]
     *
     * Line breaks and extra whitespace in the original string gets removed.
     */
    let _parseGameState = function (gameState: string): any {
        return gameState
            .split('\n')
            .map(item => item.replace(/\s+/g, ' ').trim())
            .filter(item => item !== '')
            .map(item => item.split(' '));
    };

    /* Returns true if the state of the game matches the state given as a string.
     * See _parseGameState for information on how this string is interpreted.
     * Use asterisks in the string to denote a position for which the contents don't matter.
     */

    let gameEquals = function (_game: ConnectFourGameModel, gameState: string): boolean {
        let allGood = true;

        let parsedState = _parseGameState(gameState);

        // console.log(parsedState);

        for (let col = 0; col < _game.columnCount && allGood; col++) {
            for (let cell = 0; cell < _game.cellsPerColumn && allGood; cell++) {
                let expectedValue = parsedState[cell][col];
                allGood = expectedValue === '*' || _game.columns[col][cell].content === parseInt(expectedValue, 10);
                // console.log('[' + col + ', ' + cell + '] Game = ' + game.columns[col][cell] +
                // ' / expected = ' + expectedValue + ' => ' + allGood);
            }
        }

        return allGood;
    };


    /* Takes a game and a game state represented as a string and plays the game turn by turn to try to
     * take it to the desired state.
     * See _parseGameState for information on how this string is interpreted.
     */
    let playToState = function (_game: ConnectFourGameModel, gameState: string) {
        // The parsed state is ordered from top row to bottom row.
        // We reverse it because the game is played from bottom to top.
        // Then we convert it back to a string without delimiter.
        let stateString = _parseGameState(gameState).reverse().join().replace(/,/g, '');

        // We will successively find the next play for the current player.
        let index = stateString.indexOf(_game.currentPlayer.toString());

        // While we have a valid play and the game is not over
        while (index >= 0 && !_game.gameOver) {
            // Find the piece on which the current move will land.
            let supportIndex = index < _game.columnCount ? index : index - _game.columnCount;

            // If the supporting space is empty and we haven't ran out of moves, try to find the next viable move.
            while (stateString[supportIndex] === '0' && index >= 0) {
                index = stateString.indexOf(_game.currentPlayer.toString(), index + 1);
                supportIndex = index < _game.columnCount ? index : index - _game.columnCount;
            }

            // If we found a move, then play it
            if (index >= 0) {
                let col = Math.floor(index % _game.columnCount);
                _game.playAtColumn(col);
                // console.log('Player ' + _game.currentPlayer + ' plays at [' + _game.lastMove.column + ', ' + _game.lastMove.cell +
                //   ' / supported by [' + supportIndex + ']: ' + stateString[supportIndex]);
                stateString = stateString.substr(0, index) + '*' + stateString.substr(index + 1);

                // And find the next move
                index = stateString.indexOf(_game.currentPlayer.toString());
            }
        }
    };

    // End of utility functions. Let the testing begin!

    beforeEach(() => {
        game = new ConnectFourGameModel(COLUMNS, CELLS_PER_COLUMN);
    });

    it('should create an instance', () => {
        expect(game instanceof ConnectFourGameModel).toBeTruthy();
    });

    it('should have player 1 as current player', () => {
        expect(game.currentPlayer).toEqual(1);
    });

    it('should not be over', () => {
        expect(game.gameOver).toEqual(false);
    });

    it('should have no winner', () => {
        expect(game.winner).toEqual(0);
    });

    it('should have no valid last move', () => {
        expect(game.lastMove).toEqual({column: -1, cell: -1});
    });

    it('should have no moves', () => {
        expect(game.moveCount).toEqual(0);
    });

    it(`should have ${COLUMNS} columns`, () => {
        expect(game.columns.length).toEqual(COLUMNS);
    });

    it(`should have ${CELLS_PER_COLUMN} cells in each column`, () => {
        game.columns.forEach(col => expect(col.length).toEqual(CELLS_PER_COLUMN));
    });

    it('should have all cells empty', () => {
        let expected = `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0`;
        expect(gameEquals(game, expected)).toEqual(true);
    });

    it('should have all columns as available moves', () => {
        expect(game.getAvailableMoves()).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('should create a new instance of the columns array when reset() is called', () => {
        let oldColumns = game.columns;
        game.reset();
        expect(game.columns).not.toBe(oldColumns);
    });

    it('should perform move for player 1', () => {
        game.playAtColumn(2);
        let expected = `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 1 0 0 0`;
        expect(gameEquals(game, expected)).toEqual(true);
    });

    it('should return true when a valid move is done', () => {
        let result = game.playAtColumn(2);
        expect(result).toEqual(true);
    });

    it('should advance player on each move', () => {
        game.playAtColumn(2);
        expect(game.currentPlayer).toEqual(2);
        game.playAtColumn(2);
        expect(game.currentPlayer).toEqual(1);
    });

    it('should keep track of move count', () => {
        game.playAtColumn(1);
        game.playAtColumn(2);
        game.playAtColumn(3);
        game.playAtColumn(4);
        game.playAtColumn(5);
        expect(game.moveCount).toEqual(5);
    });

    it('should keep track of the last move', () => {
        game.playAtColumn(1);
        expect(game.lastMove).toEqual({column: 1, cell: 6});
        game.playAtColumn(1);
        expect(game.lastMove).toEqual({column: 1, cell: 5});
        game.playAtColumn(3);
        expect(game.lastMove).toEqual({column: 3, cell: 6});
    });

    it('should stack moves on the same column', () => {
        game.playAtColumn(2);
        game.playAtColumn(2);
        game.playAtColumn(2);
        game.playAtColumn(3);
        game.playAtColumn(3);
        let expected = `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 1 0 0 0
      0 0 2 1 0 0
      0 0 1 2 0 0`;
        expect(gameEquals(game, expected)).toEqual(true);
    });

    describe('a full column', () => {
        beforeEach(() => {
            playToState(game, `
        0 1 0 0 0 0
        0 2 0 0 0 0
        0 1 0 0 0 0
        0 2 0 0 0 0
        0 1 0 0 0 0
        0 2 0 0 0 0
        0 1 0 0 0 0`);
        });

        it('should be excluded from the available moves', () => {
            expect(game.getAvailableMoves()).toEqual([0, 2, 3, 4, 5]);
        });

        it('should return false after one more play in same column', () => {
            let result = game.playAtColumn(1); // Extra piece that doesn't fit in the column
            expect(result).toEqual(false);
        });

        it('should not advance the player after one more play in same column', () => {
            game.playAtColumn(1); // Extra piece that doesn't fit in the column
            expect(game.currentPlayer).toEqual(2);
        });

        it('should not modify the last move after one more play in same column', () => {
            game.playAtColumn(1); // Extra piece that doesn't fit in the column
            expect(game.lastMove).toEqual({column: 1, cell: 0});
        });

        it('should not increment the move count after one more play in same column', () => {
            game.playAtColumn(1); // Extra piece that doesn't fit in the column
            expect(game.moveCount).toEqual(7);
        });

        it('should not change the board after one more play in same column', () => {
            game.playAtColumn(1); // Extra piece that doesn't fit in the column
            let expected = `
      0 1 0 0 0 0
      0 2 0 0 0 0
      0 1 0 0 0 0
      0 2 0 0 0 0
      0 1 0 0 0 0
      0 2 0 0 0 0
      0 1 0 0 0 0`;
            expect(gameEquals(game, expected)).toEqual(true);
        });
    });

    it('should report winner = player 1 with a NW-SE diagonal row', () => {
        playToState(game, `
        0 0 0 0 0 0
        0 0 0 0 0 0
        0 0 0 0 0 0
        1 0 0 0 0 0
        2 1 2 0 0 0
        1 1 1 2 0 0
        1 2 2 1 2 0`);
        expect(game.winner).toEqual(1);
    });

    it('should report winner = player 2 with a NW-SE diagonal row', () => {
        playToState(game, `
        0 0 0 0 0 0
        0 0 0 0 0 0
        0 2 0 0 0 0
        1 1 2 0 0 0
        2 1 2 2 0 0
        1 1 1 2 2 1
        1 2 1 2 2 1`);
        expect(game.winner).toEqual(2);
    });

    it('should report winner = player 1 with a SW-NE diagonal row', () => {
        playToState(game, `
        0 0 0 0 0 0
        0 0 0 0 0 1
        0 0 0 0 1 2
        1 2 2 1 1 2
        2 1 1 2 1 2
        1 2 2 1 2 1
        2 1 2 1 2 1`);
        expect(game.winner).toEqual(1);
    });

    it('should report winner = player 2 with a SW-NE diagonal row', () => {
        playToState(game, `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 1 2
      0 0 0 1 2 2
      0 0 0 2 1 2
      0 0 2 1 1 1`);
        expect(game.winner).toEqual(2);
    });

    it('should report winner = player 1 with a horizontal row', () => {
        playToState(game, `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 2 2 2 0 0
      0 1 1 1 1 0`);
        expect(game.winner).toEqual(1);
    });

    it('should report winner = player 2 with a horizontal row', () => {
        playToState(game, `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 2 2 2 2 1
      0 1 1 1 2 1`);
        expect(game.winner).toEqual(2);
    });

    it('should report winner = player 1 with a vertical row', () => {
        playToState(game, `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 1 0 0 0 0
      0 1 2 0 0 0
      0 1 2 0 0 0
      0 1 2 0 0 0`);
        expect(game.winner).toEqual(1);
    });

    it('should flag as winner all winning tiles', () => {
        playToState(game, `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      1 0 0 0 0 0
      2 1 0 0 0 2
      2 2 1 0 2 2
      2 1 1 0 1 1`);
        game.playAtColumn(3);
        expect(game.winner).toEqual(1);
        let expected = `
       0  0  0  0  0  0
       0  0  0  0  0  0
       0  0  0  0  0  0
      -1  0  0  0  0  0
       2 -1  0  0  0  2
       2  2 -1  0  2  2
       2 -1 -1 -1 -1 -1`;
        expect(gameEquals(game, expected)).toEqual(true);
    });

    describe('a game with a winner', () => {
        beforeEach(() => {
            playToState(game, `
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 0 0 0 0 0
      0 1 0 0 0 0
      0 1 2 0 0 0
      0 1 2 0 0 0
      0 1 2 0 0 0`);
        });

        it('should be over', () => {
            expect(game.gameOver).toEqual(true);
        });

        it('should not have a valid current player', () => {
            expect(game.currentPlayer).toEqual(0);
        });

        it('should not return any available moves', () => {
            expect(game.getAvailableMoves()).toEqual([]);
        });

        it('should not register any additional moves', () => {
            let expected = `
        0  0 0 0 0 0
        0  0 0 0 0 0
        0  0 0 0 0 0
        0 -1 0 0 0 0
        0 -1 2 0 0 0
        0 -1 2 0 0 0
        0 -1 2 0 0 0`;
            game.playAtColumn(2);
            expect(gameEquals(game, expected)).toEqual(true);
        });
    });

    it('should create a deep copy of itself', () => {
        playToState(game, `
        0 0 0 0 0 0
        0 0 0 0 0 0
        0 0 0 0 0 0
        1 0 0 0 0 0
        2 1 2 0 0 0
        1 1 1 2 0 0
        1 2 2 1 2 0`);

        let gameCopy: ConnectFourGameModel = game.copy();

        // Too many expectations for one small test but I didn't want to repeat over and over
        // So I added a message to each one to make it easier to interpret and debug errors.

        expect(gameCopy.columnCount).toEqual(game.columnCount, 'columnCount not copied');
        expect(gameCopy.cellsPerColumn).toEqual(game.cellsPerColumn, 'cellsPerColumn not copied');
        expect(gameCopy.currentPlayer).toEqual(game.currentPlayer, 'currentPlayer not copied');
        expect(gameCopy.gameOver).toEqual(game.gameOver, 'gameOver not copied');
        expect(gameCopy.winner).toEqual(game.winner, 'gameOver not copied');
        expect(gameCopy.moveCount).toEqual(game.moveCount, 'moveCount not copied');
        expect(gameCopy.lastMove).toEqual(game.lastMove, ' not copied');
        expect(gameCopy.columns).toEqual(game.columns, 'columns not copied');
        expect(gameCopy.columnIndex).toEqual(game.columnIndex, 'columnIndex not copied');

        // Properties that should be new objects
        expect(gameCopy.lastMove).not.toBe(game.lastMove, 'lastMove should be a new instance');
        expect(gameCopy.columns).not.toBe(game.columns, 'columns should be a new instance');
        expect(gameCopy.columnIndex).not.toBe(game.columnIndex, 'columnIndex should be a new instance');
    });

    describe('when converting to JSON', () => {
        let jsonGame;
        beforeEach(() => {
            playToState(game, `
        0 0 0 0 0 0
        0 0 0 0 0 0
        0 0 0 0 0 0
        1 0 0 0 0 0
        2 1 2 0 0 0
        1 1 1 2 0 0
        1 2 2 1 2 0`);

            jsonGame = game.toJSON();
        });

        it('should produce the same state', () => {
            let expected = {
                columnCount: 6,
                cellsPerColumn: 7,
                currentPlayer: 0,
                gameOver: true,
                winner: 1,
                moveCount: 13,
                lastMove: {column: 0, cell: 3},
                columns: [
                    [0, 0, 0, -1, 2, 1, 1],
                    [0, 0, 0, 0, -1, 1, 2],
                    [0, 0, 0, 0, 2, -1, 2],
                    [0, 0, 0, 0, 0, 2, -1],
                    [0, 0, 0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0]],
                columnIndex: [2, 3, 3, 4, 5, 6]
            };
            expect(jsonGame).toEqual(expected);
        });

        it('should create a deep copy of the columns array', () => {
            expect(game.colums).not.toBe(jsonGame.columns, 'columns array in game and jsonGame are the same instance');
            game.columns.forEach((item, index, a) => {
                expect(item).not.toBe(jsonGame.columns[index], 'elements in columns array are the same instance');
            });
        });
    });

    describe('with a game loaded from JSON', () => {
        let jsonGame;
        beforeEach(() => {
            jsonGame = ConnectFourGameModel.fromJSON({
                columnCount: 6,
                cellsPerColumn: 7,
                currentPlayer: 1,
                gameOver: false,
                winner: 0,
                moveCount: 12,
                lastMove: {column: 1, cell: 4},
                columns: [
                    [0, 0, 0, 0, 2, 1, 1],
                    [0, 0, 0, 0, 1, 1, 2],
                    [0, 0, 0, 0, 2, 1, 2],
                    [0, 0, 0, 0, 0, 2, 1],
                    [0, 0, 0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0]],
                columnIndex: [3, 3, 3, 4, 5, 6]
            });
        });

        it('should have the correct static properties', () => {
            expect(jsonGame.columnCount).toEqual(6, 'columnCount incorrect');
            expect(jsonGame.cellsPerColumn).toEqual(7, 'cellsPerColumn incorrect');
            expect(jsonGame.currentPlayer).toEqual(1, 'currentPlayer incorrect');
            expect(jsonGame.gameOver).toEqual(false, 'gameOver incorrect');
            expect(jsonGame.winner).toEqual(0, 'winner incorrect');
            expect(jsonGame.moveCount).toEqual(12, 'moveCount should be 6');
            expect(jsonGame.lastMove).toEqual({column: 1, cell: 4}, 'lastMove incorrect');
        });
    });
});
