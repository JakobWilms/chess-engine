<template>
    <div class="max-size container">
        <textarea id="fen-field" v-model.trim="localFen" @keydown="preventNewlines" @focusout="updateFen"
                  autocomplete="off" autocapitalize="off" spellcheck="false"
        />
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'FenField',
    props: {
        fen: {required: true, type: String}
    },
    watch: {
        fen(newVal) {
            this.localFen = newVal;
        }
    },
    data() {
        return {
            localFen: this.fen
        }
    },
    methods: {
        updateFen() {
            this.$emit('update-fen', this.localFen);
        },
        preventNewlines(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.updateFen();
            }
        }
    }
});
</script>

<style scoped>

</style>