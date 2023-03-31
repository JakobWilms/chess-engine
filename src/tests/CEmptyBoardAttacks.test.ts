import {kingAttacks, knightAttacks, pawnAttacks, rayAttacks} from "../engine/CEmptyBoardAttacks";
import {Color, DirectionIndex, Square} from "../engine/types";

test('north attacks correct', () => {
    const northAttacks = rayAttacks[DirectionIndex.North];
    expect(northAttacks[Square.A1]).toBe(0x0101010101010100n);
    expect(northAttacks[Square.B1]).toBe(0x0202020202020200n);
    expect(northAttacks[Square.A2]).toBe(0x0101010101010000n);
    expect(northAttacks[Square.F2]).toBe(0x2020202020200000n);
});

test('north east attacks correct', () => {
    const northEastAttacks = rayAttacks[DirectionIndex.NorthEast];
    expect(northEastAttacks[Square.A1]).toBe(0x8040201008040200n);
    expect(northEastAttacks[Square.B1]).toBe(0x0080402010080400n);
    expect(northEastAttacks[Square.A2]).toBe(0x4020100804020000n);
    expect(northEastAttacks[Square.F2]).toBe(0x0000000080400000n);
});

test('east attacks correct', () => {
    const eastAttacks = rayAttacks[DirectionIndex.East];
    expect(eastAttacks[Square.A1]).toBe(0x00000000000000fen);
    expect(eastAttacks[Square.B1]).toBe(0x00000000000000fcn);
    expect(eastAttacks[Square.A2]).toBe(0x000000000000fe00n);
    expect(eastAttacks[Square.F2]).toBe(0x000000000000c000n);
});

test('south east attacks correct', () => {
    const southEastAttacks = rayAttacks[DirectionIndex.SouthEast];
    expect(southEastAttacks[Square.A8]).toBe(0x0002040810204080n);
    expect(southEastAttacks[Square.B8]).toBe(0x0004081020408000n);
    expect(southEastAttacks[Square.A7]).toBe(0x0000020408102040n);
    expect(southEastAttacks[Square.F7]).toBe(0x0000408000000000n);
});

test('south attacks correct', () => {
    const southAttacks = rayAttacks[DirectionIndex.South];
    expect(southAttacks[Square.A8]).toBe(0x0001010101010101n);
    expect(southAttacks[Square.B8]).toBe(0x0002020202020202n);
    expect(southAttacks[Square.A7]).toBe(0x0000010101010101n);
    expect(southAttacks[Square.F7]).toBe(0x0000202020202020n);
});

test('south west attacks correct', () => {
    const southWestAttacks = rayAttacks[DirectionIndex.SouthWest];
    expect(southWestAttacks[Square.H8]).toBe(0x0040201008040201n);
    expect(southWestAttacks[Square.G8]).toBe(0x0020100804020100n);
    expect(southWestAttacks[Square.H7]).toBe(0x0000402010080402n);
    expect(southWestAttacks[Square.C7]).toBe(0x0000020100000000n);
});

test('west attacks correct', () => {
    const westAttacks = rayAttacks[DirectionIndex.West];
    expect(westAttacks[Square.H1]).toBe(0x000000000000007fn);
    expect(westAttacks[Square.G1]).toBe(0x000000000000003fn);
    expect(westAttacks[Square.H2]).toBe(0x0000000000007f00n);
    expect(westAttacks[Square.C2]).toBe(0x0000000000000300n);
});

test('north west attacks correct', () => {
    const northWestAttacks = rayAttacks[DirectionIndex.NorthWest];
    expect(northWestAttacks[Square.H1]).toBe(0x0102040810204000n);
    expect(northWestAttacks[Square.G1]).toBe(0x0001020408102000n);
    expect(northWestAttacks[Square.H2]).toBe(0x0204081020400000n);
    expect(northWestAttacks[Square.C2]).toBe(0x0000000001020000n);
});

test('knight attacks correct', () => {
    expect(knightAttacks[Square.A1]).toBe(0x0000000000020400n);
    expect(knightAttacks[Square.E4]).toBe(0x0000284400442800n);
});

test('king attacks correct', () => {
    expect(kingAttacks[Square.A1]).toBe(0x0000000000000302n);
    expect(kingAttacks[Square.E4]).toBe(0x0000003828380000n);
});

test('pawn attacks correct', () => {
    expect(pawnAttacks[Color.White][Square.A2]).toBe(0x0000000000020000n);
    expect(pawnAttacks[Color.White][Square.E4]).toBe(0x0000002800000000n);

    expect(pawnAttacks[Color.Black][Square.A7]).toBe(0x0000020000000000n);
    expect(pawnAttacks[Color.Black][Square.E5]).toBe(0x0000000028000000n);
});

export {};