import { Box } from "@mui/material";
import React from "react";

export const UserValuesCard = ({ value, icon }) => {
  return (
    <Box
      position="relative"
      className="inputCard"
      height={!value ? 45 : "unset"}
      width="100%"
    >
      <Box position="absolute" width={35} top={0} bottom={0}>
        {icon}
      </Box>
      <h3 className="text-center">{value}</h3>
    </Box>
  );
};
