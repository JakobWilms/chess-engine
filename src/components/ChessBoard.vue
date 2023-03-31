<template>
    <div class="board">
        <!-- Loop over the squares array -->
        <div v-for="(square, index) in board.squares" :key="index"
             :class="[{black: square.isBlack}, 'square']">
            <div v-if="index === 0">
                <img v-for="(ghostPiece, index) in ghostPieces" :key="index"
                     alt="ghostPiece"
                     :src="'/' + ghostPiece.piece + '.png'"
                     class="piece ghost-piece" :id="ghostPiece.piece + 'Ghost'" :ref="ghostPiece.piece + 'Ghost'"
                 />
            </div>
            <!--
            Load image only if it is not empty
            The images are draggable and call the functions startDrag and onDrop
            -->
            <img v-if="square.piece"
                    alt="piece"
                 :src="'/' + square.piece + '.png'" class="piece"
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
import {defineComponent} from 'vue';
import {importFen, exportFen, Board, startingFen, Square, GhostPiece} from "./fen";

export default defineComponent({
    name: 'ChessBoard',
    props: {
        fen: {required: true, type: String}
    },
    data() {
        const ghostPieces: GhostPiece[] = [];
        return {
            board: {
                squares: [],
                castlingAbility: [true, true, true, true],
                enPassantTargetSquare: null,
                halfMoveClock: 0,
                fullMoveCounter: 1,
                whiteToMove: true,
            } as Board,
            ghostPieces,
            // A string representing the piece which is currently dragged
            draggedPiece: null as string | null,
            localFen: this.fen
        };
    },
    watch: {
        /**
         * When the fen prop changes, update the board
         * @param newVal The new value of the fen prop
         * @param oldVal The old value of the fen prop
         */
        fen(newVal, oldVal): void {
            this.localFen = newVal;
            importFen(newVal, this.board);
        }
    },
    mounted() {
        this.createBoard();
        this.createGhostPieces();
        importFen(startingFen, this.board);
    },
    methods: {
        /**
         * Executed when the user starts to drag a piece.
         * @param event The drag event
         * @param fromSquare The square from which the piece is dragged
         */
        startDrag(event: DragEvent, fromSquare: number): void {
            if (event.dataTransfer !== null) {
                event.dataTransfer.dropEffect = 'move';
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('fromSquare', fromSquare.toString());
                this.draggedPiece = this.board.squares[fromSquare].piece;
            }
        },
        /**
         * Executed when the user drops a piece on a square.
         * @param event The drag event
         * @param toSquare The square on which the piece is dropped
         */
        onDrop(event: DragEvent, toSquare: number) {
            if (this.draggedPiece === null) return;
            if (event.dataTransfer !== null) {
                const fromSquare = Number(event.dataTransfer.getData('fromSquare'));
                this.board.squares[toSquare].piece = this.draggedPiece;
                this.draggedPiece = null;
                this.board.squares[fromSquare].piece = null;
                this.localFen = exportFen(this.board);
                this.$emit('update-fen', this.localFen);
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
        /**
         * Creates the board and fills it with squares.
         */
        createBoard(): void {
            const board: Square[] = [];
            for (let i = 0; i < 64; i++) {
                board.push({
                    isBlack: this.isBlack(i),
                    piece: null,
                    id: i
                });
            }
            this.board.squares = board;
        },
        /**
         * Determines whether a square has to be coloured black.
         * @param index The index of the square
         * @returns True if the square has to be coloured black, false otherwise
         */
        isBlack(index: number): boolean {
            const row = Math.floor(index / 8);
            const column = index % 8;
            return row % 2 !== column % 2;
        }
    }
});
</script>

<style scoped>

</style>