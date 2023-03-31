import {CMove} from "./CMove";
import {CBoard} from "./CBoard";
import {Castling, Color, Direction, DirectionIndex, MoveType, Piece, PieceType, Square} from "./types";
import {colorOf, directionIndexOf, pieceTypeOf, rankOf, relativePiece} from "./convert";
import {isSquare} from "./CBitboard";

export const moves: CMove[][] = new Array(20).fill(new Array(256).fill(new CMove()));
export let depth: number = 0;
const pieceDirections: Direction[][] = [
    [], [], [], // None, Pawn, Knight
    [
        Direction.NorthEast, Direction.NorthWest,
        Direction.SouthEast, Direction.SouthWest
    ], // Bishop
    [
        Direction.North, Direction.East,
        Direction.South, Direction.West
    ], // Rook
    [
        Direction.North, Direction.East,
        Direction.South, Direction.West,
        Direction.NorthEast, Direction.NorthWest,
        Direction.SouthEast, Direction.SouthWest
    ], // Queen
    [
        Direction.North, Direction.East,
        Direction.South, Direction.West,
        Direction.NorthEast, Direction.NorthWest,
        Direction.SouthEast, Direction.SouthWest
    ] // King
];
const pieceDirectionIndexes: DirectionIndex[][] = [
    [], [], [], // None, Pawn, Knight
    [
        DirectionIndex.NorthEast, DirectionIndex.NorthWest,
        DirectionIndex.SouthEast, DirectionIndex.SouthWest
    ], // Bishop
    [
        DirectionIndex.North, DirectionIndex.East,
        DirectionIndex.South, DirectionIndex.West
    ], // Rook
    [
        DirectionIndex.North, DirectionIndex.East,
        DirectionIndex.South, DirectionIndex.West,
        DirectionIndex.NorthEast, DirectionIndex.NorthWest,
        DirectionIndex.SouthEast, DirectionIndex.SouthWest
    ], // Queen
    [
        DirectionIndex.North, DirectionIndex.East,
        DirectionIndex.South, DirectionIndex.West,
        DirectionIndex.NorthEast, DirectionIndex.NorthWest,
        DirectionIndex.SouthEast, DirectionIndex.SouthWest
    ] // King
];
const knightDirections: Direction[][] = [
    [Direction.North, Direction.NorthEast],
    [Direction.North, Direction.NorthWest],
    [Direction.South, Direction.SouthEast],
    [Direction.South, Direction.SouthWest],
    [Direction.East, Direction.NorthEast],
    [Direction.East, Direction.SouthEast],
    [Direction.West, Direction.NorthWest],
    [Direction.West, Direction.SouthWest]
];

/**
 * Generates all legal moves for the given board.
 * @param board - The board to generate the moves for.
 * @returns The number of moves generated.
 */
export function generateMoves(board: CBoard): number {
    let moveCount = 0;

    // Generate moves
    moveCount = generateCastlingMoves(board, moveCount);
    for (let square = Square.A1; square <= Square.H8; square++) {
        const piece = board.getPiece(square);
        if (piece === Piece.None || colorOf(piece) !== board.sideToMove) {
            continue;
        }
        const pieceType = pieceTypeOf(piece);
        if (pieceType === PieceType.Pawn) {
            moveCount = generatePawnMoves(board, square, moveCount);
            continue;
        }
        if (pieceType === PieceType.Knight) {
            moveCount = generateKnightMoves(board, square, moveCount);
            continue;
        }
        for (let dir = 0; dir < pieceDirections[pieceType].length; dir++) {
            const direction = pieceDirections[pieceType][dir];
            const directionIndex = pieceDirectionIndexes[pieceType][dir];
            for (let pos = square; ;) {
                if (!isSquare(pos, directionIndex)) {
                    break;
                }
                pos += direction;
                const pieceTo = board.getPiece(pos);
                if (pieceTo === Piece.None) {
                    moveCount = pushMove(square, pos, piece, Piece.None, MoveType.Quiet, moveCount);
                } else if (colorOf(pieceTo) !== board.sideToMove) {
                    moveCount = pushMove(square, pos, piece, pieceTo, MoveType.Capture, moveCount);
                    break;
                } else {
                    break;
                }
                if (pieceType === PieceType.King) {
                    break;
                }
            }
        }
    }

    return moveCount;
}

