/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** When embedding in an iframe on another domain, set this to the parent page URL so shares point there (e.g. https://yourdomain.com/trust). */
  readonly VITE_SHARE_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
