import {CBoard} from "../engine/CBoard";

let board: CBoard;

beforeAll(() => {
    board = new CBoard();
});

test('Exported fen equals imported fen', () => {
    let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    board.importFen(fen);
    expect(board.exportFen()).toBe(fen);

    fen = 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R b - e3 0 1';
    board.importFen(fen);
    expect(board.exportFen()).toBe(fen);
});