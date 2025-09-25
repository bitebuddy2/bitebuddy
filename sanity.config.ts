import {defineConfig} from "sanity";
import {deskTool} from "sanity/desk";
import {visionTool} from "@sanity/vision";
import {apiVersion, dataset, projectId} from "./src/sanity/env";
import {schemaTypes} from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Bite Buddy Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [deskTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
});
