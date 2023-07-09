import GameObject from "./GameObject.js";
import { PlayAgainButtonConfig } from "../constants/index.js";

export default class PlayAgainButton extends GameObject {
    buttonClicked;
    isEnabled;

    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.isEnabled = false;
    }

    render() {
        this.context.save();
        this.renderBackground();
        this.context.restore();

        this.context.save();
        this.renderText();
        this.context.restore();

        this.isEnabled = true;
    }

    renderBackground() {
        const backgroundGradient = this.context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        backgroundGradient.addColorStop(0, PlayAgainButtonConfig.BACKGROUND_START_COLOR);
        backgroundGradient.addColorStop(1, PlayAgainButtonConfig.BACKGROUND_END_COLOR);

        this.context.fillStyle = backgroundGradient;
        this.context.strokeStyle = `${PlayAgainButtonConfig.BORDER_WIDTH}px black`;
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.strokeRect(this.x, this.y, this.width, this.height);
    }

    renderText() {
        this.context.fillStyle = "white";
        this.context.font = "16px Arial";
        this.context.textAlign = "center";
        this.context.textBaseline = "top";

        const textMetrics = this.context.measureText(PlayAgainButtonConfig.TEXT);
        const textHeight = textMetrics.actualBoundingBoxDescent;

        // Calculation ensures that text is displayed at the vertical center of the button
        const finalTextY = this.y + (this.height / 2) - textHeight / 2;

        this.context.fillText(PlayAgainButtonConfig.TEXT, this.x + PlayAgainButtonConfig.WIDTH / 2, finalTextY);
    }

    clear() {
        const clearRectX = this.x - PlayAgainButtonConfig.BORDER_WIDTH;
        const clearRectY = this.y - PlayAgainButtonConfig.BORDER_WIDTH;
        const clearRectWidth = this.width + PlayAgainButtonConfig.BORDER_WIDTH * 2;
        const clearRectHeight = this.height + PlayAgainButtonConfig.BORDER_WIDTH * 2;

        this.context.clearRect(clearRectX, clearRectY, clearRectWidth, clearRectHeight);
    }

    setClickHandler(handler) {
        this.buttonClicked = handler;
    }

    handleClick(clickEvent) {
        if (!this.isEnabled) {
            return;
        }

        const wasButtonClicked = clickEvent.offsetX >= this.x
            && clickEvent.offsetX <= this.x + this.width
            && clickEvent.offsetY >= this.y
            && clickEvent.offsetY <= this.y + this.height;

        if (!wasButtonClicked) {
            return;
        }

        this.buttonClicked();
    }

    hide() {
        this.isEnabled = false;
        this.clear();
    }
}