import {CBoard} from "../engine/CBoard";
import {CMove} from "../engine/CMove";
import {CheckType, MoveType, Piece, Square} from "../engine/types";

let board: CBoard;
let move: CMove;

beforeAll(() => {
    board = new CBoard();
    move = new CMove();
});

test('quiet move make and unmake returns correct board', () => {
    // White
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    move.setAll(Square.E2, Square.E3, Piece.WhitePawn, Piece.None, MoveType.Quiet, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    // Black
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    move.setAll(Square.E7, Square.E6, Piece.BlackPawn, Piece.None, MoveType.Quiet, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppp1ppp/4p3/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
});

test('double pawn push make and unmake returns correct board', () => {
    // White
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    move.setAll(Square.E2, Square.E4, Piece.WhitePawn, Piece.None, MoveType.DoublePawnPush, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    // Black
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    move.setAll(Square.E7, Square.E5, Piece.BlackPawn, Piece.None, MoveType.DoublePawnPush, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPPPPPP/RNBQKBNR w KQkq e6 0 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
});

test('capture make and unmake returns correct board', () => {
    // White
    board.importFen('rnbqkbnr/pppppppp/8/3p4/4P3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2');
    move.setAll(Square.E4, Square.D5, Piece.WhitePawn, Piece.BlackPawn, MoveType.Capture, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/3P4/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/3p4/4P3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2');

    // Black
    board.importFen('rnbqkbnr/pppppppp/8/3p4/4P3/8/PPPPPPPP/RNBQKBNR b KQkq - 0 2');
    move.setAll(Square.D5, Square.E4, Piece.BlackPawn, Piece.WhitePawn, MoveType.Capture, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/4p3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 3');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/3p4/4P3/8/PPPPPPPP/RNBQKBNR b KQkq - 0 2');
});

test('en passant make and unmake returns correct board', () => {
    // White
    board.importFen('rnbqkbnr/pppppppp/8/4pP2/8/8/PPPPPPPP/RNBQKBNR w KQkq e6 0 3');
    move.setAll(Square.F5, Square.E6, Piece.WhitePawn, Piece.BlackPawn, MoveType.EnPassant, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/4P3/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 3');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/4pP2/8/8/PPPPPPPP/RNBQKBNR w KQkq e6 0 3');

    // Black
    board.importFen('rnbqkbnr/pppppppp/8/8/4Pp2/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 3');
    move.setAll(Square.F4, Square.E3, Piece.BlackPawn, Piece.WhitePawn, MoveType.EnPassant, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/4p3/PPPPPPPP/RNBQKBNR w KQkq - 0 4');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/4Pp2/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 3');
});

test('kingside castle make and unmake returns correct board', () => {
    // White
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1');
    move.setAll(Square.E1, Square.G1, Piece.WhiteKing, Piece.None, MoveType.KingSideCastle, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1RK1 b kq - 1 1');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1');

    // Black
    board.importFen('rnbqk2r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    move.setAll(Square.E8, Square.G8, Piece.BlackKing, Piece.None, MoveType.KingSideCastle, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbq1rk1/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 1 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqk2r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
});

test('queenside castle make and unmake returns correct board', () => {
    // White
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3KBNR w KQkq - 0 1');
    move.setAll(Square.E1, Square.C1, Piece.WhiteKing, Piece.None, MoveType.QueenSideCastle, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/2KR1BNR b kq - 1 1');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3KBNR w KQkq - 0 1');

    // Black
    board.importFen('r3kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    move.setAll(Square.E8, Square.C8, Piece.BlackKing, Piece.None, MoveType.QueenSideCastle, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('2kr1bnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 1 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('r3kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
});

test('promotion make and unmake returns correct board', () => {
    // White
    board.importFen('1nbqkbnr/Pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    move.setAll(Square.A7, Square.A8, Piece.WhitePawn, Piece.None, MoveType.RookPromotion, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('Rnbqkbnr/1ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQk - 0 1');
    move.unmake(board);
    expect(board.exportFen()).toBe('1nbqkbnr/Pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    board.importFen('rnbqkbn1/pppppppP/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    move.setAll(Square.H7, Square.H8, Piece.WhitePawn, Piece.None, MoveType.BishopPromotion, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnB/ppppppp1/8/8/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbn1/pppppppP/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    // Black
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/pPPPPPPP/1NBQKBNR b KQkq - 0 1');
    move.setAll(Square.A2, Square.A1, Piece.BlackPawn, Piece.None, MoveType.RookPromotion, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/1PPPPPPP/rNBQKBNR w Kkq - 0 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/pPPPPPPP/1NBQKBNR b KQkq - 0 1');

    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPp/RNBQKBN1 b KQkq - 0 1');
    move.setAll(Square.H2, Square.H1, Piece.BlackPawn, Piece.None, MoveType.KnightPromotion, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPP1/RNBQKBNn w Qkq - 0 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPp/RNBQKBN1 b KQkq - 0 1');
});

test('promotion capture make and unmake returns correct board', () => {
    // White
    board.importFen('rnbqkbnr/pPpppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    move.setAll(Square.B7, Square.A8, Piece.WhitePawn, Piece.BlackRook, MoveType.QueenPromotionCapture, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('Qnbqkbnr/p1pppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQk - 0 1');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pPpppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    // Black
    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PpPPPPPP/RNBQKBNR b KQkq - 0 1');
    move.setAll(Square.B2, Square.A1, Piece.BlackPawn, Piece.WhiteRook, MoveType.QueenPromotionCapture, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/P1PPPPPP/qNBQKBNR w Kkq - 0 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PpPPPPPP/RNBQKBNR b KQkq - 0 1');

    board.importFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPpP/RNBQKBNR b KQkq - 0 1');
    move.setAll(Square.G2, Square.H1, Piece.BlackPawn, Piece.WhiteRook, MoveType.KnightPromotionCapture, CheckType.None);
    move.make(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPP1P/RNBQKBNn w Qkq - 0 2');
    move.unmake(board);
    expect(board.exportFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPpP/RNBQKBNR b KQkq - 0 1');
});