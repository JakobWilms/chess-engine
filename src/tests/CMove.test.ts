import {CMove} from "../engine/CMove";
import {CheckType, MoveType, Piece, Square} from "../engine/types";

let move: CMove;

beforeAll(() => {
    move = new CMove();
    move.setAll(Square.E2, Square.E4, Piece.WhitePawn, Piece.None, MoveType.DoublePawnPush, CheckType.None);
});

test('get from returns set from', () => {
    expect(move.getFrom()).toBe(Square.E2);
});

test('get to returns set to', () => {
    expect(move.getTo()).toBe(Square.E4);
});

test('get from piece returns set from piece', () => {
    expect(move.getFromPiece()).toBe(Piece.WhitePawn);
});

test('get to piece returns set to piece', () => {
    expect(move.getToPiece()).toBe(Piece.None);
});

test('get type returns set type', () => {
    expect(move.getType()).toBe(MoveType.DoublePawnPush);
});

test('get check returns set check', () => {
    expect(move.getCheck()).toBe(CheckType.None);
});

test('get half move clock returns set half move clock', () => {
   move.setHalfMoveClock(5);
    expect(move.getHalfMoveClock()).toBe(5);
});

test('get en passant square returns set en passant square', () => {
    move.setEnPassantSquare(Square.E3);
    expect(move.getEnPassantSquare()).toBe(Square.E3);
});

test('get castling rights returns set castling rights', () => {
   move.setCastlingRights(0b1010);
    expect(move.getCastlingRights()).toBe(0b1010);
});