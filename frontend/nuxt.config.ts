// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      BASE_AVATAR_PATH: process.env.BASE_AVATAR_PATH,
    },
  },
})