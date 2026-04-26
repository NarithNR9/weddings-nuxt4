<script setup lang="ts">
const { locale, t } = useI18n();
const { assetUrl } = useDirectus();

const props = defineProps<{
    settings: WeddingSettings;
    guestName?: string;
    opened?: boolean;
}>()

const emit = defineEmits<{ open: [] }>()

const groomName = computed(() =>
    localized(props.settings, "groom_name", locale.value),
);
const groomNameLines = computed(() => {
    const name = groomName.value.trim();
    const firstSpaceIndex = name.search(/\s/);
    if (firstSpaceIndex === -1) return [name];
    return [
        name.slice(0, firstSpaceIndex),
        name.slice(firstSpaceIndex + 1).trimStart(),
    ].filter(Boolean);
});
const brideName = computed(() =>
    localized(props.settings, "bride_name", locale.value),
);
const tagline = computed(() =>
    localized(props.settings, "tagline", locale.value),
);
const venueName = computed(() =>
    localized(props.settings, "venue_name", locale.value),
);
const venueAddress = computed(() =>
    localized(props.settings, "venue_address", locale.value),
);
const heroUrl = computed(() =>
    assetUrl(props.settings.hero_image, { width: 1920, quality: 80 }),
);

const KM_WEEKDAYS = [
    "ថ្ងៃអាទិត្យ",
    "ថ្ងៃច័ន្ទ",
    "ថ្ងៃអង្គារ",
    "ថ្ងៃពុធ",
    "ថ្ងៃព្រហស្បតិ៍",
    "ថ្ងៃសុក្រ",
    "ថ្ងៃសៅរ៍",
];
const KM_MONTHS = [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ",
];


const formattedDate = computed(() => {
    if (!props.settings.wedding_date) return "";
    const date = new Date(props.settings.wedding_date);
    const paddedDay = String(date.getDate()).padStart(2, "0");
    if (locale.value === "km") {
        const weekday = KM_WEEKDAYS[date.getDay()];
        const day = toKhmerDigits(paddedDay);
        const month = KM_MONTHS[date.getMonth()];
        const year = toKhmerDigits(date.getFullYear());
        return `${weekday} ទី ${day} ខែ ${month} ឆ្នាំ ${year}`;
    }
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
    }).format(date);
});

const formattedTime = computed(() => {
    if (!props.settings.wedding_time) return "";
    const [hStr, mStr] = props.settings.wedding_time.split(":");
    const h = parseInt(hStr!, 10);
    const m = parseInt(mStr ?? "0", 10);

    if (locale.value === "km") {
        const period = h < 12 ? "ព្រឹក" : "ល្ងាច";
        const h12 = h % 12 || 12;
        return `${toKhmerDigits(h12)}:${toKhmerDigits(String(m).padStart(2, "0"))} ${period}`;
    }

    const period = h < 12 ? "am" : "pm";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")}${period}`;
});
</script>

<template>
    <section
        class="relative h-screen flex flex-col items-center text-center text-white overflow-hidden"
    >
        <!-- Background image -->
        <div
            class="absolute inset-0 bg-cover bg-center bg-fixed md:bg-position-[center_top_20%]"
            :style="{ backgroundImage: `url(${heroUrl})` }"
        />
        <div class="absolute inset-0 bg-black/40" />

        <!-- Top: wedding invitation title (always shown) -->
        <div class="relative z-10 w-full pt-16 px-4 hero-anim" style="animation-delay: 0.1s">
            <p
                class="text-xl md:text-2xl [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]"
                style="font-family: var(--font-moulpali)"
            >
                {{ t("hero.title") }}
            </p>
        </div>

        <!-- Center: names, hearts, tagline, decorative box -->
        <div
            class="relative z-10 flex-1 flex flex-col items-center justify-end md:justify-center max-md:pb-12"
        >
            <h1
                class="text-4xl md:text-3xl lg:text-6xl [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] hero-anim"
                style="font-family: var(--font-metal); animation-delay: 0.3s"
            >
                <span class="md:hidden">
                    <span
                        v-for="line in groomNameLines"
                        :key="line"
                        class="block"
                        :class="{ 'mb-3': line !== groomNameLines[groomNameLines.length - 1] }"
                    >
                        {{ line }}
                    </span>
                </span>
                <span class="hidden md:inline">{{ groomName }}</span>
            </h1>

            <img
                src="~/assets/images/heart.gif"
                alt=""
                class="h-9 md:h-14 mt-3 mb-9 md:my-1d2 pointer-events-none select-none hero-anim"
                style="animation-delay: 0.5s"
            />

            <h1
                class="text-4xl md:text-3xl lg:text-6xl [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] hero-anim"
                style="font-family: var(--font-metal); animation-delay: 0.7s"
            >
                {{ brideName }}
            </h1>
        </div>

        <!-- Bottom: date, time, address -->
        <div
            class="relative z-10 w-full px-6 pb-16 flex flex-col items-center text-center"
        >
            <p
                class="mt-5 text-sm md:text-xl text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] hero-anim"
                style="font-family: var(--font-moulpali); animation-delay: 0.9s"
            >
                {{ t("hero.greeting") }}
            </p>

            <!-- Decorative frame box: shows guest name if present, otherwise venue name -->
            <div class="relative my-3 w-screen max-w-sm px-3 hero-anim" style="animation-delay: 1.0s">
                <img
                    src="~/assets/images/frame.png"
                    alt=""
                    class="w-full h-14 pointer-events-none select-none"
                />
                <p
                    class="absolute inset-0 font-display flex items-center justify-center text-lg text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
                >
                    {{ guestName ? guestName : $t("hero.valuableGuest") }}
                </p>
            </div>
            <p
                class="md:text-2xl lg:text-3xl font-bold leading-snug [text-shadow:0_2px_6px_rgba(0,0,0,0.6)] hero-anim"
                style="animation-delay: 1.1s"
            >
                {{ formattedDate }} {{ t("hero.at") }} {{ formattedTime }}
            </p>
            <p
                class="mt-2 text-base md:text-lg text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] hero-anim"
                style="animation-delay: 1.2s"
            >
                {{ venueAddress }}
            </p>
        </div>

        <!-- Open invitation button (before opened) -->
        <Transition name="fade">
            <div v-if="!opened" class="relative z-10 pb-10 flex flex-col items-center hero-anim" style="animation-delay: 1.35s">
                <button
                    class="relative px-8 py-3 rounded-full text-white font-semibold text-base cursor-pointer
                           hover:brightness-110 active:scale-95 transition-all duration-200"
                    style="font-family: var(--font-moulpali); background: linear-gradient(to right, #b8860b, #daa520)"
                    @click="emit('open')"
                >
                    <span class="absolute inset-0 rounded-full animate-ping bg-gold/40" />
                    {{ t('hero.open') }}
                </button>
            </div>
        </Transition>

    </section>
</template>

<style scoped>
.hero-anim {
  animation: heroFadeUp 0.7s ease-out both;
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
