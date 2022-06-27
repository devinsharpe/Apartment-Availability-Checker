declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";
      readonly PUBLIC_URL: string;
      readonly API_KEY: string;
      readonly AUTH_DOMAIN: string;
      readonly PROJECT_ID: string;
      readonly STORAGE_BUCKET: string;
      readonly MESSAGING_SENDER_ID: string;
      readonly APP_ID: string;
      readonly TWILIO_ACCOUNT_SID: string;
      readonly TWILIO_AUTH_TOKEN: string;
      readonly TWILIO_PHONE: string;
      readonly TWILIO_TO_PHONE: string;
    }
  }
}

export {};
