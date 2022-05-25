import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Tweet from "./Tweet";
import Rule from "./Rule";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";
import socketIOClient from "socket.io-client";
import Config from "../config";
import {
  Box,
  Button,
  Container,
  Stack,
  Divider,
  Typography,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const initialState = {
  tweets: [],
  rules: [],
  error: {},
  isLoadingRules: false,
};

const rulesURL = `${Config.SERVER}/api/v1/tweets/rules`;

const reducer = (state, action) => {
  switch (action.type) {
    case "add_tweet":
      return {
        ...state,
        tweets: [action.payload, ...state.tweets],
        error: null,
        errors: [],
      };
    case "show_error":
      return { ...state, error: action.payload };
    case "add_errors":
      return { ...state, errors: action.payload };
    case "update_waiting":
      return { ...state, error: null };
    case "change_loading_status":
      return { ...state, isLoadingRules: action.payload };
    case "show_rules":
      return { ...state, rules: action.payload, newRule: "" };
    case "add_rule":
      if (state.rules) {
        return {
          ...state,
          rules: [...state.rules, ...action.payload],
          newRule: "",
          errors: [],
        };
      }
      return {
        ...state,
        newRule: "",
        errors: [],
      };
    case "delete_all_tweets":
      return { ...state, tweets: [] };
    case "delete_rule":
      return {
        ...state,
        rules: [...state.rules.filter((rule) => rule.id !== action.payload)],
      };
    case "rule_changed":
      return { ...state, newRule: action.payload };
    default:
      return state;
  }
};

const TweetFeed = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tweets, error } = state;
  const [keyword, setkeyword] = useState("");

  const handleKeywordChange = (event) => {
    setkeyword(event.target.value);
  };

  const handleStartWatching = async () => {
    if (keyword.length > 0) {
      await createRule();
    }
  };

  const streamTweets = () => {
    let socket;

    socket = socketIOClient(`${Config.SERVER}/`);

    socket.on("connected", () => {});
    socket.on("tweet", (json) => {
      if (json.data) {
        dispatch({ type: "add_tweet", payload: json });
      }
    });
    socket.on("heartbeat", (data) => {
      dispatch({ type: "update_waiting" });
    });
    socket.on("error", (data) => {
      dispatch({ type: "show_error", payload: data });
    });
    socket.on("authError", (data) => {
      dispatch({ type: "add_errors", payload: [data] });
    });
  };

  const reconnectSpinner = () => {
    if (error && error.detail) {
      return <Spinner />;
    }
  };

  const createRule = async () => {
    const payload = { add: [{ value: keyword }] };

    dispatch({ type: "change_loading_status", payload: true });
    try {
      const response = await axios.post(rulesURL, payload);

      if (response.data.body.errors)
        dispatch({ type: "add_errors", payload: response.data.body.errors });
      else {
        dispatch({ type: "add_rule", payload: response.data.body.data });
      }
      dispatch({ type: "change_loading_status", payload: false });
    } catch (e) {
      dispatch({
        type: "add_errors",
        payload: [{ detail: e.message }],
      });
      dispatch({ type: "change_loading_status", payload: false });
    }
  };

  const deleteRule = async (id) => {
    const payload = { delete: { ids: [id] } };
    dispatch({ type: "change_loading_status", payload: true });
    await axios.post(rulesURL, payload);
    dispatch({ type: "delete_rule", payload: id });
    dispatch({ type: "change_loading_status", payload: false });
  };

  useEffect(() => {
    streamTweets();
  }, []);

  useEffect(() => {
    (async () => {
      dispatch({ type: "change_loading_status", payload: true });

      try {
        const response = await axios.get(rulesURL);
        dispatch({
          type: "show_rules",
          payload: response.data.data,
        });
      } catch (e) {
        dispatch({ type: "add_errors", payload: [e.response.data] });
      }
      dispatch({ type: "change_loading_status", payload: false });
    })();
  }, []);

  const errors = () => {
    const { errors } = state;

    if (errors && errors.length > 0) {
      return errors.map((error) => (
        <ErrorMessage key={error.title} error={error} styleType="negative" />
      ));
    }
  };

  const rules = () => {
    const { isLoadingRules, rules } = state;

    if (!isLoadingRules) {
      if (rules && rules.length > 0) {
        return rules.map((rule) => (
          <Rule
            key={rule.id}
            data={rule}
            onRuleDelete={(id) => deleteRule(id)}
          />
        ));
      } else {
        return (
          <Container>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <SearchIcon sx={{ fontSize: "30px" }} />
              <Typography variant="h6">No Keywords Added</Typography>
            </Box>
          </Container>
        );
      }
    } else {
      return (
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Spinner />
          </Box>
        </Container>
      );
    }
  };

  const showTweets = () => {
    if (tweets.length > 0) {
      return (
        <React.Fragment>
          {tweets.map((tweet) => (
            <Tweet key={tweet.data.id} json={tweet} />
          ))}
        </React.Fragment>
      );
    }
  };

  return (
    <Container sx={{ mt: "20px" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {reconnectSpinner()}
      </Box>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        sx={{ marginTop: "20px" }}
      >
        <Container>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch({ type: "delete_all_tweets" });
              }}
            >
              Delete
            </Button>
            <Typography variant="p" color="initial" marginLeft="10px">
              {tweets.length} Tweets
            </Typography>
          </Box>
          {showTweets()}
        </Container>
        <Container>
          <Typography variant="h5">Step 1: Enter a keyword:</Typography>
          <TextField
            id="stream-rules"
            label="Keyword"
            fullWidth
            value={keyword}
            onChange={handleKeywordChange}
            variant="filled"
            sx={{
              marginTop: "10px",
            }}
          />
          <Box
            sx={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Button variant="contained" onClick={handleStartWatching}>
              Start Watching
            </Button>
          </Box>
          <Typography variant="h5">Keywords:</Typography>
          {errors()}
          {rules()}
        </Container>
      </Stack>
    </Container>
  );
};

export default TweetFeed;
