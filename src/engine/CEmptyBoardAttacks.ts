import {File, Rank, Square, DirectionIndex} from "./types";
import {
    aFile,
    antiDiagonal,
    diagonal,
    east,
    hFile,
    north,
    rank1,
    south,
    squareBitboard,
    west
} from "./CBitboard";

/**
 * The ray attacks in all directions for all squares.
 */
export const rayAttacks: bigint[][] = new Array(8).fill(null).map(() => new Array<bigint>(64));

/**
 * The king attacks for all squares.
 */
export const kingAttacks: bigint[] = new Array<bigint>(64);

/**
 * The knight attacks for all squares.
 */
export const knightAttacks: bigint[] = new Array<bigint>(64);

/**
 * The pawn attacks for both colors and all squares.
 */
export const pawnAttacks: bigint[][] = new Array(2).fill(null).map(() => new Array<bigint>(64));

calculateAttacks();

/**
 * Calculates the attacks for all squares.
 */
function calculateAttacks(): void {
    //console.log("Calculating attacks...");
    calculateNorthAttacks();
    calculateNorthEastAttacks();
    calculateEastAttacks();
    calculateSouthEastAttacks();
    calculateSouthAttacks();
    calculateSouthWestAttacks();
    calculateWestAttacks();
    calculateNorthWestAttacks();

    calculateKingAttacks();
    calculateKnightAttacks();
    calculatePawnAttacks();
}

/**
 * Calculates the pawn attacks for all squares.
 */
function calculatePawnAttacks(): void {
    let squareBitboard: bigint = 1n;
    for (let square = Square.A1; square <= Square.H8; square++, squareBitboard <<= 1n) {
        pawnAttacks[0][square] = north(east(squareBitboard)) | north(west(squareBitboard));
        pawnAttacks[1][square] = south(east(squareBitboard)) | south(west(squareBitboard));
    }
}

/**
 * Calculates the knight attacks for all squares.
 */
function calculateKnightAttacks(): void {
    let squareBitboard: bigint = 1n;
    for (let square = Square.A1; square <= Square.H8; square++, squareBitboard <<= 1n) {
        let attacks = east(east(squareBitboard)) | west(west(squareBitboard));
        knightAttacks[square] = north(attacks) | south(attacks);
        attacks = north(north(squareBitboard)) | south(south(squareBitboard));
        knightAttacks[square] |= east(attacks) | west(attacks);
    }
}

/**
 * Calculates the king attacks for all squares.
 */
function calculateKingAttacks(): void {
    let squareBitboard: bigint = 1n;
    for (let square = Square.A1; square <= Square.H8; square++, squareBitboard <<= 1n) {
        let attacks = east(squareBitboard) | squareBitboard | west(squareBitboard);
        kingAttacks[square] = (south(attacks) | attacks | north(attacks)) & ~squareBitboard;
    }
}

/**
 * Calculates the north-west attacks for all squares.
 */
function calculateNorthWestAttacks(): void {
    let attacks: bigint = antiDiagonal & ~squareBitboard(Square.H1);
    for (let file = File.H; file >= File.A; file--, attacks = west(attacks)) {
        let attack = attacks;
        for (let rank = Rank.R1; rank <= Rank.R8; rank++, attack = north(attack)) {
            rayAttacks[DirectionIndex.NorthWest][rank * 8 + file] = attack;
        }
    }
}

/**
 * Calculates the west attacks for all squares.
 */
function calculateWestAttacks(): void {
    let attacks: bigint = rank1 & ~squareBitboard(Square.H1);
    for (let rank = Rank.R1; rank <= Rank.R8; rank++, attacks = north(attacks)) {
        let attack = attacks;
        for (let file = File.H; file >= File.A; file--, attack = west(attack)) {
            rayAttacks[DirectionIndex.West][rank * 8 + file] = attack;
        }
    }
}

/**
 * Calculates the south-west attacks for all squares.
 */
function calculateSouthWestAttacks(): void {
    let attacks: bigint = diagonal & ~squareBitboard(Square.H8);
    for (let file = File.H; file >= File.A; file--, attacks = west(attacks)) {
        let attack = attacks;
        for (let rank = Rank.R8; rank >= Rank.R1; rank--, attack = south(attack)) {
            rayAttacks[DirectionIndex.SouthWest][rank * 8 + file] = attack;
        }
    }
}

/**
 * Calculates the south attacks for all squares.
 */
function calculateSouthAttacks(): void {
    let attacks: bigint = hFile & ~squareBitboard(Square.H8);
    for (let file = File.H; file >= File.A; file--, attacks = west(attacks)) {
        let attack = attacks;
        for (let rank = Rank.R8; rank >= Rank.R1; rank--, attack = south(attack)) {
            rayAttacks[DirectionIndex.South][rank * 8 + file] = attack;
        }
    }
}

/**
 * Calculates the south-east attacks for all squares.
 */
function calculateSouthEastAttacks(): void {
    let attacks: bigint = antiDiagonal & ~squareBitboard(Square.A8);
    for (let file = File.A; file <= File.H; file++, attacks = east(attacks)) {
        let attack = attacks;
        for (let rank = Rank.R8; rank >= Rank.R1; rank--, attack = south(attack)) {
            rayAttacks[DirectionIndex.SouthEast][rank * 8 + file] = attack;
        }
    }
}

/**
 * Calculates the east attacks for all squares.
 */
function calculateEastAttacks(): void {
    let attacks: bigint = rank1 & ~squareBitboard(Square.A1);
    for (let rank = Rank.R1; rank <= Rank.R8; rank++, attacks = north(attacks)) {
        let attack = attacks;
        for (let file = File.A; file <= File.H; file++, attack = east(attack)) {
            rayAttacks[DirectionIndex.East][rank * 8 + file] = attack;
        }
    }
}

/**
 * Calculates the north-east attacks for all squares.
 */
function calculateNorthEastAttacks(): void {
    let attacks: bigint = diagonal & ~squareBitboard(Square.A1)
    for (let file = File.A; file <= File.H; file++, attacks = east(attacks)) {
        let attack = attacks;
        for (let rank = Rank.R1; rank <= Rank.R8; rank++, attack = north(attack)) {
            rayAttacks[DirectionIndex.NorthEast][rank * 8 + file] = attack;
        }
    }
}

/**
 * Calculates the north attacks for all squares.
 */
function calculateNorthAttacks(): void {
    let attacks: bigint = aFile & ~squareBitboard(Square.A1);
    for (let file = File.A; file <= File.H; file++, attacks = east(attacks)) {
        let attack = attacks;
        for (let rank = Rank.R1; rank <= Rank.R8; rank++, attack = north(attack)) {
            rayAttacks[DirectionIndex.North][rank * 8 + file] = attack;
        }
    }
}