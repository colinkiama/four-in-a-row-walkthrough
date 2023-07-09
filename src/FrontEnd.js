import { FrontEndConfig, BoardConfig, StatusAreaConfig, StatusMessages, PlayAgainButtonConfig } from "./constants/index.js";
import { Board, StatusArea, PlayAgainButton } from "./components/index.js";
import { Constants, FourInARowGame } from "./gameLogic/index.js";

export default class FrontEnd {
    game;
    canvas;
    width;
    height;
    context;
    board;
    statusArea;
    playAgainButton;
    gameOver;

    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById("canvas");
        this.canvas.style.background = FrontEndConfig.GAME_BACKGROUND_COLOR;
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = this.canvas.getContext("2d");
        this.gameOver = false;

        this.enableHiDPISupport();
    }

    start() {
        this.statusArea = this.createStatusArea();
        this.board = this.createBoard();
        this.playAgainButton = this.createPlayAgainButton();

        document.body.addEventListener('click', (clickEvent) => {
            this.board.handleClick(clickEvent);
            this.playAgainButton.handleClick(clickEvent);
        });
    }

    createBoard() {
        let board = new Board(this.context, BoardConfig.MARGIN_LEFT, this.statusArea.height + BoardConfig.MARGIN_TOP, BoardConfig.WIDTH, BoardConfig.HEIGHT);
        board.setColumnSelectionHandler((columnIndex) => this.playMove(columnIndex));
        board.render(this.game.currentBoard);
        return board;
    }

    createStatusArea() {
        let statusArea = new StatusArea(this.context, 0, 0, this.width, StatusAreaConfig.HEIGHT);
        statusArea.render(this.game.currentTurn, this.pickStatusMessage(this.game.status));
        return statusArea;
    }

    createPlayAgainButton() {
        let buttonX = this.width / 2 - PlayAgainButtonConfig.WIDTH / 2;
        let buttonY = this.height - PlayAgainButtonConfig.MARGIN_BOTTOM;
        let button = new PlayAgainButton(this.context, buttonX, buttonY, PlayAgainButtonConfig.WIDTH, PlayAgainButtonConfig.HEIGHT);
        button.setClickHandler(() => this.reset());
        return button;
    }

    enableHiDPISupport() {
        // Get the DPR and size of the canvas
        const dpr = window.devicePixelRatio;
        const rect = this.canvas.getBoundingClientRect();

        // Set the "actual" size of the canvas
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Scale the context to ensure correct drawing operations
        this.context.scale(dpr, dpr);

        // Set the "drawn" size of the canvas
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
    }

    playMove(columnIndex) {
        let moveResult = this.game.playMove(columnIndex);
        this.processMoveResult(moveResult);
    }

    processMoveResult(moveResult) {
        if (this.gameOver || moveResult.status.value === Constants.MoveStatus.INVALID) {
            return;
        }

        const indicatorColor = this.determineIndicatorColor(moveResult);

        this.statusArea.render(indicatorColor, this.pickStatusMessage(moveResult.status.value))
        this.board.render(this.game.currentBoard);


        if (moveResult.status.value === Constants.MoveStatus.WIN || moveResult.status.value === Constants.MoveStatus.DRAW) {
            this.gameOver = true;
        }

        if (this.gameOver) {
            this.playAgainButton.render();
        }
    }

    determineIndicatorColor(moveResult) {
        if (moveResult.status.value === Constants.MoveStatus.DRAW) {
            return Constants.PlayerColor.NONE
        } else if (moveResult.status.value === Constants.MoveStatus.WIN) {
            return moveResult.winner;
        } else {
            return this.game.currentTurn;
        }
    }

    pickStatusMessage(status) {
        switch (status) {
            case Constants.GameStatus.WIN:
                // The game's changed to the next turn but the next turn can't be played yet so the winning player is the opposite of the current turn
                return this.game.currentTurn === Constants.PlayerColor.YELLOW ? StatusMessages.RED_WIN : StatusMessages.YELLOW_WIN;
            case Constants.GameStatus.DRAW:
                return StatusMessages.DRAW;
        }

        // At this point, we can assume that the game is either has just started 
        // or is still in progress.
        return this.game.currentTurn === Constants.PlayerColor.YELLOW ? StatusMessages.YELLOW_TURN : StatusMessages.RED_TURN;
    }

    reset() {
        this.game = new FourInARowGame();
        this.gameOver = false;

        this.playAgainButton.hide();
        this.statusArea.render(this.game.currentTurn, this.pickStatusMessage(this.game.status));
        this.board.render(this.game.currentBoard);
    }
}
