<script setup lang="ts">
import ChessBoard from './components/ChessBoard.vue';
import FenField from './components/FenField.vue';
</script>
<template>
    <div id="main" class="container fullscreen">
        <div id="left" class="side container">
            <div>

            </div>
            <div class="fen-field-wrapper container">
                <FenField :fen="fieldFen" @update-fen="updateBoardFen"/>
            </div>
            <div>

            </div>
        </div>
        <div id="middle" class="middle">
            <ChessBoard :fen="boardFen" @update-fen="updateFieldFen"/>
        </div>
        <div id="right" class="side container">

        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    data() {
        return {
            boardFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' as string,
            fieldFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' as string,
        }
    },
    methods: {
        updateBoardFen(newFen: string) {
            this.boardFen = newFen;
        },
        updateFieldFen(newFen: string) {
            this.fieldFen = newFen;
        }
    }
});
</script>


<style scoped>

</style>