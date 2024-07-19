import React from "react";
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
import { useSelector } from "react-redux";

const heads = ["Name", "Points", "Multiplier"];

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

const RoundTable = ({ players, done }) => {
  const { multiplier } = useSelector((state) => state.game);
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
        {Boolean(players) && (
          <TableBody>
            {players?.map((row) => (
              <StyledTableRow
                key={row.name}
                sx={{
                  "& .MuiTableCell-root": {
                    color:
                      done && row.multiplier > multiplier
                        ? "red"
                        : done && "green",
                  },
                }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.points || "-"}</TableCell>
                <TableCell>{row.multiplier || "-"}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default RoundTable;
