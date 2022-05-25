import config from "../core/config/config.dev.js";
import util from "util";
import request from "request";

const post = util.promisify(request.post);
const get = util.promisify(request.get);

const tweetsController = {};

tweetsController.getAllStreamRules = async (req, res) => {
  const token = config.bearer_token;

  if (!token) {
    res.status(400).send(config.authMessage);
  }

  const requestConfig = {
    url: config.rulesURL,
    auth: {
      bearer: token,
    },
    json: true,
  };

  try {
    const response = await get(requestConfig);

    if (response.statusCode !== 200) {
      if (response.statusCode === 403) {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.body.error.message);
      }
    }

    res.send(response.body);
  } catch (e) {
    res.send(e);
  }
};

tweetsController.addNewStreamRules = async (req, res) => {
  const token = config.bearer_token;
  if (!token) {
    res.status(400).send(config.authMessage);
  }

  const requestConfig = {
    url: config.rulesURL,
    auth: {
      bearer: token,
    },
    json: req.body,
  };

  try {
    const response = await post(requestConfig);

    if (response.statusCode === 200 || response.statusCode === 201) {
      res.send(response);
    } else {
      throw new Error(response);
    }
  } catch (e) {
    res.send(e);
  }
};

export default tweetsController;
