export enum CellContent {Empty, Player1, Player2, Winning}

type CellCoordinateType = {column:number, cell:number};
const WINNING_LENGTH = 4;

export class GameCell {
  constructor(public content = CellContent.Empty) {}

  setContent(newContent) {
    this.content = newContent;
  }
}

export class GameColumn {
  public cells:GameCell[];
  private currentIndex;

  constructor(public index:number, private cellCount:any, public game:ConnectFour) {
    this.cells = [];
    this.currentIndex = cellCount - 1;
    for (let i = 0; i < cellCount; i++) {
      this.cells.push(new GameCell());
    }
  }

  addPieceForCurrentPlayer():CellCoordinateType {
    let pieceAdded = null;
    if (this.currentIndex >= 0) {
      // I don't want to make any assumption about the actual numeric values in the CellContent Enum
      let cellContent = this.game.currentPlayer == 1 ? CellContent.Player1 : CellContent.Player2;
      this.cells[this.currentIndex].setContent(cellContent);
      pieceAdded = {column: this.index, cell: this.currentIndex};
      this.currentIndex--;
    }
    return pieceAdded;
  }

}

export class ConnectFour {
  columns:GameColumn[];
  currentPlayer:number;
  winner:number;
  gameOver:boolean;

  constructor(public columnCount:number, public cellsPerColumn:number) {
    this.reset();
  }

  reset() {
    let result = [];
    for (let i = 0; i < this.columnCount; i++) {
      result.push(new GameColumn(i, this.cellsPerColumn, this));
    }

    this.columns = result;
    this.currentPlayer = 1;
    this.winner = 0;
    this.gameOver = false;
  }

  advanceTurn() {
    if (!this.gameOver) {
      this.currentPlayer = this.currentPlayer % 2 + 1;
    }
  }

  getCellAt(c:CellCoordinateType):GameCell {
    let column = this.columns[c.column];
    let result = column ? column.cells[c.cell] : null;
    return result ? result : null;
  }

  getWinners(sequence:GameCell[], forPLayer:number):GameCell[] {
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

  getRow(row:number, _fromColumn:number, _toColumn:number):GameCell[] {
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

  getColumn(column:number, _fromRow:number, _toRow:number):GameCell[] {
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

  getDiagonal(fromCell:CellCoordinateType, toCell:CellCoordinateType):GameCell[] {
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

  hasWinner(column:number, cell:number):boolean {
    let piecePlaced = this.getCellAt({column: column, cell: cell}).content;
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
      ...this.getWinners(row, piecePlaced),
      ...this.getWinners(col, piecePlaced),
      ...this.getWinners(swToNe, piecePlaced),
      ...this.getWinners(nWToSe, piecePlaced)];

    let winnerFound = winners.length > 0;

    if (winnerFound) {
      winners.forEach((v, i, a) => v.content = CellContent.Winning);
      this.gameOver = true;
      this.currentPlayer = 0;
      this.winner = piecePlaced;
    }

    return winnerFound;
  }
}