/**
 * Generates all knight moves for the given board.
 * @param board - The board to generate the moves for.
 * @param square - The square of the knight.
 * @param moveCount - The number of moves generated so far.
 * @returns The new number of moves generated.
 */
function generateKnightMoves(board: CBoard, square: Square, moveCount: number): number {
    for (let i = 0; i < knightDirections.length; i++) {
        const directions = knightDirections[i];
        let currentSquare = square;
        let possible = true;
        for (let j = 0; j < directions.length; j++) {
            const direction = directions[j];
            if (!isSquare(currentSquare, directionIndexOf(direction))) {
                possible = false;
                break;
            }
            currentSquare += direction;
        }
        if (!possible) {
            continue;
        }
        const piece = board.getPiece(currentSquare);
        if (piece === Piece.None) {
            moveCount = pushMove(square, currentSquare, board.getPiece(square), Piece.None, MoveType.Quiet, moveCount);
        } else if (colorOf(piece) !== board.sideToMove) {
            moveCount = pushMove(square, currentSquare, board.getPiece(square), piece, MoveType.Capture, moveCount);
        }
    }
    return moveCount;
}

function generatePawnPushes(board: CBoard, square: Square, moveCount: number): number {
    if (board.sideToMove === Color.White) {
        if (board.getPiece(square + Direction.North) === Piece.None) {
            moveCount = pushMove(square, square + Direction.North, Piece.WhitePawn, Piece.None, MoveType.Quiet, moveCount);
            if (rankOf(square) === 1 && board.getPiece(square + DirectionIndex.North + DirectionIndex.North) === Piece.None) {
                moveCount = pushMove(square, square + DirectionIndex.North + DirectionIndex.North, Piece.WhitePawn, Piece.None, MoveType.DoublePawnPush, moveCount);
            }
        }
    } else {
        if (board.getPiece(square + Direction.South) === Piece.None) {
            moveCount = pushMove(square, square + Direction.South, Piece.BlackPawn, Piece.None, MoveType.Quiet, moveCount);
            if (rankOf(square) === 6 && board.getPiece(square + DirectionIndex.South + DirectionIndex.South) === Piece.None) {
                moveCount = pushMove(square, square + DirectionIndex.South + DirectionIndex.South, Piece.BlackPawn, Piece.None, MoveType.DoublePawnPush, moveCount);
            }
        }
    }

    return moveCount;
}

/**
 * Generates all pawn captures for the given board.
 * @param board - The board to generate the moves for.
 * @param square - The square the pawn is on.
 * @param moveCount - The number of moves generated so far.
 * @returns The new number of moves generated.
 */
function generatePawnCaptures(board: CBoard, square: Square, moveCount: number): number {
    if (board.sideToMove === Color.White) {
        moveCount = pushPawnCapture(board, square, DirectionIndex.NorthWest, moveCount);
        moveCount = pushPawnCapture(board, square, DirectionIndex.NorthEast, moveCount);
    } else {
        moveCount = pushPawnCapture(board, square, DirectionIndex.SouthWest, moveCount);
        moveCount = pushPawnCapture(board, square, DirectionIndex.SouthEast, moveCount);
    }

    return moveCount;
}

/**
 * Pushes pawn capture moves to the move list.
 * @param board - The board to generate the moves for.
 * @param fromSquare - The square the pawn is on.
 * @param direction - The direction to push the pawn.
 * @param moveCount - The number of moves generated so far.
 * @returns The new number of moves generated.
 */
function pushPawnCapture(board: CBoard, fromSquare: Square, direction: DirectionIndex, moveCount: number): number {
    if (isSquare(fromSquare, direction)) {
        const toSquare = fromSquare + direction;
        const piece = board.getPiece(toSquare);
        if (piece !== Piece.None && colorOf(piece) === 1 - board.sideToMove) {
            return pushMove(fromSquare, toSquare, relativePiece(Piece.WhitePawn, board.sideToMove), piece, MoveType.Capture, moveCount);
        } else if (toSquare === board.enPassantTargetSquare) {
            return pushMove(fromSquare, toSquare, relativePiece(Piece.WhitePawn, board.sideToMove), relativePiece(Piece.WhitePawn, 1 - board.sideToMove), MoveType.EnPassant, moveCount);
        }
    }
    return moveCount;
}

