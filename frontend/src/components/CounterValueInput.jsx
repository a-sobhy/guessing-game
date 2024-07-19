import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import {
  Add,
  ArrowDropDownRounded,
  ArrowDropUpRounded,
  Remove,
} from "@mui/icons-material";

const CounterValueInput = ({ value, setValue, indicator, min }) => {
  const handleChangeNumber = (oper) => {
    let newValue;

    if (oper === "add") {
      newValue = Number(value + indicator);
    } else if (oper === "remove") {
      newValue = Math.max(min, Number(value - indicator));
    }

    setValue(newValue);
  };
  const handleValueChange = (e) => {
    const targVal = e.target.value;
    if (targVal) {
      const newValue = targVal.replace(/[^\d]/g, "");
      setValue(newValue);
    } else {
      setValue(min);
    }
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={1}
      className="inputCard w-full"
    >
      <Typography
        className="operatorBtn"
        component="button"
        onClick={() => handleChangeNumber("remove")}
      >
        <ArrowDropDownRounded fontSize="medium" />
      </Typography>
      <TextField
        value={value}
        inputProps={{
          pattern: "[0-9]*",
        }}
        onChange={handleValueChange}
        sx={{
          width: "80px",
          "& input": {
            background: "#101418",
            padding: "3px",
            textAlign: "center",
            fontSize: "16px",
            color: "#fff",
            fontWeight: 600,
            borderRadius: ".4pc",
          },
        }}
      />

      <Typography
        className="operatorBtn"
        component="button"
        onClick={() => handleChangeNumber("add")}
      >
        <ArrowDropUpRounded fontSize="medium" />
      </Typography>
    </Box>
  );
};

export default CounterValueInput;
