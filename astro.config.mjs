import { defineConfig, passthroughImageService } from "astro/config";
import aws from "astro-sst";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [svelte({
    extensions: [".svelte"],
    // NOTE: JSX系列のフレームワークを複数統合するならincludeオプションが必要だが、
    // svelteのような別路線フレームワークなら、includeオプションは不要。
    // むしろincludeオプションを指定するとエラーになる。
  }), react({
    include: ["**/react/*"],
  }), tailwind()],
  image: {
    service: passthroughImageService(),
  },
  output: "server",
  adapter: aws(),
});