import type { MetadataRoute } from "next";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

/** Lets HomeCook be installed like an app, which also gives order alerts its icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: APP_TAGLINE,
    start_url: "/cook",
    display: "standalone",
    background_color: "#f2e8cf",
    theme_color: "#2faca1",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
