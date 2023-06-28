import { FrontEndConfig, BoardConfig } from "./constants/index.js";
import { Board } from "./components/index.js";
import { Constants } from "./gameLogic/index.js";

export default class FrontEnd {
    game;
    canvas;
    width;
    height;
    context;
    board;
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
        this.board = this.createBoard();

        document.body.addEventListener('click', (clickEvent) => {
            this.board.handleClick(clickEvent);
        });
    }

    createBoard() {
        let board = new Board(this.context, BoardConfig.MARGIN_LEFT, BoardConfig.MARGIN_TOP, BoardConfig.WIDTH, BoardConfig.HEIGHT);
        board.setColumnSelectionHandler((columnIndex) => this.playMove(columnIndex));
        board.render(this.game.currentBoard);
        return board;
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

        this.board.render(this.game.currentBoard);

        if (moveResult.status.value === Constants.MoveStatus.WIN || moveResult.status.value === Constants.MoveStatus.DRAW) {
            this.gameOver = true;
        }

        if (this.gameOver) {
            this.playAgainButton.render();
        }
    }
}
