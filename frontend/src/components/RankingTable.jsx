import React, { useEffect, useRef, useState } from "react";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
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
const heads = ["No.", "Name", "Score"];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#222832",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#191f27",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RankingTable = ({ ranks, username }) => {
  const [arrangedRanks, setArrangedRanks] = useState([]);

  useEffect(() => {
    if (ranks) {
      const sortedRanks = [...ranks].sort((a, b) => b.score - a.score);
      const allPlayers = sortedRanks.map((player) =>
        player.name === username ? { ...player, name: "You" } : player
      );
      setArrangedRanks(allPlayers);
    }else{
      setArrangedRanks(initialRanking)
    }
  }, [ranks, username]);
  
  useEffect(() => {
    console.log("arrangedRanks",arrangedRanks)
  }, [arrangedRanks]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: 0,
        boxShadow: "0 0 3px 0px #636467",
        backgroundColor: "transparent",
      }}
    >
      <Table
        sx={{
          color: "#fff",

          "& .MuiTableCell-root": {
            border: 0,
            padding: 1,
            color: "#fff",
            fontSize: 13,
          },
          "& .MuiTableCell-head": {
            background: "#15191f",
            color: "#fff",
          },
        }}
      >
        <TableHead>
          <TableRow>
            {heads.map((h) => (
              <TableCell key={h}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {Boolean(ranks) && (
          <TableBody>
            {arrangedRanks?.map((row, i) => (
              <StyledTableRow key={row.name}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.score >= 0 ? row.score : "-"}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default RankingTable;
