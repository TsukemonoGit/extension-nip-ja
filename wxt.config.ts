import { defineConfig } from "wxt";
import Solid from "vite-plugin-solid";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    build: {
      target: "esnext",
    },
    plugins: [Solid()],
  }),
  manifest: {
    name: "extension-nips-ja",
    short_name: "nips-ja",
    description: "nostr nips link to nostr-jp",
    permissions: ["storage"],
  },
});
