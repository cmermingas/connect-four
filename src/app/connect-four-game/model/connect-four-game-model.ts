// import {EventEmitter} from '@angular/core';

export type GameCoordinateType = {column: number, cell: number};

const WINNING_LENGTH = 4;
export enum CellContent {Empty = 0, Winning = -1}

export class GameCell {
    constructor(public content: number) {};
}

export class ConnectFourGameModel {
    currentPlayer: number;
    gameOver: boolean;
    winner: number;
    moveCount: number;
    lastMove: GameCoordinateType;
    columns: GameCell[][];
    columnIndex: number[];
    // turnAdvanced = new EventEmitter<number>();

    static fromJSON(jsonData: any): ConnectFourGameModel {
        let result = new ConnectFourGameModel(jsonData.columnCount, jsonData.cellsPerColumn);
        result.currentPlayer = jsonData.currentPlayer;
        result.gameOver = jsonData.gameOver;
        result.winner = jsonData.winner;
        result.moveCount = jsonData.moveCount;
        result.lastMove = {column: jsonData.lastMove.column, cell: jsonData.lastMove.cell};
        result.columns = jsonData.columns.map(column => column.map(cell => new GameCell(cell)));
        result.columnIndex = jsonData.columnIndex.slice();
        return result;
    }

    toJSON(): any {
        return {
            columnCount: this.columnCount,
            cellsPerColumn: this.cellsPerColumn,
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            moveCount: this.moveCount,
            lastMove: {column: this.lastMove.column, cell: this.lastMove.cell},
            columns: this.columns.map(column => column.map(cell => cell.content)),
            columnIndex: this.columnIndex.slice()
        };
    }

    constructor(public columnCount: number, public cellsPerColumn: number) {
        this.reset();
    }

    reset() {
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = 0;
        this.moveCount = 0;
        this.lastMove = {column: -1, cell: -1};

        let columnPrototype: GameCell[] = [];
        for (let cell = 0; cell < this.cellsPerColumn; cell++) {
            columnPrototype.push(new GameCell(CellContent.Empty));
        }

        let newColumns = [];
        this.columnIndex = [];
        for (let col = 0; col < this.columnCount; col++) {
            newColumns.push(columnPrototype.map(cell => new GameCell(cell.content)));
            this.columnIndex.push(this.cellsPerColumn - 1);
        }

        this.columns = newColumns;
    }

    copy(): ConnectFourGameModel {
        let result = new ConnectFourGameModel(this.columnCount, this.cellsPerColumn);
        result.currentPlayer = this.currentPlayer;
        result.gameOver = this.gameOver;
        result.winner = this.winner;
        result.moveCount = this.moveCount;

        // Make copies of objects and arrays:
        result.lastMove = {column: this.lastMove.column, cell: this.lastMove.cell};
        result.columns = this.columns.map(column => column.map(cell => new GameCell(cell.content)));
        result.columnIndex = this.columnIndex.slice();

        return result;
    }

    playAtColumn(col: number): boolean {
        let result = false;
        const cellIndex = this.columnIndex[col];
        if (cellIndex >= 0 && !this.gameOver) {
            this.columns[col][cellIndex] = new GameCell(this.currentPlayer);
            this.currentPlayer = this.currentPlayer % 2 + 1;
            this.moveCount++;
            this.lastMove = {column: col, cell: cellIndex};
            this.columnIndex[col]--;
            this._checkWinners();
            result = true;
        }
        return result;
    }

    getAvailableMoves(): number[] {
        let result = [];

        if (!this.gameOver) {
            this.columnIndex.forEach((item, i) => {
                if (item >= 0) {
                    result.push(i);
                }
            });
        }

        return result;
    }

    getCell(gameCell: GameCoordinateType): number {
        return (
            this.columns[gameCell.column] &&
            this.columns[gameCell.column][gameCell.cell] &&
            this.columns[gameCell.column][gameCell.cell].content);
    }

    _checkWinnersAt(gameCell: GameCoordinateType, player: number, slope: number): boolean {
        // Slope === null is used as a special value for checking columns
        const VALID_SLOPES = [1, -1, 0, null];

        if (VALID_SLOPES.indexOf(slope) === -1) {
            return false;
        }

        let winningIdx: GameCoordinateType[] = [];

        for (let i = -WINNING_LENGTH + 1; i <= WINNING_LENGTH - 1; i++) {

            let checkingCellCoordinates = {
                column: gameCell.column + (slope === null ? 0 : i),
                cell: gameCell.cell + (slope === null ? 1 : slope) * i
            };

            let checkingCell = this.getCell(checkingCellCoordinates);

            if (checkingCell === player || checkingCell === CellContent.Winning) {
                winningIdx.push(checkingCellCoordinates);
            } else {
                if (winningIdx.length < WINNING_LENGTH) {
                    winningIdx = [];
                }

                if (i === 1) {
                    break;
                }
            }

        }

        if (winningIdx.length >= WINNING_LENGTH) {
            for (let item of winningIdx) {
                this.columns[item.column][item.cell] = new GameCell(CellContent.Winning);
            }
        }

        return winningIdx.length >= WINNING_LENGTH;
    }

    _checkSeToNwDiagonal(gameCell: GameCoordinateType, player: number): boolean {
        return this._checkWinnersAt(gameCell, player, 1);
    }

    _checkSwToNeDiagonal(gameCell: GameCoordinateType, player: number): boolean {
        return this._checkWinnersAt(gameCell, player, -1);
    }

    _checkColumnAt(gameCell: GameCoordinateType, player: number): boolean {
        return this._checkWinnersAt(gameCell, player, null);
    }

    _checkRowAt(gameCell: GameCoordinateType, player: number) {
        return this._checkWinnersAt(gameCell, player, 0);
    }

    _checkWinners() {
        const player = this.getCell(this.lastMove);
        let hasWinner = false;
        if (this.moveCount >= WINNING_LENGTH * 2 - 1 && player) {
            hasWinner = this._checkSeToNwDiagonal(this.lastMove, player);
            hasWinner = this._checkSwToNeDiagonal(this.lastMove, player) || hasWinner;
            hasWinner = this._checkRowAt(this.lastMove, player) || hasWinner;
            hasWinner = this._checkColumnAt(this.lastMove, player) || hasWinner;
            if (hasWinner) {
                this.winner = player;
                this.gameOver = true;
                this.currentPlayer = 0;
            }
        }
    }

    // Debugging sanity
    toString(): string {
        let result = '';
        for (let cell = 0; cell < this.cellsPerColumn; cell++) {
            result += (cell > 0 ? '\n' : '');
            for (let col = 0; col < this.columnCount; col++) {
                result += (col > 0 ? ' ' : '') + this.columns[col][cell].content;
            }
        }
        return result;
    }
}
