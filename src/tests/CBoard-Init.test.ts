import {CBoard} from "../engine/CBoard";
import {Color, Square} from "../engine/types";

let board: CBoard;

beforeAll(() => {
    board = new CBoard();
});

test('All the bitboards are initialized to zero', () => {
    for (let i = 0; i < 15; i++) {
        expect(board.pieceBB[i]).toBe(0n);
    }
    for (let i = 0; i < 2; i++) {
        expect(board.colorBB[i]).toBe(0n);
    }
});

test('Side to move is white', () => {
    expect(board.sideToMove).toBe(Color.White);
});

test('Castling rights are all true', () => {
    for (let i = 0; i < 4; i++) {
        expect(board.castlingRights & (1 << i)).toBeTruthy();
    }
});

test('En passant target square is A1', () => {
    expect(board.enPassantTargetSquare).toBe(Square.A1);
});

test('Half move clock is zero', () => {
   expect(board.halfMoveClock).toBe(0);
});

test('Full move counter is one', () => {
    expect(board.fullMoveCounter).toBe(1);
});

export {};