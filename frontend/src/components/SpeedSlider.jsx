import React from "react";
import { Slider, Typography } from "@mui/material";
import { Opacity } from "@mui/icons-material";
// Custom styles for the Slider component
const sliderStyle = {
  color: "#777",
  height: 5,
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    background: "linear-gradient(45deg, #e4397e, #ff6500)",
    borderRadius: ".5pc",
  },
};

const SpeedSlider = ({ value, onChange }) => {
  const max = 5;
  return (
    <div>
      <Slider
        aria-labelledby="speed-slider"
        value={value}
        onChange={onChange}
        defaultValue={1}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={max}
        sx={sliderStyle}
        color="warning"
      />
      <div className="flex justify-between text-[12px]">
        {Array.from({ length: max }).map((_, x) => (
          <span key={x}>{x+1}x</span>
        ))}
      </div>
    </div>
  );
};

export default SpeedSlider;
