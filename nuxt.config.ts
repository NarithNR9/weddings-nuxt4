import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  devServer: {
      port: 3000,
      host: '0.0.0.0',
  },
  
  modules: ['@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [...(tailwindcss() as any)],
  },

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Battambang:wght@300;400;700&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Moul&family=Moulpali&family=Taprom&family=Fasthand&family=Metal&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
        },
      ],
    },
  },

  i18n: {
    locales: [
      { code: 'km', name: 'ខ្មែរ', file: 'km.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'km',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    langDir: '../i18n/locales',
  },

  runtimeConfig: {
    public: {
      directusUrl: '',
      directusToken: '',
      directusCeremoniesCollection: 'ceremonies1',
      directusGalleryCollection: 'gallery_items1',
      directusGuestsCollection: 'guests1',
      directusWeddingSettingsIndex: 1,
    },
  },
})
