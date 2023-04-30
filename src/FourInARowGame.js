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

    static deepBoardCopy(oldBoard) {
        let newBoard = new Array(Constants.BoardDimensions.ROWS);

        for (let rowIndex = 0; rowIndex < Constants.BoardDimensions.ROWS; rowIndex++) {
            newBoard[rowIndex] = new Uint8Array(Constants.BoardDimensions.COLUMNS);
            for (let columnIndex = 0; columnIndex < Constants.BoardDimensions.COLUMNS; columnIndex++) {
                newBoard[rowIndex][columnIndex] = oldBoard[rowIndex][columnIndex];
            }
        }

        return newBoard;
    }

    static playerColorToBoardToken(playerColor) {
        switch (playerColor) {
            case Constants.PlayerColor.YELLOW:
                return Constants.BoardToken.YELLOW;
            case Constants.PlayerColor.RED:
                return Constants.BoardToken.RED;
            default:
                return Constants.BoardToken.NONE;
        }
    }


    playMove(columnIndex) {
        switch (this.status) {
            case Constants.GameStatus.START:
                this.status = Constants.GameStatus.IN_PROGRESS;
                break;
            case Constants.GameStatus.DRAW:
            case Constants.GameStatus.WIN:
                // The game is over at this point so
                // re-evaluate the latest board, returning the same game status
                // and board details.

                // TODO: Implement this properly
                console.log("Game already ended in win or draw. re-evaluating latest game state");
            default:
                break;
        }

        let moveResults = this.performMove(columnIndex);
        this.currentTurn = this.currentTurn === Constants.PlayerColor.YELLOW
            ? Constants.PlayerColor.RED
            : Constants.PlayerColor.YELLOW;

        return moveResults;
    }


    performMove(columnIndex) {
        let nextBoard = FourInARowGame.deepBoardCopy(this.currentBoard);

        let moveAttemptResult = this.tryPerformMove(columnIndex, nextBoard);

        if (moveAttemptResult.status === Constants.MoveStatus.INVALID) {
            return {
                board: nextBoard,
                winner: Constants.PlayerColor.NONE,
                status: {
                    message: "Returned column is filled",
                    value: Constants.MoveStatus.INVALID
                },
                winLine: []
            }
        }

        // From this point, the board move was successful.
        this.currentBoard = moveAttemptResult.board;
        return this.evaluateGame(moveAttemptResult.board);
    }

    tryPerformMove(columnIndex, nextBoard) {
        let isMoveValid = false;

        for (let i = nextBoard.length - 1; i > -1; i--) {
            let boardRow = nextBoard[i];
            let boardPosition = boardRow[columnIndex];

            if (boardPosition !== Constants.BoardToken.NONE) {
                continue;
            }

            boardRow[columnIndex] = FourInARowGame.playerColorToBoardToken(this.currentTurn);
            isMoveValid = true;
            break;
        }

        if (!isMoveValid) {
            return {
                status: Constants.MoveStatus.INVALID,
            };
        }

        return {
            status: Constants.MoveStatus.SUCCESS,
            board: nextBoard
        };
    }

    evaluateGame(board) {
        // From this point, you can assume that a successful move was made and the game will
        // continue on.
        return {
            board: board,
            winner: Constants.PlayerColor.NONE,
            status: {
                value: Constants.MoveStatus.SUCCESS
            },
            winLine: []
        };
    }
}
