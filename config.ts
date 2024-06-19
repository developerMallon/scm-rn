
// PUBLIC_STATUS define se o sistema estará em DEVELOPMENT ou PRODUCTION
export const config = {
    PUBLIC_STATUS: "PRODUCTION",
    API_URL_SCM_DEVELOPMENT: "http://192.168.0.116:8000",
    API_URL_SCM_PRODUCTION: "https://scm-api.mallon.click"
  } as const;
  
  export type Config = typeof config;
