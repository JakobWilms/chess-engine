import {
    bitScanForward,
    bitScanReverse,
    east,
    isSquare,
    north,
    popCount, shift,
    south,
    squareBitboard,
    west
} from "../engine/CBitboard";
import {DirectionIndex, Square} from "../engine/types";

test('north shifts bitboard one rank north', () => {
    expect(north(0x00000000000000FFn)).toBe(0x000000000000FF00n);
    expect(north(0x000000000000FF00n)).toBe(0x0000000000FF0000n);
    expect(north(0x0000000000FF0000n)).toBe(0x00000000FF000000n);
    expect(north(0x00000000FF000000n)).toBe(0x000000FF00000000n);
    expect(north(0x000000FF00000000n)).toBe(0x0000FF0000000000n);
    expect(north(0x0000FF0000000000n)).toBe(0x00FF000000000000n);
    expect(north(0x00FF000000000000n)).toBe(0xFF00000000000000n);
    expect(north(0xFF00000000000000n)).toBe(0x0000000000000000n);
});

test('east shifts bitboard one file east', () => {
    expect(east(0x0101010101010101n)).toBe(0x0202020202020202n);
    expect(east(0x0202020202020202n)).toBe(0x0404040404040404n);
    expect(east(0x0404040404040404n)).toBe(0x0808080808080808n);
    expect(east(0x0808080808080808n)).toBe(0x1010101010101010n);
    expect(east(0x1010101010101010n)).toBe(0x2020202020202020n);
    expect(east(0x2020202020202020n)).toBe(0x4040404040404040n);
    expect(east(0x4040404040404040n)).toBe(0x8080808080808080n);
    expect(east(0x8080808080808080n)).toBe(0x0000000000000000n);
});

test('south shifts bitboard one rank south', () => {
    expect(south(0x00000000000000FFn)).toBe(0x0000000000000000n);
    expect(south(0x000000000000FF00n)).toBe(0x00000000000000FFn);
    expect(south(0x0000000000FF0000n)).toBe(0x000000000000FF00n);
    expect(south(0x00000000FF000000n)).toBe(0x0000000000FF0000n);
    expect(south(0x000000FF00000000n)).toBe(0x00000000FF000000n);
    expect(south(0x0000FF0000000000n)).toBe(0x000000FF00000000n);
    expect(south(0x00FF000000000000n)).toBe(0x0000FF0000000000n);
    expect(south(0xFF00000000000000n)).toBe(0x00FF000000000000n);
});

test('west shifts bitboard one file west', () => {
    expect(west(0x0101010101010101n)).toBe(0x0000000000000000n);
    expect(west(0x0202020202020202n)).toBe(0x0101010101010101n);
    expect(west(0x0404040404040404n)).toBe(0x0202020202020202n);
    expect(west(0x0808080808080808n)).toBe(0x0404040404040404n);
    expect(west(0x1010101010101010n)).toBe(0x0808080808080808n);
    expect(west(0x2020202020202020n)).toBe(0x1010101010101010n);
    expect(west(0x4040404040404040n)).toBe(0x2020202020202020n);
    expect(west(0x8080808080808080n)).toBe(0x4040404040404040n);
});

test('square bitboard is correct', () => {
    expect(squareBitboard(Square.A1)).toBe(0x0000000000000001n);
    expect(squareBitboard(Square.E4)).toBe(0x0000000010000000n);
});

test('bit scan reverse is correct', () => {
    expect(bitScanForward(0x0000000000000001n)).toBe(Square.A1);
    expect(bitScanForward(0x0000000010000000n)).toBe(Square.E4);
    expect(bitScanReverse(0x1234567890abcd10n)).toBe(Square.E8);
    expect(bitScanReverse(0x0034567890abcd1Fn)).toBe(Square.F7);
    /*console.time('bitScanReverse');
    for (let i = 0; i < 1000000; i++) {
        bitScanReverse(0x1234567890abcd10n);
    }
    console.timeEnd('bitScanReverse');*/
});

test('bit scan forward is correct', () => {
    expect(bitScanForward(0x0000000000000001n)).toBe(Square.A1);
    expect(bitScanForward(0x0000000010000000n)).toBe(Square.E4);
    expect(bitScanForward(0x1234567890abcd10n)).toBe(Square.E1);
    expect(bitScanForward(0x0034567890abcd1Fn)).toBe(Square.A1);
    expect(bitScanForward(0x8000000000000000n)).toBe(Square.H8);
    /*console.time('bitScanForward');
    for (let i = 0; i < 1000000; i++) {
        bitScanForward(0x1234567890abcd10n);
    }
    console.timeEnd('bitScanForward');*/

});

test('pop count is correct', () => {
    expect(popCount(0x0000000000000001n)).toBe(1);
    expect(popCount(0x1111111111111111n)).toBe(16);
    expect(popCount(0xffffffffffffffffn)).toBe(64);
    /*console.time('popCount');
    for (let i = 0; i < 1000000; i++) {
        popCount(0xffffffffffffffffn);
    }
    console.timeEnd('popCount');*/
});

test('is square is correct', () => {
    expect(isSquare(Square.A1, DirectionIndex.North)).toBeTruthy();
    expect(isSquare(Square.A1, DirectionIndex.NorthEast)).toBeTruthy();
    expect(isSquare(Square.A1, DirectionIndex.West)).toBeFalsy();
    expect(isSquare(Square.E4, DirectionIndex.SouthWest)).toBeTruthy();
    expect(isSquare(Square.H5, DirectionIndex.NorthEast)).toBeFalsy();
});

test('shift is correct', () => {
    expect(shift(squareBitboard(Square.A1), DirectionIndex.North)).toBe(squareBitboard(Square.A2));
    expect(shift(squareBitboard(Square.A1), DirectionIndex.NorthEast)).toBe(squareBitboard(Square.B2));
    expect(shift(squareBitboard(Square.A1), DirectionIndex.West)).toBe(0n);
    expect(shift(squareBitboard(Square.E4), DirectionIndex.SouthWest)).toBe(squareBitboard(Square.D3));
    expect(shift(squareBitboard(Square.H5), DirectionIndex.NorthEast)).toBe(0n);
});

export {};