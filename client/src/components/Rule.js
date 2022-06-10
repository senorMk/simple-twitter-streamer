import React from "react";
import { Chip, Container } from "@mui/material";

export const Rule = ({ rule, onRuleDelete }) => {
  return (
    <Container sx={{ p: "5px" }}>
      <Chip label={rule.value} onDelete={() => onRuleDelete(rule.id)} />
    </Container>
  );
};

export default Rule;
