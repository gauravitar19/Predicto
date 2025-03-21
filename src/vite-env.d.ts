/// <reference types="vite/client" />
/// <reference path="./types/vite-env.d.ts" />
/// <reference path="./types/declarations.d.ts" />
/// <reference path="./types/react-types.d.ts" />

interface ImportMetaEnv {
  readonly VITE_CRICKET_API_KEY: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
