import { Box } from "@mui/material";
import React from "react";

const SectionTitle = ({ icon, title }) => {
  return (
    <Box display="flex" alignItems="center" gap="5px" marginBottom={1}>
      <Box width={25}>{icon}</Box>
      <h3>{title}</h3>
    </Box>
  );
};

export default SectionTitle;
