// export enum CellContent {Empty, Player1, Player2, Winning}

type CellCoordinateType = {column: number, cell: number};
const WINNING_LENGTH = 4;

export class GameCell {
  isWinning: boolean = false;

  constructor(public content = 0) {}

  setContent(newContent) {
    this.content = newContent;
  }

  setWinning() {
    this.isWinning = true;
  }

  copy(): GameCell {
    let result = new GameCell(this.content);
    result.isWinning = this.isWinning;
    return result;
  }

  toJSON(): any {
    return {
      isWinning: this.isWinning,
      content: this.content
    };
  }

  static fromJSON(json: any): GameCell {
    let result = new GameCell(json.content);
    result.isWinning = json.isWinning;
    return result;
  }
}

export class GameColumn {
  public cells: GameCell[];
  private currentIndex;

  constructor(public index: number, private cellCount: any) {
    this.cells = [];
    this.currentIndex = cellCount - 1;
    for (let i = 0; i < cellCount; i++) {
      this.cells.push(new GameCell());
    }
  }

  copy(): GameColumn {
    let result = new GameColumn(this.index, this.cellCount);
    result.cells = this.cells.map((v, i, a) => v.copy());
    result.currentIndex = this.currentIndex;
    return result;
  }

  toJSON(): any {
    return {
      index: this.index,
      cellCount: this.cellCount,
      cells: this.cells.map((v, i, a) => v.toJSON()),
      currentIndex: this.currentIndex
    }
  }

  static fromJSON(json: any): GameColumn {
    let result = new GameColumn(json.index, json.cellCount);
    result.currentIndex = json.currentIndex;
    result.cells = json.cells.map((v, i, a) => GameCell.fromJSON(v));
    return result;
  }


  isFull(): boolean {
    return this.currentIndex < 0;
  }

  addPiece(player: number): CellCoordinateType {
    let pieceAdded = null;
    if (this.currentIndex >= 0) {
      this.cells[this.currentIndex].setContent(player);
      pieceAdded = {column: this.index, cell: this.currentIndex};
      this.currentIndex--;
    }
    return pieceAdded;
  }

}

export class ConnectFour {
  columns: GameColumn[];
  currentPlayer: number;
  winner: number;
  gameOver: boolean;
  lastMove: CellCoordinateType;
  moveCount: number = 0;

  constructor(public columnCount: number, public cellsPerColumn: number) {
    this.reset();
  }

  copy() {
    let result = new ConnectFour(this.columnCount, this.cellsPerColumn);
    result.columns = this.columns.map((v, i, a) => {
      let colCopy = v.copy();
      return colCopy;
    });
    result.currentPlayer = this.currentPlayer;
    result.winner = this.winner;
    result.gameOver = this.gameOver;
    result.lastMove = {column: this.lastMove.column, cell: this.lastMove.cell};
    result.moveCount = this.moveCount;
    return result;
  }

  toJSON(): any {
    return {
      columnCount: this.columnCount,
      cellsPerColumn: this.cellsPerColumn,
      columns: this.columns.map((v, i, a) => v.toJSON()),
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      gameOver: this.gameOver,
      lastMove: this.lastMove,
      moveCount: this.moveCount
    }
  }

  static fromJSON(json: any): ConnectFour {
    let result = new ConnectFour(json.columnCount, json.cellsPerColumn);
    result.columns = json.columns.map((v, i, a) => GameColumn.fromJSON(v));
    result.currentPlayer = json.currentPlayer;
    result.winner = json.winner;
    result.gameOver = json.gameOver;
    result.lastMove = json.lastMove;
    result.moveCount = json.moveCount;
    return result;
  }

  reset() {
    let result = [];
    for (let i = 0; i < this.columnCount; i++) {
      let column = new GameColumn(i, this.cellsPerColumn);
      result.push(column);
    }

    this.columns = result;
    this.currentPlayer = 1;
    this.winner = 0;
    this.gameOver = false;
    this.moveCount = 0;
    this.lastMove = {column: -1, cell: -1};
  }


