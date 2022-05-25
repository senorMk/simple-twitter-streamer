let config = {};

if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";

const IS_PROD = process.env.NODE_ENV === "production";

config.SERVER = IS_PROD
  ? `https://${process.env.REACT_APP_WEB_URL}`
  : `http://localhost:${process.env.REACT_APP_SERVER_PORT}`;

export default config;
