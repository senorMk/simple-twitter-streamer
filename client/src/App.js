import React from "react";
import { Routes, Route } from "react-router-dom";
import TweetFeed from "./components/TweetFeed";
import { Box, Typography, Container, Avatar } from "@mui/material";

const App = () => {
  return (
    <Container>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar alt="Twitter Logo" src="/Twitter_Logo_Blue.png" />
        <Typography variant="h1" sx={{ fontSize: 40 }}>
          Real Time Tweet Streamer
        </Typography>
        <Typography variant="h2" sx={{ fontSize: 20 }}>
          Powered by Twitter data...
        </Typography>
      </Box>
      <Box>
        <Routes>
          <Route exact path="/" element={<TweetFeed />} />
        </Routes>
      </Box>
    </Container>
  );
};

export default App;
