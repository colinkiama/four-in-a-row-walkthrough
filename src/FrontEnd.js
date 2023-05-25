import { FrontEndConfig } from "./constants/index.js";

export default class FrontEnd {
    game;
    canvas;
    width;
    height;
    context;

    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById("canvas");
        this.canvas.style.background = FrontEndConfig.GAME_BACKGROUND_COLOR;
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = this.canvas.getContext("2d");

        this.enableHiDPISupport();
    }
    start() {
        this.context.fillStyle = "white";
        this.context.fillRect(20, 20, 50, 100); // fillRect(x, y, width, height);
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
}
