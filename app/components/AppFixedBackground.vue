<script setup lang="ts">
const props = withDefaults(defineProps<{
    imageUrl: string;
    position?: string;
    desktopPosition?: string;
}>(), {
    position: "center",
});

const backgroundStyle = computed(() => ({
    "--fixed-bg-image": `url(${props.imageUrl})`,
    "--fixed-bg-position": props.position,
    "--fixed-bg-position-md": props.desktopPosition ?? props.position,
}));
</script>

<template>
    <div
        class="fixed-bg-layer"
        :style="backgroundStyle"
        aria-hidden="true"
    />
</template>
