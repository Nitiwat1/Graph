<template>
    <div>
    </div>
</template>

<script setup>
import { navigateTo } from '#app';

if (process.client) {
    await navigateTo('/login', { replace: true });
}
</script>