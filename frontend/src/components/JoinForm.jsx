import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinGame } from "../redux/features/playerSlice";
import ThemedButton from "./ThemedButton";

export const JoinForm = () => {
  const dispatch = useDispatch();
  const [btnDisable, setBtnDisable] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    if (name && name.length >= 3) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [name]);
  const handleSubmitJoinGame = () => {
    dispatch(joinGame({ name })).then((res) => {
      if (res && res?.payload?.state === "success") {
        const logintime = Date.now();
        localStorage.setItem("logedinAt", logintime);
      }
    });
  };

  return (
    <>
      <Box
        width="100%"
        height="40%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <h2 className="text-[#a2abbd] text-[25px] font-[800]">Welcome</h2>
      </Box>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        maxWidth="80%"
        gap={1}
      >
        <h4 className="text-center mb-1">Please insert your name</h4>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="playerNameInput"
        />
        <ThemedButton
          handleSubmit={handleSubmitJoinGame}
          value={name}
          title="Join"
          disable={btnDisable}
        />
      </Box>
    </>
  );
};
