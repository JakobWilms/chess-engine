import {Castling, CheckType, Color, MoveType, Piece, Square} from "./types";
import {CBoard} from "./CBoard";
import {colorOf, promotedPiece, relativePiece, relativeSouth, relativeSquare} from "./convert";

export class CMove {
    /**
     * The encoded move. The format is as follows:
     * 4bits: previous castling rights,
     * 6bits: previous en passant square,
     * 6bits: previous half move clock,
     * 2bits: check type,
     * 6bits: from square,
     * 6bits: to square,
     * 4bits: from piece,
     * 4bits: to piece,
     * 4bits: move type
     * @private
     */
    private encodedMove: bigint;

    /**
     * Creates a new move, everything set to 0.
     */
    constructor() {
        this.encodedMove = 0n;
    }

    /**
     * Set all the fields of the move.
     * @param from - The square the piece is moving from.
     * @param to - The square the piece is moving to.
     * @param fromPiece - The piece that is moving.
     * @param toPiece - The piece that is being captured.
     * @param type - The type of move.
     * @param check - The type of check.
     */
    public setAll(from: Square, to: Square, fromPiece: Piece, toPiece: Piece, type: MoveType, check?: CheckType) {
        this.encodedMove = 0n;
        if (check === undefined) {
            check = CheckType.None;
        }
        this.encodedMove |= BigInt(check) << 24n;
        this.encodedMove |= BigInt(from) << 18n;
        this.encodedMove |= BigInt(to) << 12n;
        this.encodedMove |= BigInt(fromPiece) << 8n;
        this.encodedMove |= BigInt(toPiece) << 4n;
        this.encodedMove |= BigInt(type);
    }

    /**
     * Make the move on the given board.
     * @param board - The board to make the move on.
     */
    public make(board: CBoard): void {
        const from = this.getFrom();
        const to = this.getTo();
        const fromPiece = this.getFromPiece();
        const color = colorOf(fromPiece);
        switch (this.getType()) {
            case MoveType.Quiet:
            case MoveType.DoublePawnPush:
            case MoveType.Capture:
                board.removePiece(from);
                board.setPiece(to, fromPiece);
                break;
            case MoveType.KingSideCastle:
                board.removePiece(from);
                board.setPiece(to, fromPiece);
                board.removePiece(relativeSquare(Square.H1, color));
                board.setPiece(relativeSquare(Square.F1, color), relativePiece(Piece.WhiteRook, color));
                break;
            case MoveType.QueenSideCastle:
                board.removePiece(from);
                board.setPiece(to, fromPiece);
                board.removePiece(relativeSquare(Square.A1, color));
                board.setPiece(relativeSquare(Square.D1, color), relativePiece(Piece.WhiteRook, color));
                break;
            case MoveType.EnPassant:
                board.removePiece(from);
                board.setPiece(to, fromPiece);
                board.removePiece(to + relativeSouth(color));
                break;
            case MoveType.KnightPromotion:
            case MoveType.BishopPromotion:
            case MoveType.RookPromotion:
            case MoveType.QueenPromotion:
            case MoveType.KnightPromotionCapture:
            case MoveType.BishopPromotionCapture:
            case MoveType.RookPromotionCapture:
            case MoveType.QueenPromotionCapture:
                board.removePiece(from);
                board.setPiece(to, promotedPiece(this.getType(), color));
                break;
        }
        // Increment full move counter if black to move
        if (board.sideToMove === Color.Black) {
            board.fullMoveCounter++;
        }
        // Flip to move
        board.sideToMove = board.sideToMove ^ 1;
        // Save half move clock
        this.setHalfMoveClock(board.halfMoveClock);
        // Increment half move clock
        board.halfMoveClock++;
        // Reset half move clock if the move was a capture or a pawn move
        if (this.getFromPiece() === Piece.WhitePawn || this.getFromPiece() === Piece.BlackPawn || this.getType() === MoveType.Capture || this.getType() === MoveType.EnPassant || this.getType() >= MoveType.KnightPromotion) {
            board.halfMoveClock = 0;
        }
        // Save en passant square
        this.setEnPassantSquare(board.enPassantTargetSquare);
        // Reset en passant square
        board.enPassantTargetSquare = Square.A1;
        // Set en passant square if the move was a double pawn push
        if (this.getType() === MoveType.DoublePawnPush) {
            board.enPassantTargetSquare = this.getTo() + relativeSouth(colorOf(this.getFromPiece()));
        }
        // Save castling rights
        this.setCastlingRights(board.castlingRights);
        // Update castling rights
        if (this.getFromPiece() === Piece.WhiteKing) {
            board.castlingRights &= ~Castling.White;
        } else if (this.getFromPiece() === Piece.BlackKing) {
            board.castlingRights &= ~Castling.Black;
        } else if (this.getFrom() === Square.A1 || this.getTo() === Square.A1) {
            board.castlingRights &= ~Castling.WhiteQueenSide;
        } else if (this.getFrom() === Square.H1 || this.getTo() === Square.H1) {
            board.castlingRights &= ~Castling.WhiteKingSide;
        } else if (this.getFrom() === Square.A8 || this.getTo() === Square.A8) {
            board.castlingRights &= ~Castling.BlackQueenSide;
        } else if (this.getFrom() === Square.H8 || this.getTo() === Square.H8) {
            board.castlingRights &= ~Castling.BlackKingSide;
        }
    }

