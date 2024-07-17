import express from "express";
import { PlayerModel } from "../models/playerModel.js";
import { GameBoardModel } from "../models/gameBoardModel.js";

const router = express.Router();

// Player Registration route
router.post("/register", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    const existingUser = await PlayerModel.findOne({ name });
    if (existingUser) {
      return res.status(400).send({ message: "Username is already taken" });
    }

    const newUser = new PlayerModel({ name, points: 1000 }); // Initialize with 1000 points
    const createUser = await newUser.save();

    const generateRandomPlayer = () => {
      const randomName = `Player${Math.floor(Math.random() * 10000)}`;
      return {
        name: randomName,
        points: Math.floor(Math.random() * 999) + 1, // Assign random points between 0 and 1000
        multiplier: Math.floor(Math.random() * 999) + 1, // Assign random multiplier between 0 and 10
      };
    };

    // Create 4 random players
    const randomPlayers = Array.from({ length: 4 }, () =>
      generateRandomPlayer()
    );

    // Save the random players to the database
    const savedPlayers = await PlayerModel.insertMany(randomPlayers);

    const allPlayers = [
      createUser._id,
      ...savedPlayers.map((player) => player._id),
    ];

    const newGameState = new GameBoardModel({
      multiplier: 0, // Assign a random multiplier for the game board
      isRunning: false,
      initialPoints: 0,
      players: allPlayers,
    });

    await newGameState.save();

    return res.status(200).json({
      message: "User and random players created successfully",
      user: createUser,
      randomPlayers: savedPlayers,
      game: newGameState,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Start round route
router.post("/start-round", async (req, res) => {
  try {
    const { userId, points, multiplier, gameId } = req.body;

    const randomMultiplier = Math.floor(Math.random() * 999) + 1;
    const actualPlayer = await PlayerModel.findById(userId);
    const currentGame = await GameBoardModel.findById(gameId);
    if (!actualPlayer) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!currentGame) {
      return res.status(404).send({ message: "Game not found" });
    }

    actualPlayer.points = points;
    actualPlayer.multiplier = multiplier;
    await actualPlayer.save();
    currentGame.multiplier = randomMultiplier;

    await currentGame.save();

    res.status(201).json({ game: currentGame, player: actualPlayer });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Result
router.post("/calculate-results", async (req, res) => {
  try {
    const { roundId } = req.body;

    const round = await GameBoardModel.findById(roundId).populate("players");
    if (!round) {
      return res.status(404).send({ message: "Round not found" });
    }

    for (const player of round.players) {
      if (player.multiplier <= round.multiplier) {
        player.gained += player.points * player.multiplier;
      } else {
        player.points = 0;
      }
      await player.save();
    }

    round.isRunning = false;
    await round.save();

    res.status(200).json(round);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
