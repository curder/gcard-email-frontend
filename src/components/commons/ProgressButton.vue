<template>
    <button class="relative">
        <span :class="{ 'invisible': processing }">
            <slot/>
        </span>

        <span v-if="processing"
              class="absolute"
              style="top: 50%; left: 50%; transform: translate(-50%, -50%)">
            <loader width="32"/>
        </span>
    </button>
</template>

<script>
    import Loader from "./Loader.vue";

    export default {
        components: {
            Loader
        },

        props: {
            processing: {
                type: Boolean,
                default: false
            }
        }
    };
</script>
