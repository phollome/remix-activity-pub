import convict from "convict";
import configFormatWithValidator from "convict-format-with-validator";
import dotenv from "dotenv";

convict.addFormat(configFormatWithValidator.url);

dotenv.config({ path: ".env" });

console.log(process.env.BASE_URL);

const schema = {
  database: {
    url: {
      doc: "Database URL",
      format: String,
      default: "",
      env: "DATABASE_URL",
    },
  },
  app: {
    baseURL: {
      doc: "Base URL",
      format: "url",
      default: "http://localhost:3000",
      env: "APP_BASE_URL",
    },
  },
};

const config = convict(schema);

console.log(config.get("app.baseURL"));

config.validate({ allowed: "strict" });

export default config;
