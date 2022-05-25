import React from "react";
import { Tweet } from "react-twitter-widgets";

const OneTweet = ({ json }) => {
  const { id } = json.data;

  return <Tweet tweetId={id} />;
};

export default OneTweet;
