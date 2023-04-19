import * as Constants from "./constants/index.js";

export default class FourInARowGame {
    startingColor;
    currentTurn;
    status;
    currentBoard;

    constructor() {
        this.startingColor = Constants.PlayerColor.YELLOW;
        this.currentTurn = this.startingColor;
        this.status = Constants.GameStatus.START;
        this.currentBoard = FourInARowGame.createBoard();
    }

    static createBoard() {
        let board = new Array(Constants.BoardDimensions.ROWS);

        for (let i = 0; i < Constants.BoardDimensions.ROWS; i++) {
            board[i] = new Uint8Array(Constants.BoardDimensions.COLUMNS);
            board[i].fill(Constants.BoardToken.NONE);
        }

        return board;
    }

    playMove(columnIndex) {
        return {
            board: this.currentBoard,
            winner: Constants.PlayerColor.NONE,
            status: {
                value: Constants.MoveStatus.SUCCESS,
            },
            winLine: [],
        };
    }
}
