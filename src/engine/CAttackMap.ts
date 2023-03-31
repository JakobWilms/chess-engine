import {bitScanForward, bitScanReverse} from "./CBitboard";
import {Color, DirectionIndex, Square} from "./types";
import {kingAttacks, knightAttacks, pawnAttacks, rayAttacks} from "./CEmptyBoardAttacks";

/**
 * Gets all the squares attacked by a pawn on the given square considering the given color.
 * @param square - The square the pawn is on.
 * @param color - The color of the pawn.
 * @returns A bitboard with all the squares attacked by the pawn.
 */
export function getPawnAttacks(square: Square, color: Color): bigint {
    return pawnAttacks[color][square];
}

/**
 * Gets all the squares attacked by a knight on the given square.
 * @param square - The square the knight is on.
 * @returns A bitboard with all the squares attacked by the knight.
 */
export function getKnightAttacks(square: Square): bigint {
    return knightAttacks[square];
}

/**
 * Gets all the squares attacked by a king on the given square.
 * @param square - The square the king is on.
 * @returns A bitboard with all the squares attacked by the king.
 */
export function getKingAttacks(square: Square): bigint {
    return kingAttacks[square];
}

/**
 * Gets all the squares attacked by a queen on the given square considering the given occupied squares.
 * @param square - The square the queen is on.
 * @param occupied - The squares occupied by pieces.
 * @returns A bitboard with all the squares attacked by the queen.
 */
export function getQueenAttacks(square: Square, occupied: bigint): bigint {
    return getRookAttacks(square, occupied) | getBishopAttacks(square, occupied);
}

/**
 * Gets all the squares attacked by a bishop on the given square considering the given occupied squares.
 * @param square - The square the bishop is on.
 * @param occupied - The squares occupied by pieces.
 * @returns A bitboard with all the squares attacked by the bishop.
 */
export function getBishopAttacks(square: Square, occupied: bigint): bigint {
    return getDiagonalAttacks(square, occupied) | getAntiDiagonalAttacks(square, occupied);
}

/**
 * Gets all the squares attacked by a rook on the given square considering the given occupied squares.
 * @param square - The square the rook is on.
 * @param occupied - The squares occupied by pieces.
 * @returns A bitboard with all the squares attacked by the rook.
 */
export function getRookAttacks(square: Square, occupied: bigint): bigint {
    return getRankAttacks(square, occupied) | getFileAttacks(square, occupied);
}

/**
 * Gets all the squares on the same rank as the given square which are attacked by a rook considering the given occupied squares.
 * @param square - The square the rook is on.
 * @param occupied - The squares occupied by pieces.
 * @returns A bitboard with all the squares attacked by the rook.
 */
export function getRankAttacks(square: Square, occupied: bigint): bigint {
    return getPositiveRayAttacks(square, occupied, DirectionIndex.East)
        | getNegativeRayAttacks(square, occupied, DirectionIndex.West);
}

/**
 * Gets all the squares on the same file as the given square which are attacked by a rook considering the given occupied squares.
 * @param square - The square the rook is on.
 * @param occupied - The squares occupied by pieces.
 * @returns A bitboard with all the squares attacked by the rook.
 */
export function getFileAttacks(square: Square, occupied: bigint): bigint {
    return getPositiveRayAttacks(square, occupied, DirectionIndex.North)
        | getNegativeRayAttacks(square, occupied, DirectionIndex.South);
}

/**
 * Gets all the squares on the same anti-diagonal as the given square which are attacked by a bishop considering the given occupied squares.
 * @param square - The square the bishop is on.
 * @param occupied - The squares occupied by pieces.
 * @returns A bitboard with all the squares attacked by the bishop.
 */
export function getAntiDiagonalAttacks(square: Square, occupied: bigint): bigint {
    return getPositiveRayAttacks(square, occupied, DirectionIndex.NorthWest)
        | getNegativeRayAttacks(square, occupied, DirectionIndex.SouthEast);
}

/**
 * Gets all the squares on the same diagonal as the given square which are attacked by a bishop considering the given occupied squares.
 * @param square - The square the bishop is on.
 * @param occupied - The squares occupied by pieces.
 * @returns A bitboard with all the squares attacked by the bishop.
 */
export function getDiagonalAttacks(square: Square, occupied: bigint): bigint {
    return getPositiveRayAttacks(square, occupied, DirectionIndex.NorthEast)
        | getNegativeRayAttacks(square, occupied, DirectionIndex.SouthWest);
}

/**
 * Gets all the squares attacked by a ray in the given direction from the given square considering the given occupied squares.
 * @param square - The square the ray starts from.
 * @param occupied - The squares occupied by pieces.
 * @param direction - The direction of the ray.
 * @returns A bitboard with all the squares attacked by the ray.
 */
export function getPositiveRayAttacks(square: Square, occupied: bigint, direction: DirectionIndex): bigint {
    let attacks = rayAttacks[direction][square];
    const blockers = attacks & occupied;
    if (blockers) {
        square = bitScanForward(blockers);
        attacks ^= rayAttacks[direction][square];
    }
    return attacks;
}

/**
 * Gets all the squares attacked by a ray in the given direction from the given square considering the given occupied squares.
 * @param square - The square the ray starts from.
 * @param occupied - The squares occupied by pieces.
 * @param direction - The direction of the ray.
 * @returns A bitboard with all the squares attacked by the ray.
 */
export function getNegativeRayAttacks(square: Square, occupied: bigint, direction: DirectionIndex): bigint {
    let attacks = rayAttacks[direction][square];
    const blockers = attacks & occupied;
    if (blockers) {
        square = bitScanReverse(blockers);
        attacks ^= rayAttacks[direction][square];
    }
    return attacks;
}