// noinspection JSBitwiseOperatorUsage

import {Castling, Color, File, Piece, Rank, Square} from "./types";
import {colorOf, fromFenChar, relativePiece, toFenChar} from "./convert";
import {squareBitboard} from "./CBitboard";
import {getBishopAttacks, getKnightAttacks, getPawnAttacks, getRookAttacks} from "./CAttackMap";

/**
 * A chess board. The board is represented by bitboards.
 */
export class CBoard {
    /**
     * The bitboards of the pieces. The bitboards are indexed by the Piece enum.
     * Every bitboard is represented by a 64bit integer. If a bit is set, the corresponding square is occupied by the piece.
     * @see https://www.chessprogramming.org/Bitboards
     */
    pieceBB: bigint[];
    /**
     * The bitboards of the colors. The bitboards are indexed by the Color enum.
     * These bitboards are redundant, but they are used for performance reasons.
     */
    colorBB: bigint[];
    /**
     * The bitboard of all occupied squares.
     */
    occupiedBB: bigint;
    /**
     * The pieces on the board, indexed by the square index.
     */
    pieces: Piece[];
    /**
     * The side to move, represented by the Color enum.
     */
    sideToMove: Color;
    /**
     * The castling rights, indexed by the Castling enum.
     */
    castlingRights: number;
    /**
     * The en passant target square, represented by the square index or A1 if there is no en passant target square.
     */
    enPassantTargetSquare: Square;
    /**
     * The number of half moves since the last capture or pawn move.
     */
    halfMoveClock: number;
    /**
     * The number of the full moves. It starts at 1, and is incremented after black's move.
     */
    fullMoveCounter: number;

    /**
     * Creates a new chess board. All bitboards are initialized to 0.
     */
    constructor() {
        this.pieceBB = new Array(15).fill(0n);
        this.colorBB = new Array(2).fill(0n);
        this.pieces = new Array(64).fill(Piece.None);
        this.occupiedBB = 0n;
        this.sideToMove = Color.White;
        this.castlingRights = 0b1111;
        this.enPassantTargetSquare = Square.A1;
        this.halfMoveClock = 0;
        this.fullMoveCounter = 1;
    }

    /**
     * Imports a FEN string.
     * @param fen - The FEN string to import.
     * @public
     */
    public importFen(fen: string) {
        const fenSplit: string[] = fen.split(' ');
        // Reset
        this.pieceBB.fill(0n);
        this.colorBB.fill(0n);
        this.occupiedBB = 0n;
        this.pieces.fill(Piece.None);
        this.castlingRights = 0;
        // Piece placement
        const rows: string[] = fenSplit[0].split('/');
        const isDigit = /\d/;
        for (let rank: Rank = Rank.R8; rank >= Rank.R1; rank--) {
            let file: File = File.A;
            const row: string = rows[7 - rank];
            for (let i = 0; i < rows[7 - rank].length; i++) {
                let pieceChar: string = row[i];
                if (isDigit.test(pieceChar)) {
                    file += Number(pieceChar);
                } else {
                    const piece = fromFenChar(pieceChar);
                    const square: Square = rank * 8 + file;
                    //console.log(Piece[piece], Square[square], pieceChar);
                    this.setPiece(square, piece);
                    file++;
                }
            }
        }

        // Side to move
        this.sideToMove = fenSplit[1] === 'w' ? Color.White : Color.Black;

        // Castling rights
        const castling = fenSplit[2];
        if (castling.includes('K')) {
            this.castlingRights |= Castling.WhiteKingSide;
        }
        if (castling.includes('Q')) {
            this.castlingRights |= Castling.WhiteQueenSide;
        }
        if (castling.includes('k')) {
            this.castlingRights |= Castling.BlackKingSide;
        }
        if (castling.includes('q')) {
            this.castlingRights |= Castling.BlackQueenSide;
        }

        // En passant target square
        if (fenSplit[3] === '-') {
            this.enPassantTargetSquare = Square.A1;
        } else {
            this.enPassantTargetSquare = 'abcdefgh'.indexOf(fenSplit[3][0]) + 8 * Number(fenSplit[3][1]) - 8;
        }

        // Half move clock
        this.halfMoveClock = Number(fenSplit[4]);

        // Full move counter
        this.fullMoveCounter = Number(fenSplit[5]);
    }

