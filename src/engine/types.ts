/**
 * @file Types used by the chess engine.
 */

/**
 * A square on the chess board. The squares are labeled from A1 to H8 and numbered from 0 to 63.
 * The first 8 squares are the first row, the next 8 squares are the second row, and so on.
 */
export enum Square {
    A1, B1, C1, D1, E1, F1, G1, H1,
    A2, B2, C2, D2, E2, F2, G2, H2,
    A3, B3, C3, D3, E3, F3, G3, H3,
    A4, B4, C4, D4, E4, F4, G4, H4,
    A5, B5, C5, D5, E5, F5, G5, H5,
    A6, B6, C6, D6, E6, F6, G6, H6,
    A7, B7, C7, D7, E7, F7, G7, H7,
    A8, B8, C8, D8, E8, F8, G8, H8
}

/**
 * A color of a chess piece or player.
 */
export enum Color {
    White,
    Black
}

/**
 * A chess piece. The pieces are ordered by color and type.
 * The first 6 pieces are white pieces, the last 6 pieces are black pieces.
 * The order of the pieces is: pawn, knight, bishop, rook, queen, king.
 */
export enum Piece {
    None,
    WhitePawn, WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen, WhiteKing,
    BlackPawn = 9, BlackKnight, BlackBishop, BlackRook, BlackQueen, BlackKing
}

export enum PieceType {
    None,
    Pawn, Knight, Bishop, Rook, Queen, King
}

/**
 * Constant values used by the chess engine.
 */
export enum Value {
    Zero = 0,
    Draw = 0,
    KnownWin = 10000,
    Mate = 32000,
    Infinity = 32001,
    Unknown = 32002,

    Pawn = 100,
    Knight = 320,
    Bishop = 330,
    Rook = 500,
    Queen = 900,
    King = 20000
}

/**
 * A direction on the chess board.
 * The directions are labeled from North to SouthWest and hold the value of the square offset.
 */
export enum Direction {
    North = 8, South = -8,
    East = 1, West = -1,
    NorthEast = 9, NorthWest = 7,
    SouthEast = -7, SouthWest = -9
}

export enum DirectionIndex {
    North, South,
    East, West,
    NorthEast, NorthWest,
    SouthEast, SouthWest
}

/**
 * A file on the chess board. The files are labeled from A to H.
 */
export enum File {
    A, B, C, D, E, F, G, H
}

/**
 * A rank on the chess board. The ranks are labeled from 1 to 8.
 */
export enum Rank {
    R1, R2, R3, R4, R5, R6, R7, R8
}

/**
 * A castling type.
 */
export enum Castling {
    None = 0,
    WhiteKingSide = 1,
    WhiteQueenSide = 2,
    BlackKingSide = 4,
    BlackQueenSide = 8,
    White = WhiteKingSide | WhiteQueenSide,
    Black = BlackKingSide | BlackQueenSide,
    KingSide = WhiteKingSide | BlackKingSide,
    QueenSide = WhiteQueenSide | BlackQueenSide,
    All = White | Black
}

/**
 * A move type ranging from 0 to 15.
 * The move types are used to determine the type of move.
 */
export enum MoveType {
    /**
     * The move is quiet, meaning it does not capture a piece.
     */
    Quiet,
    DoublePawnPush,
    KingSideCastle,
    QueenSideCastle,
    Capture,
    EnPassant,
    KnightPromotion= 8,
    BishopPromotion,
    RookPromotion,
    QueenPromotion,
    KnightPromotionCapture,
    BishopPromotionCapture,
    RookPromotionCapture,
    QueenPromotionCapture,
}

/**
 * Used to store the type of check.
 */
export enum CheckType {
    None,
    Check,
    Checkmate,
    Stalemate
}