<script setup lang="ts">
const { locale, t } = useI18n()

const props = defineProps<{
  settings: WeddingSettings
}>()

const message = computed(() => localized(props.settings, 'gratitude_message', locale.value))
const groomName = computed(() => localized(props.settings, 'groom_name', locale.value))
const brideName = computed(() => localized(props.settings, 'bride_name', locale.value))
</script>

<template>
  <section class="py-16 px-4 bg-gold-light text-white" data-aos="fade-up">
    <h2 class="font-display text-2xl md:text-4xl text-center mb-9">
      {{ t('sections.gratitude') }}
    </h2>

    <div class="max-w-2xl mx-auto text-center">
      <p class="text-lg md:text-xl leading-relaxed text-white/90 whitespace-pre-line">
        {{ message }}
      </p>
      <p class="mt-8 font-display text-xl">
        {{ groomName }} <br/> &amp; <br/> {{ brideName }}
      </p>
    </div>
  </section>
</template>
