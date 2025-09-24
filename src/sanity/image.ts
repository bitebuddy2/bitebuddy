import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { projectId, dataset } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image | any) {
  return builder.image(source);
}
