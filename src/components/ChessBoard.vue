<template>
    <div class="board">
        <!-- Loop over the squares array -->
        <div v-for="(square, index) in squares" :key="index"
             :class="[{black: square.isBlack}, 'square']">
            <div v-if="index === 0">
                <img v-for="(ghostPiece, index) in ghostPieces" :key="index"
                     :src="'/' + ghostPiece.piece + '.png'"
                     class="piece ghost-piece" :id="ghostPiece.piece + 'Ghost'" :ref="ghostPiece.piece + 'Ghost'"
                />
            </div>
            <!--
            Load image only if it is not empty
            The images are draggable and call the functions startDrag and onDrop
            -->
            <img v-if="square.piece" :src="'/' + square.piece + '.png'" class="piece"
                 draggable="true" @dragstart="startDrag($event, index)"
                 @drop="onDrop($event, index)"
                 @dragover.prevent @dragenter.prevent
            />
            <div v-else class="piece" @drop="onDrop($event, index)"
                 @dragover.prevent @dragenter.prevent></div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    data() {
        // An array representing the chess board, with a binding to the UI
        const squares: Square[] = [];
        const ghostPieces: GhostPiece[] = [];
        // KQkq
        const castlingAbility: boolean[] = [true, true, true, true];
        return {
            squares,
            ghostPieces,
            castlingAbility,
            enPassantTargetSquare: null as number | null,
            halfMoveClock: 0 as number,
            fullMoveCounter: 1 as number,
            whiteToMove: true as boolean,
            // A string representing the piece which is currently dragged
            draggedPiece: null as string | null
        };
    },
    mounted() {
        this.createBoard();
        this.createGhostPieces();
        this.importFen();
    },
    methods: {
        // Returns the current FEN as a string
        exportFen(): string {
            let fen: string = '';
            // Piece Placement
            for (let rank8 = 0; rank8 < 64; rank8 += 8) {
                let emptyCount = 0;
                for (let file = 0; file < 8; file++) {
                    let square = rank8 + file;
                    let piece: string | null = this.squares[square].piece;
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
            fen += ' ' + this.whiteToMove ? 'w ' : 'b ';
            // Castling ability
            if (this.castlingAbility.every(v => !v)) {
                fen += '-';
            } else {
                let castlingChars: string[] = ['K', 'Q', 'k', 'q'];
                for (let i = 0; i < 4; i++) {
                    if (this.castlingAbility[i]) {
                        fen += castlingChars[i];
                    }
                }
            }
            // En passant target square
            fen += ' ';
            if (this.enPassantTargetSquare === null) {
                fen += '-';
            } else {
                fen += ' ' + 'abcdefgh'[this.enPassantTargetSquare % 8] + (Math.floor(this.enPassantTargetSquare / 8));
            }
            // Half move clock
            fen += ' ' + this.halfMoveClock;
            // Full move counter
            fen += ' ' + this.fullMoveCounter;

            return fen;
        },
        // Imports a FEN and displays it on the UI, defaults to the starting FEN
        importFen(fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
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
                            this.squares[square].piece = null;
                            file++;
                        }
                    } else {
                        let square = rank * 8 + file;
                        this.squares[square].piece = pieceChar;
                        file++;
                    }
                }
            }
            // Side to move
            this.whiteToMove = fenSplit[1] === 'w';
            // Castling availability
            let castlingRights = fenSplit[2];
            this.castlingAbility[0] = castlingRights.includes('K');
            this.castlingAbility[1] = castlingRights.includes('Q');
            this.castlingAbility[2] = castlingRights.includes('k');
            this.castlingAbility[3] = castlingRights.includes('q');
            // En passant target square
            this.enPassantTargetSquare = Number('abcdefgh'.indexOf(fenSplit[3][0])) * 8 + Number(fenSplit[3][1]);
            // Half move clock
            this.halfMoveClock = Number(fenSplit[4]);
            // Full move counter
            this.fullMoveCounter = Number(fenSplit[5]);

            console.log('[UI] imported FEN "' + fen + '".');
        },
        // Executed when the user starts to drag a piece
        startDrag(event: DragEvent, fromSquare: number) {
            if (event.dataTransfer !== null) {
                event.dataTransfer.dropEffect = 'move';
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('fromSquare', fromSquare.toString());
                this.draggedPiece = this.squares[fromSquare].piece;
            }
        },
        // Executed when the user drops a piece on a square
        onDrop(event: DragEvent, toSquare: number) {
            if (this.draggedPiece === null) return;
            if (event.dataTransfer !== null) {
                const fromSquare = Number(event.dataTransfer.getData('fromSquare'));
                this.squares[toSquare].piece = this.draggedPiece;
                this.draggedPiece = null;
                this.squares[fromSquare].piece = null;
            }
        },
        createGhostPieces() {
            const ghostPieces = [];
            const pieces = ['R', 'N', 'B', 'Q', 'K', 'P'];
            for (let i = 0; i < 12; i++) {
                let piece: string | null = null;
                if (i < 6) {
                    piece = pieces[i];
                } else {
                    piece = pieces[i % 6].toLowerCase();
                }
                ghostPieces.push({
                    piece: piece,
                    ref: null
                });
            }
            this.ghostPieces = ghostPieces;
        },
        createBoard() {
            const board: Square[] = [];
            for (let i = 0; i < 64; i++) {
                board.push({
                    isBlack: this.isBlack(i),
                    piece: null,
                    id: i
                });
            }
            this.squares = board;
        },
        // Returns whether a given square has to be coloured black
        isBlack(index: number) {
            const row = Math.floor(index / 8);
            const column = index % 8;
            return row % 2 !== column % 2;
        }
    }
});

interface Square {
    isBlack: boolean,
    piece: string | null,
    id: number
}

interface GhostPiece {
    piece: string
}
</script>

<style scoped>

</style>