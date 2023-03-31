import {Direction, DirectionIndex, Square} from "./types";

export const aFile = 0x0101010101010101n;
export const hFile = 0x8080808080808080n;
export const rank1 = 0x00000000000000FFn;
export const rank8 = 0xFF00000000000000n;
export const diagonal = 0x8040201008040201n;
export const antiDiagonal = 0x0102040810204080n;

export const ONE = 1n;
const debruijn64 = 0x03f79d71b4cb0a89n;
const unsignedArray = new BigUint64Array(1);
const index64 = [
    0, 47, 1, 56, 48, 27, 2, 60,
    57, 49, 41, 37, 28, 16, 3, 61,
    54, 58, 35, 52, 50, 42, 21, 44,
    38, 32, 29, 23, 17, 11, 4, 62,
    46, 55, 26, 59, 40, 36, 15, 53,
    34, 51, 20, 43, 31, 22, 10, 45,
    25, 39, 14, 33, 19, 30, 9, 24,
    13, 18, 8, 12, 7, 6, 5, 63
];

const popCountOf16Bit = new Uint16Array(65536);

popCountOf16Bit[0] = 0;
for (let i = 1; i < 65536; i++) {
    popCountOf16Bit[i] = popCountOf16Bit[i >> 1] + (i & 1);
}

/**
 * Returns the number of bits set in the given bitboard.
 * @param bitboard - The bitboard to count.
 * @return The number of bits set.
 */
export function popCount(bitboard: bigint): number {
    return popCountOf16Bit[Number(bitboard & 0xffffn)] +
        popCountOf16Bit[Number((bitboard >> 16n) & 0xffffn)] +
        popCountOf16Bit[Number((bitboard >> 32n) & 0xffffn)] +
        popCountOf16Bit[Number((bitboard >> 48n) & 0xffffn)];
}

/**
 * Returns a bitboard with a single bit set at the given square.
 * @param square - The square to set.
 * @return The bitboard with the bit set.
 */
export function squareBitboard(square: Square): bigint {
    return ONE << BigInt(square);
}

/**
 * Returns the index of the most significant bit set in the given bitboard.
 * @param bitboard - The bitboard to scan.
 * @return The index of the most significant bit set.
 */
export function bitScanReverse(bitboard: bigint): Square {
    bitboard |= bitboard >> 1n;
    bitboard |= bitboard >> 2n;
    bitboard |= bitboard >> 4n;
    bitboard |= bitboard >> 8n;
    bitboard |= bitboard >> 16n;
    bitboard |= bitboard >> 32n;
    unsignedArray[0] = bitboard;
    unsignedArray[0] *= debruijn64;
    return index64[Number(unsignedArray[0] >> 58n)];
}

/**
 * Returns the index of the least significant bit set in the given bitboard.
 * @param bitboard - The bitboard to scan.
 * @return The index of the least significant bit set.
 */
export function bitScanForward(bitboard: bigint): Square {
    let result = 0;

    if ((bitboard & 0xFFFFFFFFn) === 0n) {
        bitboard >>= 32n;
        result += 32;
    }

    if ((bitboard & 0xFFFFn) === 0n) {
        bitboard >>= 16n;
        result += 16;
    }

    if ((bitboard & 0xFFn) === 0n) {
        bitboard >>= 8n;
        result += 8;
    }

    if ((bitboard & 0xFn) === 0n) {
        bitboard >>= 4n;
        result += 4;
    }

    if ((bitboard & 0x3n) === 0n) {
        bitboard >>= 2n;
        result += 2;
    }

    if ((bitboard & 0x1n) === 0n) {
        result += 1;
    }

    return result;
}

/**
 * Returns a bitboard with all the squares shifted one rank north.
 * @param bitboard - The bitboard to shift.
 * @return The shifted bitboard.
 */
export function north(bitboard: bigint): bigint {
    return (bitboard & ~rank8) << 8n;
}

/**
 * Returns a bitboard with all the squares shifted one file east
 * @param bitboard - The bitboard to shift.
 * @return The shifted bitboard.
 */
export function east(bitboard: bigint): bigint {
    return (bitboard & ~hFile) << 1n;
}

/**
 * Returns a bitboard with all the squares shifted one rank south.
 * @param bitboard - The bitboard to shift.
 * @return The shifted bitboard.
 */
export function south(bitboard: bigint): bigint {
    return (bitboard & ~rank1) >> 8n;
}

/**
 * Returns a bitboard with all the squares shifted one file west.
 * @param bitboard - The bitboard to shift.
 * @return The shifted bitboard.
 */
export function west(bitboard: bigint): bigint {
    return (bitboard & ~aFile) >> 1n;
}

/**
 * The offsets used to shift in all directions.
 */
const directionOffsets = [
    Direction.North, Direction.South,
    Direction.East, Direction.West,
    Direction.NorthEast, Direction.NorthWest,
    Direction.SouthEast, Direction.SouthWest
];

/**
 * Bitboards that can be used to avoid wraparound when shifting.
 */
const avoidWrap: bigint[] = [
    ~rank8,
    ~rank1,
    ~hFile,
    ~aFile,
    ~(rank8 | hFile),
    ~(rank8 | aFile),
    ~(rank1 | hFile),
    ~(rank1 | aFile)
];

/**
 * Returns a bitboard with all the squares shifted in the given direction, avoiding wraparound.
 * @param bitboard - The bitboard to shift.
 * @param direction - The direction to shift.
 * @return The shifted bitboard.
 */
export function shift(bitboard: bigint, direction: DirectionIndex): bigint {
    const offset = directionOffsets[direction];
    const avoid = avoidWrap[direction];
    return (bitboard & avoid) << BigInt(offset);
}

/**
 * Checks whether the given square can be shifted in the given direction without wrapping around.
 * @param square - The square to check.
 * @param direction - The direction to check.
 * @return Whether the square can be shifted in the given direction.
 */
export function isSquare(square: Square, direction: DirectionIndex): boolean {
    return shift(squareBitboard(square), direction) !== 0n;
}