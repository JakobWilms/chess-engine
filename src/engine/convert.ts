import {Color, Direction, DirectionIndex, File, MoveType, Piece, PieceType, Rank, Square} from "./types";

/**
 * Gets the color of the given piece.
 * THE COLOR OF EMPTY SQUARES IS WHITE.
 * @param piece - The piece to get the color of.
 * @returns The color of the piece.
 */
export function colorOf(piece: Piece): Color {
    return (piece & 0b1000) >> 3;
}

/**
 * The FEN characters for each piece.
 */
const fenChars = ' PNBRQK  pnbrqk';

/**
 * Converts a FEN character to a piece.
 * @param fenChar - The FEN character to convert.
 * @returns The piece the FEN character represents.
 * @throws {Error} If the FEN character is invalid.
 */
export function fromFenChar(fenChar: string): Piece {
    const index = fenChars.indexOf(fenChar);
    if (index === -1 || index === 0) {
        throw new Error('Invalid FEN character: ' + fenChar);
    } else {
        return index;
    }
}

/**
 * Converts a piece to a FEN character.
 * @param piece - The piece to convert.
 * @returns The FEN character the piece represents.
 * @throws {Error} If the piece is empty.
 */
export function toFenChar(piece: Piece): string {
    if (piece === Piece.None) {
        throw new Error('Cannot convert empty square to FEN character.');
    } else {
        return fenChars[piece];
    }
}

/**
 * Gets the rank of the given square.
 * @param square - The square to get the rank of.
 * @returns The rank of the square.
 */
export function rankOf(square: Square): Rank {
    return Math.floor(square / 8);
}

/**
 * Gets the file of the given square.
 * @param square - The square to get the file of.
 * @returns The file of the square.
 */
export function fileOf(square: Square): File {
    return square % 8;
}

/**
 * Mirrors the given rank if the color is black.
 * @param rank - The rank to mirror.
 * @param color - The color to mirror for.
 * @returns The mirrored rank.
 */
export function relativeRank(rank: Rank, color: Color): Rank {
    return color === Color.White ? rank : 7 - rank;
}

/**
 * Mirror the given square, if the color is black.
 * @param square - The square to mirror.
 * @param color - The color to mirror for.
 * @returns The mirrored square.
 */
export function relativeSquare(square: Square, color: Color): Square {
    return color === Color.White ? square : relativeRank(rankOf(square), color) * 8 + fileOf(square);
}

/**
 * Gets the relative south direction for the given color.
 * @param color - The color to get the relative south direction for.
 * @returns The relative south direction.
 */
export function relativeSouth(color: Color): Direction {
    return color === Color.White ? Direction.South : Direction.North;
}

export function relativePiece(piece: Piece, color: Color): Piece {
    return color === Color.White ? piece : piece + 8;
}

/**
 * Gets the piece to which is promoted for the given move type and color.
 * @param moveType - The move type to get the promoted piece for.
 * @param color - The color to get the promoted piece for.
 * @returns The promoted piece.
 * @throws {Error} If the move type is not a promotion.
 */
export function promotedPiece(moveType: MoveType, color: Color): Piece {
    switch (moveType) {
        case MoveType.QueenPromotion:
        case MoveType.QueenPromotionCapture:
            return color === Color.White ? Piece.WhiteQueen : Piece.BlackQueen;
        case MoveType.RookPromotion:
        case MoveType.RookPromotionCapture:
            return color === Color.White ? Piece.WhiteRook : Piece.BlackRook;
        case MoveType.BishopPromotion:
        case MoveType.BishopPromotionCapture:
            return color === Color.White ? Piece.WhiteBishop : Piece.BlackBishop;
        case MoveType.KnightPromotion:
        case MoveType.KnightPromotionCapture:
            return color === Color.White ? Piece.WhiteKnight : Piece.BlackKnight;
        default:
            throw new Error('Invalid move type: ' + moveType);
    }
}

/**
 * Gets the piece type of the given piece.
 * @param piece - The piece to get the piece type of.
 * @returns The piece type of the piece.
 */
export function pieceTypeOf(piece: Piece): PieceType {
    return piece & 7;
}

/**
 * Gets the index of the given direction.
 * @param direction - The direction to get the index of.
 * @returns The index of the direction.
 */
export function directionIndexOf(direction: Direction): number {
    switch (direction) {
        case Direction.North:
            return DirectionIndex.North;
        case Direction.NorthEast:
            return DirectionIndex.NorthEast;
        case Direction.East:
            return DirectionIndex.East;
        case Direction.SouthEast:
            return DirectionIndex.SouthEast;
        case Direction.South:
            return DirectionIndex.South;
        case Direction.SouthWest:
            return DirectionIndex.SouthWest;
        case Direction.West:
            return DirectionIndex.West;
        case Direction.NorthWest:
            return DirectionIndex.NorthWest;
        default:
            throw new Error('Invalid direction: ' + direction);
    }
}