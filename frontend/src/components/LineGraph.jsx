import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { Box } from "@mui/material";
import MultiplierLoader from "./MultiplierLoader";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const LineGraph = ({ targetValue, speed, done, setDone }) => {
  const intervalRef = useRef(null);
  const initialData = {
    labels: [0],
    datasets: [
      {
        label: "Multiplier",
        data: [0],
        borderColor: "#fe5e42",
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        animation: {
          duration: 2000 / speed,
          easing: "easeInOutQuad",
        },
      },
    ],
  };

  const [data, setData] = useState(initialData);
  const [start, setStart] = useState(false);
  const maxY = targetValue < 10 ? 10 : targetValue + 10;
  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: 1.2,
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: maxY,
      },
    },
  };

  useEffect(() => {
    setStart(false);
    setDone(false);
  }, [targetValue, speed]);

  useLayoutEffect(() => {
    setData(initialData); // Reset data when component mounts or when start changes

    if (start) {
      let value = 0;
      let time = 0;
      const interval = speed;
      if (value >= targetValue) {
        setDone(true);
      }
      intervalRef.current = setInterval(() => {
        if (value >= targetValue) {
          setDone(true);
          clearInterval(intervalRef.current);
          return;
        }

        value += targetValue / (1000 / interval);
        time += interval;

        setData((prevData) => {
          const newData = [...prevData.datasets[0].data, value];
          const newLabels = [...prevData.labels, time / 1000];
          return {
            labels: newLabels,
            datasets: [
              {
                ...prevData.datasets[0],
                data: newData,
                pointRadius: newData.map((_, index) =>
                  index === newData.length - 1 ? 8 : 0
                ),
                pointBackgroundColor: newData.map((_, index) =>
                  index === newData.length - 1 ? "#ffd400" : "transparent"
                ),
                pointHoverRadius: newData.map((_, index) =>
                  index === newData.length - 1 ? 8 : 0
                ),
              },
            ],
          };
        });
      }, interval);

      return () => clearInterval(intervalRef.current); // Cleanup interval on unmount or when start changes
    } else {
      // Reset to initial data when not started
      setData(initialData);
      setDone(false);
      setStart(true); // Trigger start when ready to load data
    }
  }, [start, targetValue]);

  return (
    <Box position="relative">
      <Box
        position="absolute"
        left="50%"
        top="15%"
        fontSize="4rem"
        fontWeight="800"
      >
        <MultiplierLoader
          multiplier={done ? targetValue : 0}
          duration={done ? 2000 / speed : 0}
        />
      </Box>
      <Line data={done ? data : initialData} options={options} />
    </Box>
  );
};

export default LineGraph;
