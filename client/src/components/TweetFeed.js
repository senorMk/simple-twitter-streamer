import React, { useState, useEffect } from "react";
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

const rulesURL = `${Config.SERVER}/api/v1/tweets/rules`;

const TweetFeed = () => {
  const [keyword, setkeyword] = useState("");
  const [isLoadingRules, setLoadingRules] = useState(false);
  const [rules, setRules] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState({});

  const handleKeywordChange = (event) => {
    setkeyword(event.target.value);
  };

  const handleStartWatching = async () => {
    if (keyword.length > 0) {
      createRule();
    }
  };

  const streamTweets = () => {
    let socket;

    socket = socketIOClient(`${Config.SERVER}/`);

    socket.on("connected", () => {});
    socket.on("tweet", (json) => {
      if (json.data) {
        setTweets((tweets) => [...tweets, json]);
      }
    });
    socket.on("heartbeat", (data) => {
      setError(null);
    });
    socket.on("error", (data) => {
      setError(data);
    });
    socket.on("authError", (data) => {
      setErrors([data]);
    });
  };

  const reconnectSpinner = () => {
    if (error && error.detail) {
      return <Spinner />;
    }
  };

  const createRule = async () => {
    const payload = { add: [{ value: keyword }] };

    setLoadingRules(true);
    try {
      const response = await axios.post(rulesURL, payload);

      if (response.data.body.errors) {
        setErrors([response.data.body.errors]);
      } else {
        if (rules && rules.length > 0) {
          setRules((rules) => [...rules, response.data.body.data]);
        } else {
          setRules(response.data.body.data);
        }
      }
      setLoadingRules(false);
    } catch (e) {
      setErrors([{ detail: e.message }]);
      setLoadingRules(false);
    }
  };

  const deleteRule = async (id) => {
    const payload = { delete: { ids: [id] } };
    setLoadingRules(true);

    await axios.post(rulesURL, payload);

    setRules([...rules.filter((rule) => rule.id !== id)]);

    setLoadingRules(false);
  };

  useEffect(() => {
    streamTweets();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingRules(true);

      try {
        const response = await axios.get(rulesURL);
        const FoundRules = response.data.data;
        if (FoundRules) {
          setRules(response.data.data);
        }
      } catch (e) {
        setErrors([e.response.data]);
      }
      setLoadingRules(false);
    })();
  }, []);

  const showErrors = () => {
    if (errors && errors.length > 0) {
      return errors.map((error) => (
        <ErrorMessage key={error.title} error={error} styleType="negative" />
      ));
    }
  };

  const showRules = () => {
    if (!isLoadingRules) {
      if (rules && rules.length > 0) {
        return rules.map((rule) => (
          <Rule
            key={rule.id}
            rule={rule}
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
                setTweets([]);
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
          {showErrors()}
          {showRules()}
        </Container>
      </Stack>
    </Container>
  );
};

export default TweetFeed;
