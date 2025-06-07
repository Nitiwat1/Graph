import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  devServer: {
    port: 3311,
  },
  modules: ["@sidebase/nuxt-auth"],
  auth: {
    baseURL: "http://localhost:8000",
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/api/login", method: "post" },
        signOut: { path: "/api/logout", method: "post" },
        getSession: { path: "/api/session", method: "get" },
      },
      token: {
        signInResponseTokenPointer: "/token",
      },
      pages: {
        login: "/login",
      },
    },
    globalAppMiddleware: true,
  },
});
