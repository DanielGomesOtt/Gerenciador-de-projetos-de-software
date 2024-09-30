// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      BASE_AVATAR_PATH: process.env.BASE_AVATAR_PATH,
      USER_EMAIL: process.env.USER_EMAIL,
    },
  },
  colorMode: {
    preference: 'no-preference'
  },
  app: {
    head: {
      title: 'Task Life'
    }
  }
})