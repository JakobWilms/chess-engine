import {
    colorOf,
    directionIndexOf,
    fileOf,
    fromFenChar,
    pieceTypeOf,
    promotedPiece,
    rankOf,
    relativePiece,
    relativeRank,
    relativeSouth,
    relativeSquare,
    toFenChar
} from "../engine/convert";
import {Color, Direction, DirectionIndex, File, MoveType, Piece, PieceType, Rank, Square} from "../engine/types";

test('Color of white pieces is white', () => {
    expect(colorOf(Piece.WhitePawn)).toBe(Color.White);
    expect(colorOf(Piece.WhiteRook)).toBe(Color.White);
    expect(colorOf(Piece.WhiteKnight)).toBe(Color.White);
    expect(colorOf(Piece.WhiteBishop)).toBe(Color.White);
    expect(colorOf(Piece.WhiteQueen)).toBe(Color.White);
    expect(colorOf(Piece.WhiteKing)).toBe(Color.White);
});

test('Color of black pieces is black', () => {
    expect(colorOf(Piece.BlackPawn)).toBe(Color.Black);
    expect(colorOf(Piece.BlackRook)).toBe(Color.Black);
    expect(colorOf(Piece.BlackKnight)).toBe(Color.Black);
    expect(colorOf(Piece.BlackBishop)).toBe(Color.Black);
    expect(colorOf(Piece.BlackQueen)).toBe(Color.Black);
    expect(colorOf(Piece.BlackKing)).toBe(Color.Black);
});

test('Color of empty square is white', () => {
    expect(colorOf(Piece.None)).toBe(Color.White);
});

test('Fen characters of white pieces are correct', () => {
    expect(fromFenChar('P')).toBe(Piece.WhitePawn);
    expect(fromFenChar('N')).toBe(Piece.WhiteKnight);
    expect(fromFenChar('B')).toBe(Piece.WhiteBishop);
    expect(fromFenChar('R')).toBe(Piece.WhiteRook);
    expect(fromFenChar('Q')).toBe(Piece.WhiteQueen);
    expect(fromFenChar('K')).toBe(Piece.WhiteKing);
});

test('Fen characters of black pieces are correct', () => {
    expect(fromFenChar('p')).toBe(Piece.BlackPawn);
    expect(fromFenChar('n')).toBe(Piece.BlackKnight);
    expect(fromFenChar('b')).toBe(Piece.BlackBishop);
    expect(fromFenChar('r')).toBe(Piece.BlackRook);
    expect(fromFenChar('q')).toBe(Piece.BlackQueen);
    expect(fromFenChar('k')).toBe(Piece.BlackKing);
});

test('Other fen characters throw error', () => {
    expect(() => fromFenChar(' ')).toThrow();
    expect(() => fromFenChar('l')).toThrow();
});

test('Pieces of fen characters are correct', () => {
    expect(toFenChar(Piece.WhitePawn)).toBe('P');
    expect(toFenChar(Piece.WhiteKnight)).toBe('N');
    expect(toFenChar(Piece.WhiteBishop)).toBe('B');
    expect(toFenChar(Piece.WhiteRook)).toBe('R');
    expect(toFenChar(Piece.WhiteQueen)).toBe('Q');
    expect(toFenChar(Piece.WhiteKing)).toBe('K');
    expect(toFenChar(Piece.BlackPawn)).toBe('p');
    expect(toFenChar(Piece.BlackKnight)).toBe('n');
    expect(toFenChar(Piece.BlackBishop)).toBe('b');
    expect(toFenChar(Piece.BlackRook)).toBe('r');
    expect(toFenChar(Piece.BlackQueen)).toBe('q');
    expect(toFenChar(Piece.BlackKing)).toBe('k');
});

test('Empty square throws error', () => {
    expect(() => toFenChar(Piece.None)).toThrow();
});

test('Rank of square is correct', () => {
    expect(rankOf(Square.A1)).toBe(Rank.R1);
    expect(rankOf(Square.E3)).toBe(Rank.R3);
    expect(rankOf(Square.G6)).toBe(Rank.R6);
});

test('File of square is correct', () => {
    expect(fileOf(Square.A1)).toBe(File.A);
    expect(fileOf(Square.E3)).toBe(File.E);
    expect(fileOf(Square.G6)).toBe(File.G);
});

test('relative rank of white is correct', () => {
    expect(relativeRank(Rank.R1, Color.White)).toBe(Rank.R1);
    expect(relativeRank(Rank.R4, Color.White)).toBe(Rank.R4);
    expect(relativeRank(Rank.R7, Color.White)).toBe(Rank.R7);
});

