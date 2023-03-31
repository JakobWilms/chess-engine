import {CBoard} from "../engine/CBoard";
import {Color, Piece, Square} from "../engine/types";

let board: CBoard;

beforeAll(() => {
    board = new CBoard();
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
});

test('White Rook on A1 and H1', () => {
    expect(board.pieceBB[Piece.WhiteRook]).toBe(0x81n);
    expect(board.getPiece(Square.A1)).toBe(Piece.WhiteRook);
    expect(board.getPiece(Square.H1)).toBe(Piece.WhiteRook);
});

test('Black Rook on A8 and H8', () => {
    expect(board.pieceBB[Piece.BlackRook]).toBe(0x8100000000000000n);
    expect(board.getPiece(Square.A8)).toBe(Piece.BlackRook);
    expect(board.getPiece(Square.H8)).toBe(Piece.BlackRook);
});

test('White Knight on B1 and G1', () => {
    expect(board.pieceBB[Piece.WhiteKnight]).toBe(0x42n);
    expect(board.getPiece(Square.B1)).toBe(Piece.WhiteKnight);
    expect(board.getPiece(Square.G1)).toBe(Piece.WhiteKnight);
});

test('Black Knight on B8 and G8', () => {
    expect(board.pieceBB[Piece.BlackKnight]).toBe(0x4200000000000000n);
    expect(board.getPiece(Square.B8)).toBe(Piece.BlackKnight);
    expect(board.getPiece(Square.G8)).toBe(Piece.BlackKnight);
});

test('White Bishop on C1 and F1', () => {
    expect(board.pieceBB[Piece.WhiteBishop]).toBe(0x24n);
    expect(board.getPiece(Square.C1)).toBe(Piece.WhiteBishop);
    expect(board.getPiece(Square.F1)).toBe(Piece.WhiteBishop);
});

test('Black Bishop on C8 and F8', () => {
    expect(board.pieceBB[Piece.BlackBishop]).toBe(0x2400000000000000n);
    expect(board.getPiece(Square.C8)).toBe(Piece.BlackBishop);
    expect(board.getPiece(Square.F8)).toBe(Piece.BlackBishop);
});

test('White Queen on D1', () => {
    expect(board.pieceBB[Piece.WhiteQueen]).toBe(0x8n);
    expect(board.getPiece(Square.D1)).toBe(Piece.WhiteQueen);
});

test('Black Queen on D8', () => {
    expect(board.pieceBB[Piece.BlackQueen]).toBe(0x800000000000000n);
    expect(board.getPiece(Square.D8)).toBe(Piece.BlackQueen);
});

test('White King on E1', () => {
    expect(board.pieceBB[Piece.WhiteKing]).toBe(0x10n);
    expect(board.getPiece(Square.E1)).toBe(Piece.WhiteKing);
});

test('Black King on E8', () => {
    expect(board.pieceBB[Piece.BlackKing]).toBe(0x1000000000000000n);
    expect(board.getPiece(Square.E8)).toBe(Piece.BlackKing);
});

test('White Pawns on A2 to H2', () => {
    expect(board.pieceBB[Piece.WhitePawn]).toBe(0xff00n);
    expect(board.getPiece(Square.A2)).toBe(Piece.WhitePawn);
    expect(board.getPiece(Square.B2)).toBe(Piece.WhitePawn);
    expect(board.getPiece(Square.C2)).toBe(Piece.WhitePawn);
    expect(board.getPiece(Square.D2)).toBe(Piece.WhitePawn);
    expect(board.getPiece(Square.E2)).toBe(Piece.WhitePawn);
    expect(board.getPiece(Square.F2)).toBe(Piece.WhitePawn);
    expect(board.getPiece(Square.G2)).toBe(Piece.WhitePawn);
    expect(board.getPiece(Square.H2)).toBe(Piece.WhitePawn);
});

test('Black Pawns on A7 to H7', () => {
    expect(board.pieceBB[Piece.BlackPawn]).toBe(0xff000000000000n);
    expect(board.getPiece(Square.A7)).toBe(Piece.BlackPawn);
    expect(board.getPiece(Square.B7)).toBe(Piece.BlackPawn);
    expect(board.getPiece(Square.C7)).toBe(Piece.BlackPawn);
    expect(board.getPiece(Square.D7)).toBe(Piece.BlackPawn);
    expect(board.getPiece(Square.E7)).toBe(Piece.BlackPawn);
    expect(board.getPiece(Square.F7)).toBe(Piece.BlackPawn);
    expect(board.getPiece(Square.G7)).toBe(Piece.BlackPawn);
    expect(board.getPiece(Square.H7)).toBe(Piece.BlackPawn);
});

test('En passant square is A1', () => {
    expect(board.enPassantTargetSquare).toBe(Square.A1);
});

test('Castling rights are correct', () => {
    expect(board.castlingRights).toBe(0b1111);
});

test('Half move clock is 0', () => {
    expect(board.halfMoveClock).toBe(0);
});

test('Full move counter is 1', () => {
    expect(board.fullMoveCounter).toBe(1);
});

test('White to move', () => {
    expect(board.sideToMove).toBe(Color.White);
});

test('White pieces', () => {
    expect(board.colorBB[Color.White]).toBe(0xffffn);
});

test('Black pieces', () => {
    expect(board.colorBB[Color.Black]).toBe(0xffff000000000000n);
});

test('Black to move, en passant target squaRe', () => {
   board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 1');
    expect(board.sideToMove).toBe(Color.Black);
    expect(board.enPassantTargetSquare).toBe(Square.E3);
});