/**
 * Generates all pawn moves for the given board.
 * @param board - The board to generate the moves for.
 * @param square - The square the pawn is on.
 * @param moveCount - The number of moves generated so far.
 * @returns The new number of moves generated.
 */
function generatePawnMoves(board: CBoard, square: Square, moveCount: number): number {
    moveCount = generatePawnPushes(board, square, moveCount);
    moveCount = generatePawnCaptures(board, square, moveCount);
    return moveCount;
}

/**
 * Generates all castling moves for the given board.
 * @param board - The board to generate the moves for.
 * @param moveCount - The number of moves generated so far.
 * @returns The new number of moves generated.
 */
function generateCastlingMoves(board: CBoard, moveCount: number): number {
    if (board.sideToMove === Color.White) {
        if (board.castlingRights & Castling.WhiteKingSide) {
            if (board.getPiece(Square.F1) === Piece.None && board.getPiece(Square.G1) === Piece.None
                && !board.isAttacked(Square.E1, Color.Black) && !board.isAttacked(Square.F1, Color.Black) && !board.isAttacked(Square.G1, Color.Black)) {
                moveCount = pushMove(Square.E1, Square.G1, Piece.WhiteKing, Piece.None, MoveType.KingSideCastle, moveCount);
            }

        } else if (board.castlingRights & Castling.WhiteQueenSide) {
            if (board.getPiece(Square.D1) === Piece.None && board.getPiece(Square.C1) === Piece.None && board.getPiece(Square.B1) === Piece.None
                && !board.isAttacked(Square.E1, Color.Black) && !board.isAttacked(Square.D1, Color.Black) && !board.isAttacked(Square.C1, Color.Black)) {
                moveCount = pushMove(Square.E1, Square.C1, Piece.WhiteKing, Piece.None, MoveType.QueenSideCastle, moveCount);
            }
        }
    } else {
        if (board.castlingRights & Castling.BlackKingSide) {
            if (board.getPiece(Square.F8) === Piece.None && board.getPiece(Square.G8) === Piece.None
                && !board.isAttacked(Square.E8, Color.White) && !board.isAttacked(Square.F8, Color.White) && !board.isAttacked(Square.G8, Color.White)) {
                moveCount = pushMove(Square.E8, Square.G8, Piece.BlackKing, Piece.None, MoveType.KingSideCastle, moveCount);
            }
        } else if (board.castlingRights & Castling.BlackQueenSide) {
            if (board.getPiece(Square.D8) === Piece.None && board.getPiece(Square.C8) === Piece.None && board.getPiece(Square.B8) === Piece.None
                && !board.isAttacked(Square.E8, Color.White) && !board.isAttacked(Square.D8, Color.White) && !board.isAttacked(Square.C8, Color.White)) {
                moveCount = pushMove(Square.E8, Square.C8, Piece.BlackKing, Piece.None, MoveType.QueenSideCastle, moveCount);
            }
        }
    }

    return moveCount;
}

/**
 * Pushes a move to the move list.
 * @param from - The square the piece is moving from.
 * @param to - The square the piece is moving to.
 * @param fromPiece - The piece that is moving.
 * @param toPiece - The piece that is being captured.
 * @param moveType - The type of move.
 * @param moveCount - The current number of moves.
 * @returns The new number of moves.
 */
function pushMove(from: Square, to: Square, fromPiece: Piece, toPiece: Piece, moveType: MoveType, moveCount: number): number {
    if (fromPiece === Piece.WhitePawn || fromPiece === Piece.BlackPawn) {
        if (to >= Square.A8 || to <= Square.H1) {
            const knightPromotion = toPiece === Piece.None ? MoveType.KnightPromotion : MoveType.KnightPromotionCapture;
            moves[depth][moveCount++].setAll(from, to, fromPiece, toPiece, knightPromotion);
            moves[depth][moveCount++].setAll(from, to, fromPiece, toPiece, knightPromotion + 1);
            moves[depth][moveCount++].setAll(from, to, fromPiece, toPiece, knightPromotion + 2);
            moves[depth][moveCount++].setAll(from, to, fromPiece, toPiece, knightPromotion + 3);
            return moveCount;
        }
    }
    moves[depth][moveCount++].setAll(from, to, fromPiece, toPiece, moveType);
    return moveCount;
}