test('relative rank of black is correct', () => {
    expect(relativeRank(Rank.R1, Color.Black)).toBe(Rank.R8);
    expect(relativeRank(Rank.R4, Color.Black)).toBe(Rank.R5);
    expect(relativeRank(Rank.R7, Color.Black)).toBe(Rank.R2);
});

test('relative square of white is correct', () => {
    expect(relativeSquare(Square.A1, Color.White)).toBe(Square.A1);
    expect(relativeSquare(Square.E3, Color.White)).toBe(Square.E3);
    expect(relativeSquare(Square.G6, Color.White)).toBe(Square.G6);
});

test('relative square of black is correct', () => {
    expect(relativeSquare(Square.A1, Color.Black)).toBe(Square.A8);
    expect(relativeSquare(Square.E3, Color.Black)).toBe(Square.E6);
    expect(relativeSquare(Square.G6, Color.Black)).toBe(Square.G3);
});

test('relative south of white is correct', () => {
    expect(relativeSouth(Color.White)).toBe(Direction.South);
});

test('relative south of black is correct', () => {
    expect(relativeSouth(Color.Black)).toBe(Direction.North);
});

test('relative piece of white is correct', () => {
   expect(relativePiece(Piece.WhitePawn, Color.White)).toBe(Piece.WhitePawn);
   expect(relativePiece(Piece.WhiteRook, Color.White)).toBe(Piece.WhiteRook);
   expect(relativePiece(Piece.WhiteQueen, Color.White)).toBe(Piece.WhiteQueen);
});

test('relative piece of black is correct', () => {
   expect(relativePiece(Piece.WhitePawn, Color.Black)).toBe(Piece.BlackPawn);
   expect(relativePiece(Piece.WhiteRook, Color.Black)).toBe(Piece.BlackRook);
   expect(relativePiece(Piece.WhiteQueen, Color.Black)).toBe(Piece.BlackQueen);
});

test('promoted piece is correct', () => {
    expect(promotedPiece(MoveType.KnightPromotion, Color.White)).toBe(Piece.WhiteKnight);
    expect(promotedPiece(MoveType.BishopPromotion, Color.White)).toBe(Piece.WhiteBishop);
    expect(promotedPiece(MoveType.RookPromotion, Color.White)).toBe(Piece.WhiteRook);
    expect(promotedPiece(MoveType.QueenPromotion, Color.White)).toBe(Piece.WhiteQueen);
    expect(promotedPiece(MoveType.KnightPromotion, Color.Black)).toBe(Piece.BlackKnight);
    expect(promotedPiece(MoveType.BishopPromotion, Color.Black)).toBe(Piece.BlackBishop);
    expect(promotedPiece(MoveType.RookPromotion, Color.Black)).toBe(Piece.BlackRook);
    expect(promotedPiece(MoveType.QueenPromotion, Color.Black)).toBe(Piece.BlackQueen);
});

test('promoted piece throws error', () => {
    expect(() => promotedPiece(MoveType.Quiet, Color.White)).toThrow();
});

test('piece type is correct', () => {
    expect(pieceTypeOf(Piece.WhitePawn)).toBe(PieceType.Pawn);
    expect(pieceTypeOf(Piece.WhiteBishop)).toBe(PieceType.Bishop);
    expect(pieceTypeOf(Piece.WhiteQueen)).toBe(PieceType.Queen);
    expect(pieceTypeOf(Piece.BlackKnight)).toBe(PieceType.Knight);
    expect(pieceTypeOf(Piece.BlackRook)).toBe(PieceType.Rook);
    expect(pieceTypeOf(Piece.BlackKing)).toBe(PieceType.King);
});

test('direction index is correct', () => {
    expect(directionIndexOf(Direction.North)).toBe(DirectionIndex.North);
    expect(directionIndexOf(Direction.NorthEast)).toBe(DirectionIndex.NorthEast);
    expect(directionIndexOf(Direction.East)).toBe(DirectionIndex.East);
    expect(directionIndexOf(Direction.SouthEast)).toBe(DirectionIndex.SouthEast);
    expect(directionIndexOf(Direction.South)).toBe(DirectionIndex.South);
    expect(directionIndexOf(Direction.SouthWest)).toBe(DirectionIndex.SouthWest);
    expect(directionIndexOf(Direction.West)).toBe(DirectionIndex.West);
    expect(directionIndexOf(Direction.NorthWest)).toBe(DirectionIndex.NorthWest);
});

test('direction index throws error', () => {
   expect(() => directionIndexOf(Direction.North + Direction.North)).toThrow();
});

export {};