    /**
     * Unmake the move on the given board.
     * @param board - The board to unmake the move on.
     */
    public unmake(board: CBoard): void {
        const from = this.getFrom();
        const to = this.getTo();
        const fromPiece = this.getFromPiece();
        const color = colorOf(fromPiece);
        switch (this.getType()) {
            case MoveType.Quiet:
            case MoveType.DoublePawnPush:
            case MoveType.Capture:
                board.setPiece(to, this.getToPiece());
                board.setPiece(from, fromPiece);
                break;
            case MoveType.KingSideCastle:
                board.removePiece(relativeSquare(Square.F1, color));
                board.setPiece(relativeSquare(Square.H1, color), relativePiece(Piece.WhiteRook, color));
                board.removePiece(to);
                board.setPiece(from, fromPiece);
                break;
            case MoveType.QueenSideCastle:
                board.removePiece(relativeSquare(Square.D1, color));
                board.setPiece(relativeSquare(Square.A1, color), relativePiece(Piece.WhiteRook, color));
                board.removePiece(to);
                board.setPiece(from, fromPiece);
                break;
            case MoveType.EnPassant:
                board.removePiece(to);
                board.setPiece(from, fromPiece);
                board.setPiece(to + relativeSouth(color), this.getToPiece());
                break;
            case MoveType.KnightPromotion:
            case MoveType.BishopPromotion:
            case MoveType.RookPromotion:
            case MoveType.QueenPromotion:
            case MoveType.KnightPromotionCapture:
            case MoveType.BishopPromotionCapture:
            case MoveType.RookPromotionCapture:
            case MoveType.QueenPromotionCapture:
                board.setPiece(from, fromPiece);
                board.setPiece(to, this.getToPiece());
                break;
        }
        // Flip to move
        board.sideToMove = board.sideToMove ^ 1;
        // Decrement full move counter if black to move
        if (board.sideToMove === Color.Black) {
            board.fullMoveCounter--;
        }
        // Restore half move clock
        board.halfMoveClock = this.getHalfMoveClock();
        // Restore en passant square
        board.enPassantTargetSquare = this.getEnPassantSquare();
        // Restore castling rights
        board.castlingRights = this.getCastlingRights();
    }

    /**
     * @return The square the piece is moving from.
     */
    public getFrom(): Square {
        return Number((this.encodedMove >> 18n) & 0x3Fn);
    }

    /**
     * @return The square the piece is moving to.
     */
    public getTo(): Square {
        return Number((this.encodedMove >> 12n) & 0x3Fn);
    }

    /**
     * @return The piece that is moving.
     */
    public getFromPiece(): Piece {
        return Number((this.encodedMove >> 8n) & 0xFn);
    }

    /**
     * @return The piece that is being captured.
     */
    public getToPiece(): Piece {
        return Number((this.encodedMove >> 4n) & 0xFn);
    }

    /**
     * @return The type of move.
     */
    public getType(): MoveType {
        return Number(this.encodedMove & 0xFn);
    }

    /**
     * @return The type of check.
     */
    public getCheck(): CheckType {
        return Number((this.encodedMove >> 24n) & 0x3n);
    }

    /**
     * Set the previous half move clock to the given value.
     * @param halfMoveClock - The previous half move clock.
     */
    public setHalfMoveClock(halfMoveClock: number): void {
        this.encodedMove |= BigInt(halfMoveClock) << 26n;
    }

    /**
     * Get the previous half move clock.
     * @return The previous half move clock.
     */
    public getHalfMoveClock(): number {
        return Number((this.encodedMove >> 26n) & 0x3Fn);
    }

    /**
     * Set the previous en passant square.
     * @param enPassantSquare - The previous en passant square.
     */
    public setEnPassantSquare(enPassantSquare: number) {
        this.encodedMove |= BigInt(enPassantSquare) << 32n;
    }

    /**
     * Get the previous en passant square.
     * @return The previous en passant square.
     */
    public getEnPassantSquare(): Square {
        return Number((this.encodedMove >> 32n) & 0x3Fn);
    }

    /**
     * Set the previous castling rights.
     * @param castlingRights - The previous castling rights.
     */
    public setCastlingRights(castlingRights: number) {
        this.encodedMove |= BigInt(castlingRights) << 38n;
    }

    /**
     * Get the castling rights.
     * @return The castling rights.
     */
    public getCastlingRights(): number {
        return Number((this.encodedMove >> 38n) & 0xFn);
    }
}