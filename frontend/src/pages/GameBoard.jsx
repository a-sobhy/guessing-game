import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initiateRound } from "../redux/features/playerSlice";
import { Box } from "@mui/material";
import { JoinForm } from "../components/JoinForm";
import LineGraph from "../components/LineGraph";
import GameEntries from "../components/GameEntries";
import { UserValuesCard } from "../components/UserValuesCard";
import { ReactComponent as UserIcon } from "../components/Icons/person-1.svg";
import { ReactComponent as LogedinUserIcon } from "../components/Icons/person-2.svg";
import { ReactComponent as BadgeIcon } from "../components/Icons/badge-medal.svg";
import SectionTitle from "../components/SectionTitle";
import RankingTable from "../components/RankingTable";
import { Chats } from "../components/Chats";

const initialRanking = [
  {
    name: "-",
    score: "-",
  },
  {
    name: "-",
    score: "-",
  },
  {
    name: "-",
    score: "-",
  },
  {
    name: "-",
    score: "-",
  },
  {
    name: "-",
    score: "-",
  },
];
export const JoinGame = () => {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const loginTime = localStorage.getItem("logedinAt");
  const logintimeDate = new Date(parseInt(loginTime, 10));
  const formattedTime = logintimeDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const game = JSON.parse(localStorage.getItem("gameInfo"));
  const results = JSON.parse(localStorage.getItem("roundResults"));

  const { status } = useSelector((state) => state.player);
  const { multiplier } = useSelector((state) => state.game);
  const [speed, setSpeed] = useState(1);
  const [multiplierValue, setMultiplierValue] = useState(0);
  const [players, setPlayers] = useState([]);
  const [gameId, setGameId] = useState("");
  const [done, setDone] = useState(false);
  const [points, setPoints] = useState(50);
  const [ranks, setRanks] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (game && !(players?.length > 0)) {
      const modifiedUser = { ...user, name: "You", points: 0 };
      const allPlayers = [modifiedUser, ...game.randomPlayers];
      setPlayers(allPlayers);
    }
  }, [game, players]);

  useEffect(() => {
    if (multiplier) {
      setMultiplierValue(multiplier);
    }
  }, [multiplier]);

  useEffect(() => {
    if (game && !Boolean(gameId)) {
      setGameId(game.game._id);
    }
  }, [game, gameId]);
  useEffect(() => {
    if (Boolean(status) && status === "success") {
      dispatch(initiateRound({ userId: user._id }));
    }
  }, [status]);

  useEffect(() => {
    console.log("game board ranks", ranks);
  }, [ranks]);

  return (
    <>
      <Box display="flex" gap={2}>
        <Box width="25%">
          {user && game ? (
            <>
              <GameEntries
                userId={user._id}
                gameId={gameId}
                setSpeed={setSpeed}
                done={done}
                players={players}
                setPlayers={setPlayers}
                points={points}
                setPoints={setPoints}
                setRanks={setRanks}
              />
            </>
          ) : (
            <Box
              className="lightcontainer"
              display="flex"
              flexDirection="column"
              alignItems="center"
              height="100%"
            >
              <JoinForm />
            </Box>
          )}
        </Box>
        <Box width="75%" display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <UserValuesCard
              value={user ? user.gained - points : ""}
              icon={<BadgeIcon />}
            />
            <UserValuesCard
              value={user ? user.name : ""}
              icon={user ? <LogedinUserIcon /> : <UserIcon />}
            />
            <UserValuesCard
              value={user ? formattedTime : ""}
              icon={user ? <LogedinUserIcon /> : <UserIcon />}
            />
          </Box>
          <Box className="lightcontainer">
            <LineGraph
              targetValue={multiplierValue}
              speed={speed}
              chartID="gameBoard"
              done={done}
              setDone={setDone}
            />
          </Box>
        </Box>
      </Box>
      <Box display="flex" gap={2} marginY={2}>
        <Box width="50%">
          <SectionTitle title="Ranking" icon={<BadgeIcon />} />
          <RankingTable ranks={ranks} username={user.name} />
        </Box>
        <Box width="50%">
          <SectionTitle title="Chats" icon={<BadgeIcon />} />
          <Chats players={game.randomPlayers} />
        </Box>
      </Box>
      <br />
      <br />
    </>
  );
};
