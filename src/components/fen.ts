/**
 * The starting FEN. This is the default FEN that is loaded when the game starts.
 */
export const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
/**
 * Exports the current FEN. The FEN format is a standard notation for describing a particular board position of a chess game.
 * @see https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
 * @param board - The board to export the FEN from.
 * @returns The FEN of the board.
 */
export function exportFen(board: Board): string {
    let fen: string = '';
    // Piece Placement
    for (let rank8 = 0; rank8 < 64; rank8 += 8) {
        let emptyCount = 0;
        for (let file = 0; file < 8; file++) {
            let square = rank8 + file;
            let piece: string | null = board.squares[square].piece;
            if (piece === null) {
                emptyCount++;
                continue;
            } else if (emptyCount !== 0) {
                fen += emptyCount;
                emptyCount = 0;
            }
            fen += piece;
        }
        if (emptyCount !== 0) {
            fen += emptyCount;
        }
        fen += rank8 < 56 ? '/' : ' ';
    }
    // Side to move
    fen += ' ' + board.whiteToMove ? 'w ' : 'b ';
    // Castling ability
    if (board.castlingAbility.every(v => !v)) {
        fen += '-';
    } else {
        let castlingChars: string[] = ['K', 'Q', 'k', 'q'];
        for (let i = 0; i < 4; i++) {
            if (board.castlingAbility[i]) {
                fen += castlingChars[i];
            }
        }
    }
    // En passant target square
    fen += ' ';
    if (board.enPassantTargetSquare === null) {
        fen += '-';
    } else {
        fen += ' ' + 'abcdefgh'[board.enPassantTargetSquare % 8]
        fen += Math.floor(board.enPassantTargetSquare / 8) + 1;
    }
    // Half move clock
    fen += ' ' + board.halfMoveClock;
    // Full move counter
    fen += ' ' + board.fullMoveCounter;

    return fen;
}

/**
 * Imports a FEN and saves it to the board.
 * @see https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
 * @param fen - The FEN to import.
 * @param board - The board to import the FEN to.
 */
export function importFen(fen: string, board: Board): void {
    let fenSplit: string[] = fen.split(' ');
    // Piece placement
    let piecePlacement: string[] = fenSplit[0].split('/');
    const isDigit = /\d/;
    for (let rank = 0; rank < 8; rank++) {
        let rankPieces: string = piecePlacement[rank];
        let file = 0;
        for (let char = 0; char < rankPieces.length; char++) {
            let pieceChar: string = rankPieces[char];
            if (isDigit.test(pieceChar)) {
                for (let numberEmptySquares = Number(pieceChar); numberEmptySquares > 0; numberEmptySquares--) {
                    let square = rank * 8 + file;
                    board.squares[square].piece = null;
                    file++;
                }
            } else {
                let square = rank * 8 + file;
                board.squares[square].piece = pieceChar;
                file++;
            }
        }
    }
    // Side to move
    board.whiteToMove = fenSplit[1] === 'w';
    // Castling availability
    let castlingRights = fenSplit[2];
    board.castlingAbility[0] = castlingRights.includes('K');
    board.castlingAbility[1] = castlingRights.includes('Q');
    board.castlingAbility[2] = castlingRights.includes('k');
    board.castlingAbility[3] = castlingRights.includes('q');
    // En passant target square
    if (fenSplit[3] === '-') {
        board.enPassantTargetSquare = null;
    } else {
        board.enPassantTargetSquare = 'abcdefgh'.indexOf(fenSplit[3][0]) + 8 * Number(fenSplit[3][1]) - 8;
    }
    // Half move clock
    board.halfMoveClock = Number(fenSplit[4]);
    // Full move counter
    board.fullMoveCounter = Number(fenSplit[5]);

    console.log('[UI] imported FEN "' + fen + '".');
}

/**
 * The board interface. This is the interface that is used to store the board state.
 */
export interface Board {
    /**
     * The squares of the board.
     */
    squares: Square[];
    /**
     * Whether it is white's turn to move.
     */
    whiteToMove: boolean;
    /**
     * Whether castling is possible for each side.
     */
    castlingAbility: boolean[];
    /**
     * The square that can be captured en passant.
     */
    enPassantTargetSquare: number | null;
    /**
     * The number of half moves since the last capture or pawn move.
     */
    halfMoveClock: number;
    /**
     * The number of the full moves. It starts at 1, and is incremented after black's move.
     */
    fullMoveCounter: number;
}

/**
 * The square interface. This is the interface that is used to store the square state.
 */
export interface Square {
    /**
     * Whether the square is black.
     */
    isBlack: boolean,
    /**
     * The piece on the square represented by its FEN character or null if it is empty.
     */
    piece: string | null,
    /**
     * The square's ID ranging from 0 to 63.
     */
    id: number
}

export interface GhostPiece {
    piece: string
}