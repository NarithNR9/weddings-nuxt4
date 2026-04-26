<script setup lang="ts">
const { locale, t } = useI18n();
const { assetUrl } = useDirectus();

const props = defineProps<{
    ceremonies: Ceremony[];
    settings: WeddingSettings;
}>();

const bgUrl = computed(() =>
    assetUrl(props.settings.ceremonies_image || props.settings.hero_image, { width: 1920, quality: 80 }),
);

const day1 = computed(() => props.ceremonies.filter((c) => c.day === 1));
const day2 = computed(() => props.ceremonies.filter((c) => c.day === 2));

const day2DateStr = computed(() => props.settings.wedding_date);

const day1DateStr = computed(() => {
    const [y, m, d] = props.settings.wedding_date.split("-").map(Number);
    const date = new Date(y!, m! - 1, d! - 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
});

const day1Heading = computed(() =>
    locale.value === "km"
        ? `${formatFullDate(day1DateStr.value, "km")}`
        : `Day 1 · ${formatFullDate(day1DateStr.value, "en")}`,
);

const day2Heading = computed(() =>
    locale.value === "km"
        ? `${formatFullDate(day2DateStr.value, "km")}`
        : `Day 2 · ${formatFullDate(day2DateStr.value, "en")}`,
);
</script>

<template>
    <section class="relative py-20 px-2 text-white">
        <!-- Background image -->
        <div
            class="absolute inset-0 bg-cover bg-center md:bg-top bg-fixed"
            :style="{ backgroundImage: `url(${bgUrl})` }"
        />
        <div class="absolute inset-0 bg-black/60" />

        <div class="relative z-10 max-w-xl mx-auto" data-aos="fade-up">
            <h2
                class="font-display text-xl md:text-4xl text-center text-gold-light mb-12"
            >
                {{ t("sections.ceremonies") }}
            </h2>

            <!-- Day 1 -->
            <div v-if="day1.length" class="mb-12">
                <h3
                    class="text-gold-light mb-3 ml-2"
                    style="font-family: var(--font-moulpali)"
                >
                    {{ day1Heading }}
                </h3>
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-lg px-2 md:px-5 py-4 border border-white/10"
                >
                    <div
                        v-for="ceremony in day1"
                        :key="ceremony.id"
                        class="flex gap-2 py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0 text-sm"
                    >
                        <span class="w-2/5">
                            {{ formatTime(ceremony.time, locale) }}
                        </span>
                        <span>:</span>
                        <span class="w-3/5">
                            {{ localized(ceremony, "title", locale) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Day 2 -->
            <div v-if="day2.length">
                <h3
                    class="text-gold-light mb-3 ml-2"
                    style="font-family: var(--font-moulpali)"
                >
                    {{ day2Heading }}
                </h3>
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-lg px-2 md:px-5 py-4 border border-white/10 text-sm"
                >
                    <div
                        v-for="ceremony in day2"
                        :key="ceremony.id"
                        class="flex gap-2 py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0"
                    >
                        <span class="w-2/5 ">
                            {{ formatTime(ceremony.time, locale) }}
                        </span>
                        <span>:</span>

                        <span class="w-3/5">
                            {{ localized(ceremony, "title", locale) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
