import {DirectionIndex, Square} from "../engine/types";
import {
    getAntiDiagonalAttacks,
    getDiagonalAttacks, getFileAttacks,
    getNegativeRayAttacks,
    getPositiveRayAttacks, getRankAttacks
} from "../engine/CAttackMap";

test('positive ray attacks are correct', () => {
    // No blockers
    expect(getPositiveRayAttacks(Square.A1, 0n, DirectionIndex.North)).toBe(0x0101010101010100n);
    expect(getPositiveRayAttacks(Square.B2, 0n, DirectionIndex.NorthEast)).toBe(0x8040201008040000n);
    expect(getPositiveRayAttacks(Square.E4, 0n, DirectionIndex.NorthWest)).toBe(0x0102040800000000n);
    expect(getPositiveRayAttacks(Square.A1, 0n, DirectionIndex.East)).toBe(0x00000000000000fen);

    // Blockers
    expect(getPositiveRayAttacks(Square.A1, 0x0100000001000000n, DirectionIndex.North)).toBe(0x0000000001010100n);
    expect(getPositiveRayAttacks(Square.A2, 0x0f00000800000000n, DirectionIndex.NorthEast)).toBe(0x0000000804020000n);
    expect(getPositiveRayAttacks(Square.E4, 0x00020000000000ffn, DirectionIndex.NorthWest)).toBe(0x0002040800000000n);
    expect(getPositiveRayAttacks(Square.A1, 0xff000ff000000020n, DirectionIndex.East)).toBe(0x000000000000003en);
});

test('negative ray attacks are correct', () => {
    // No blockers
    expect(getNegativeRayAttacks(Square.G7, 0n, DirectionIndex.South)).toBe(0x0000404040404040n);
    expect(getNegativeRayAttacks(Square.D3, 0n, DirectionIndex.SouthWest)).toBe(0x0000000000000402n);
    expect(getNegativeRayAttacks(Square.G7, 0n, DirectionIndex.West)).toBe(0x003f000000000000n);
    expect(getNegativeRayAttacks(Square.A4, 0n, DirectionIndex.SouthEast)).toBe(0x0000000000020408n);

    // Blockers
    expect(getNegativeRayAttacks(Square.G7, 0x0f0f000000004000n, DirectionIndex.South)).toBe(0x0000404040404000n);
    expect(getNegativeRayAttacks(Square.D3, 0x00ff0000000004f0n, DirectionIndex.SouthWest)).toBe(0x0000000000000400n);
    expect(getNegativeRayAttacks(Square.G7, 0x000f00000ff00000n, DirectionIndex.West)).toBe(0x0038000000000000n);
    expect(getNegativeRayAttacks(Square.A4, 0x000000000000f0ffn, DirectionIndex.SouthEast)).toBe(0x0000000000020408n);
});

test('diagonal and anti-diagonal attacks are correct', () => {
    // No blockers
    expect(getDiagonalAttacks(Square.E4, 0n)).toBe(0x0080402000080402n);
    expect(getDiagonalAttacks(Square.C7, 0n)).toBe(0x0800020100000000n);
    expect(getAntiDiagonalAttacks(Square.E4, 0n)).toBe(0x0102040800204080n);
    expect(getAntiDiagonalAttacks(Square.C7, 0n)).toBe(0x0200081020408000n);

    // Blockers
    expect(getDiagonalAttacks(Square.E4, 0xff004000000004ffn)).toBe(0x0000402000080400n);
    expect(getDiagonalAttacks(Square.C7, 0x0800000000000f0ffn)).toBe(0x0800020100000000n);
    expect(getAntiDiagonalAttacks(Square.E4, 0xf00200000020000fn)).toBe(0x0002040800200000n);
    expect(getAntiDiagonalAttacks(Square.C7, 0xf0000000004000ffn)).toBe(0x0200081020400000n);
});

test('rank and file attacks are correct', () => {
    // No blockers
    expect(getFileAttacks(Square.E4, 0n)).toBe(0x1010101000101010n);
    expect(getFileAttacks(Square.C7, 0n)).toBe(0x0400040404040404n);
    expect(getRankAttacks(Square.E4, 0n)).toBe(0x00000000ef000000n);
    expect(getRankAttacks(Square.C7, 0n)).toBe(0x00fb000000000000n);

    // Blockers
    expect(getFileAttacks(Square.E4, 0x0010000000001000n)).toBe(0x0010101000101000n);
    expect(getFileAttacks(Square.C7, 0x0400000000000400n)).toBe(0x0400040404040400n);
    expect(getRankAttacks(Square.E4, 0x0000000044000000n)).toBe(0x000000006c000000n);
    expect(getRankAttacks(Square.C7, 0x00f0000000000000n)).toBe(0x001b000000000000n);
});

export {};