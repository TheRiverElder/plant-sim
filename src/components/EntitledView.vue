<template>
    <div>
        <p>{{ title }}</p>

        <slot/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        title: String,
    },
})
</script>