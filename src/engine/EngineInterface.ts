import {CBoard} from "./CBoard";

export class EngineInterface {
    private board: CBoard;

    constructor() {
        this.board = new CBoard();
    }
}