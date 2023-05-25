import { FourInARowGame } from "./gameLogic/index.js";
import FrontEnd from "./FrontEnd.js";

let frontEnd = new FrontEnd(new FourInARowGame());
frontEnd.start();
