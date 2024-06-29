/// <reference types="vite/client" />
/// <reference types="gapi.auth2" />
/// <reference types="gapi.client" />
/// <reference types="gapi.client.sheets" />

interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    readonly VITE_CLIENT_ID: string;
    readonly VITE_SPREADSHEET_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