    /**
     * Exports the board to a FEN string.
     * @returns The FEN string.
     * @public
     */
    public exportFen(): string {
        let fen: string = '';
        // Piece placement
        for (let rank: Rank = Rank.R8; rank >= Rank.R1; rank--) {
            let emptySquares = 0;
            for (let file: File = File.A; file <= File.H; file++) {
                const square: Square = rank * 8 + file;
                const piece: Piece = this.getPiece(square);
                if (piece === Piece.None) {
                    emptySquares++;
                } else {
                    if (emptySquares > 0) {
                        fen += emptySquares;
                        emptySquares = 0;
                    }
                    fen += toFenChar(piece);
                }
            }
            if (emptySquares > 0) {
                fen += emptySquares;
            }
            if (rank > Rank.R1) {
                fen += '/';
            }
        }
        fen += ' ';
        // Side to move
        fen += this.sideToMove === Color.White ? 'w' : 'b';
        fen += ' ';
        // Castling rights
        if (this.castlingRights === 0) {
            fen += '-';
        } else {
            for (let i = 0; i < 4; i++) {
                if (this.castlingRights & (1 << i)) {
                    fen += 'KQkq'[i];
                }
            }
        }
        fen += ' ';
        // En passant target square
        if (this.enPassantTargetSquare === Square.A1) {
            fen += '-';
        } else {
            fen += 'abcdefgh'[this.enPassantTargetSquare % 8];
            fen += Math.floor(this.enPassantTargetSquare / 8) + 1;
        }
        fen += ' ';
        // Half move clock
        fen += this.halfMoveClock;
        fen += ' ';
        // Full move counter
        fen += this.fullMoveCounter;
        return fen;
    }

    /**
     * Sets the piece on the given square and removes the piece that was on that square.
     * @param square - The square to set the piece on.
     * @param piece - The piece to set.
     * @public
     */
    public setPiece(square: Square, piece: Piece): void {
        this.removePiece(square);
        if (piece !== Piece.None) {
            const bitboard = squareBitboard(square);
            this.pieceBB[piece] |= bitboard;
            this.colorBB[colorOf(piece)] |= bitboard;
            this.occupiedBB |= bitboard;
            this.pieces[square] = piece;
        }
    }

    /**
     * Removes a piece on the given square.
     * @param square - The square to remove the piece from.
     */
    public removePiece(square: Square): void {
        const piece = this.getPiece(square);
        if (piece !== Piece.None) {
            this._removePiece(square, this.getPiece(square));
        }
    }

    /**
     * Removes the given piece from the given square.
     * @param square - The square to remove the piece from.
     * @param piece - The piece to remove.
     * @public
     */
    public _removePiece(square: Square, piece: Piece): void {
        const bitboard = ~squareBitboard(square);
        this.pieceBB[piece] &= bitboard;
        this.colorBB[colorOf(piece)] &= bitboard;
        this.occupiedBB &= bitboard;
        this.pieces[square] = Piece.None;
    }

    /**
     * Gets the piece on the given square.
     * @param square - The square to get the piece from.
     * @public
     */
    public getPiece(square: Square): Piece {
        return this.pieces[square];
    }

    /**
     * Gets the color of the piece on the given square.
     * @param square - The square to get the color from.
     * @returns The color of the piece on the given square.
     * @throws {Error} If the square is empty.
     * @public
     */
    public getColor(square: Square): Color {
        return colorOf(this.getPiece(square));
    }

    public isAttacked(square: Square, color: Color): boolean {
        if (getPawnAttacks(square, 1 - color) & this.pieceBB[relativePiece(Piece.WhitePawn, color)]) {
            return true;
        }
        if (getKnightAttacks(square) & this.pieceBB[relativePiece(Piece.WhiteKnight, color)]) {
            return true;
        }
        if (getBishopAttacks(square, this.occupiedBB) & this.pieceBB[relativePiece(Piece.WhiteBishop, color)]) {
            return true;
        }
        return (getRookAttacks(square, this.occupiedBB) & this.pieceBB[relativePiece(Piece.WhiteRook, color)]) !== 0n;
    }
}