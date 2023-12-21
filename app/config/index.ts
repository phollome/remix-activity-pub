import convict from "convict";
import configFormatWithValidator from "convict-format-with-validator";
import dotenv from "dotenv";

convict.addFormat(configFormatWithValidator.url);

dotenv.config({ path: ".env" });

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
      default: "",
      env: "BASE_URL",
    },
  },
};

const config = convict(schema);

config.validate({ allowed: "strict" });

export default config;