  playAtColumn(index: number) {
    if (!this.gameOver && index >= 0 && index < this.columnCount) {
      let pieceAdded = this.columns[index].addPiece(this.currentPlayer)
      if (pieceAdded) {
        this.moveCount++;
        this.lastMove = pieceAdded;
        this.currentPlayer = this.currentPlayer % 2 + 1;
        this.checkWinner();
        this.gameOver = this.gameOver || this.moveCount > this.columnCount * this.cellsPerColumn;
      }
    }
  }

  getCellAt(c: CellCoordinateType): GameCell {
    let column = this.columns[c.column];
    let result = column ? column.cells[c.cell] : null;
    return result ? result : null;
  }

  getAvailableMoves(): GameColumn[] {
    let result = this.columns.filter((v, i, a) => !v.isFull());
    return result;
  }

  getWinnersInSequence(sequence: GameCell[], forPLayer: number): GameCell[] {
    let result = [];
    let currentIndex = sequence.findIndex((e) => e.content === forPLayer);
    let iteration = 1;

    while (currentIndex < sequence.length - WINNING_LENGTH + 1) {
      let noMatchIndex = sequence.slice(currentIndex).findIndex((e) => e.content !== forPLayer);
      noMatchIndex = (noMatchIndex === -1) ? sequence.length : noMatchIndex;

      if (noMatchIndex >= WINNING_LENGTH) {
        result.push(...sequence.slice(currentIndex, noMatchIndex));
      }
      currentIndex += noMatchIndex + 1;
    }

    return result;
  }

  getRow(row: number, _fromColumn: number, _toColumn: number): GameCell[] {
    let fromColumn = Math.max(Math.min(_fromColumn, _toColumn), 0);
    let toColumn = Math.min(Math.max(_fromColumn, _toColumn), this.columnCount - 1);
    let result = [];

    for (let i = fromColumn; i <= toColumn; i++) {
      let cell = this.getCellAt({column: i, cell: row});
      if (cell !== null) {
        result.push(cell);
      }
    }

    return result;
  }

  getColumn(column: number, _fromRow: number, _toRow: number): GameCell[] {
    let fromRow = Math.max(Math.min(_fromRow, _toRow), 0);
    let toRow = Math.min(Math.max(_fromRow, _toRow), this.cellsPerColumn - 1);
    let result = [];

    for (let i = fromRow; i <= toRow; i++) {
      let cell = this.getCellAt({column: column, cell: i});
      if (cell !== null) {
        result.push(cell);
      }
    }

    return result;
  }

  getDiagonal(fromCell: CellCoordinateType, toCell: CellCoordinateType): GameCell[] {
    let result = [];

    if (toCell.column !== fromCell.column) {
      let slope = (toCell.cell - fromCell.cell) / (toCell.column - fromCell.column);

      if (slope === 1 || slope === -1) {
        let fromCol = Math.max(Math.min(fromCell.column, toCell.column), 0);
        let toCol = Math.min(Math.max(fromCell.column, toCell.column), this.columnCount - 1);
        let intercept = fromCell.cell - slope * fromCell.column;

        for (let c = fromCol; c <= toCol; c++) {
          let cell = this.getCellAt({column: c, cell: (slope * c + intercept)});
          if (cell !== null) {
            result.push(cell);
          }
        }
      }
    }
    return result;
  }

  checkWinner() {
    let column = this.lastMove.column;
    let cell = this.lastMove.cell;

    let player = this.getCellAt({column: column, cell: cell}).content;
    let delta = WINNING_LENGTH - 1;

    let row = this.getRow(cell, column - delta, column + delta);
    let col = this.getColumn(column, cell - delta, cell + delta);
    let swToNe = this.getDiagonal(
      {column: (column - delta), cell: (cell + delta)},
      {column: (column + delta), cell: (cell - delta)});

    let nWToSe = this.getDiagonal(
      {column: (column - delta), cell: (cell - delta)},
      {column: (column + delta), cell: (cell + delta)});

    let winners = [
      ...this.getWinnersInSequence(row, player),
      ...this.getWinnersInSequence(col, player),
      ...this.getWinnersInSequence(swToNe, player),
      ...this.getWinnersInSequence(nWToSe, player)];

    let winnerFound = winners.length > 0;

    if (winnerFound) {
      winners.forEach((v, i, a) => v.setWinning());
      this.gameOver = true;
      this.currentPlayer = 0;
      this.winner = player;
    }
  }
}
