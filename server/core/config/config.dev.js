import dotenv from "dotenv/config";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

let config = {};

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}
config.isProduction = process.env.NODE_ENV === "production";

const __dirname = dirname(fileURLToPath(import.meta.url));
config.logFileDir = path.join(__dirname, "../../log");
config.logFileName = "app.log";
config.dbUser = process.env.dbUser;
config.dbHost = process.env.dbHost;
config.dbPass = process.env.dbPass;
config.dbPort = process.env.dbPort;
config.dbName = process.env.dbName;
config.dbConnectUrl = `mongodb+srv://${config.dbUser}:${config.dbPass}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;
config.serverPort = process.env.serverPort;
config.frontDir = path.resolve(
  path.join(__dirname, "../../../client/build/index.html")
);
config.rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
config.streamURL =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id";
config.authMessage = {
  title: "Could not authenticate",
  details: [`Please make sure your authentication is setup correctly.`],
  type: "https://developer.twitter.com/en/docs/authentication",
};
config.bearer_token = process.env.TWITTER_BEARER_TOKEN;

export default config;
