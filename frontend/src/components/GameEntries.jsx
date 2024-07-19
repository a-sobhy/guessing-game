import { Box, CircularProgress, Slider, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ThemedButton from "./ThemedButton";
import { useDispatch } from "react-redux";
import { getResults, startRound } from "../redux/features/gameSlice";
import CounterValueInput from "./CounterValueInput";
import SpeedSlider from "./SpeedSlider";
import { ReactComponent as SpeedIcon } from "./Icons/speed.svg";
import { ReactComponent as CupIcon } from "./Icons/achievementcup.svg";
import SectionTitle from "./SectionTitle";
import RoundTable from "./RoundTable";

const GameEntries = ({
  setSpeed,
  userId,
  gameId,
  done,
  players,
  setPlayers,
  points,
  setPoints,
  setRanks,
}) => {
  const dispatch = useDispatch();
  const previousRoundInfoRef = useRef(null);
  const roundInfo = JSON.parse(localStorage.getItem("roundInfo"));

  const [multiPlier, setMultiPlier] = useState(1.0);
  useEffect(() => {
    if (
      roundInfo &&
      roundInfo.players &&
      JSON.stringify(roundInfo.players) !==
        JSON.stringify(previousRoundInfoRef.current?.players)
    ) {
      const allPlayers = roundInfo.players.map((player) =>
        player._id === userId
          ? { ...player, name: "You", multiplier: multiPlier }
          : player
      );

      setPlayers(allPlayers);

      const updatedRoundInfo = { ...roundInfo, players: allPlayers };
      localStorage.setItem("roundInfo", JSON.stringify(updatedRoundInfo));

      previousRoundInfoRef.current = updatedRoundInfo;
    }
  }, [roundInfo]);
  useEffect(() => {
    if (done && gameId) {
      dispatch(getResults({ roundId: gameId })).then((res) => {
        if (res && res?.payload?.players) {
          setRanks(res?.payload?.players);
        }
      });
    }
  }, [done]);
  const handleSubmitValues = () => {
    localStorage.setItem("roundResults", JSON.stringify([]));
    dispatch(startRound({ multiplier: multiPlier, points, userId, gameId }));
  };
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={2}>
        <CounterValueInput
          value={points}
          setValue={setPoints}
          indicator={25}
          min={50}
        />
        <CounterValueInput
          value={multiPlier}
          setValue={setMultiPlier}
          indicator={0.25}
          min={1}
        />
      </Box>
      <ThemedButton
        handleSubmit={handleSubmitValues}
        value={points}
        title={
          done ? (
            "Start"
          ) : (
            <>
              <CircularProgress size={15} color="warning" /> Started
            </>
          )
        }
        disable={!done}
      />
      <Box>
        <SectionTitle icon={<CupIcon />} title="Current Round" />
        <RoundTable players={players} done={done} />
      </Box>
      <Box>
        <SectionTitle icon={<SpeedIcon />} title="Speed" />
        <Box className="lightcontainer" paddingY={1} paddingX={2}>
          <SpeedSlider
            aria-label="Speed"
            defaultValue={1}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={5}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GameEntries;
