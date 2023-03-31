import {CBoard} from "../engine/CBoard";
import {Color, Piece, Square} from "../engine/types";

let board: CBoard;

beforeAll(() => {
    board = new CBoard();
});

test('get piece returns set piece', () => {
    const piece = Piece.WhiteKing;
    const square = Square.E5;
    board.setPiece(square, piece);
    expect(board.getPiece(square)).toBe(piece);
});

test('get piece returns none after remove piece', () => {
    const piece = Piece.WhiteKing;
    const square = Square.E5;
    board.setPiece(square, piece);
    board.removePiece(square);
    expect(board.getPiece(square)).toBe(Piece.None);
});

test('get piece returns none after set piece to none', () => {
    const piece = Piece.WhiteKing;
    const square = Square.E5;
    board.setPiece(square, piece);
    board.setPiece(square, Piece.None);
    expect(board.getPiece(square)).toBe(Piece.None);
});

test('get color returns set color', () => {
    const piece = Piece.WhiteKing;
    const square = Square.E5;
    board.setPiece(square, piece);
    expect(board.getColor(square)).toBe(Color.White);
});

test('get color RETURNS WHITE after remove piece', () => {
    const piece = Piece.WhiteKing;
    const square = Square.E5;
    board.setPiece(square, piece);
    board.removePiece(square);
    expect(board.getColor(square)).toBe(Color.White);
});

test('is attacked returns false on empty board', () => {
    const piece = Piece.WhiteKing;
    const square = Square.E5;
    board.setPiece(square, piece);
    expect(board.isAttacked(square, Color.Black)).toBeFalsy();
});

test('is attacked returns false on starting position', () => {
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(board.isAttacked(Square.E1, Color.Black)).toBeFalsy();
    expect(board.isAttacked(Square.E8, Color.White)).toBeFalsy();
});

test('is attacked by queen', () => {
    board.importFen('rnbqkbnr/pppppppp/8/8/8/4q3/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
    expect(board.isAttacked(Square.E1, Color.Black)).toBeTruthy();
});