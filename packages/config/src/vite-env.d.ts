interface ImportMetaEnv {
  readonly VITE_API_HOST?: string;
  readonly VITE_API_PROD_HOST?: string;
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_GOOGLE_MAPS_KEY?: string;
  readonly VITE_AUTH_USE_COOKIES?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
