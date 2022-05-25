import React from "react";
import { Chip, Container } from "@mui/material";

export const Rule = ({ data, onRuleDelete }) => {
  return (
    <Container sx={{ p: "5px" }}>
      <Chip label={data.value} onDelete={() => onRuleDelete(data.id)} />
    </Container>
  );
};

export default Rule;
