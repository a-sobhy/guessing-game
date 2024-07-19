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
      const findExistingUser = await PlayerModel.findOne({ name });
      return res.status(201).send({
        message: "Username is existing",
        user: findExistingUser,
        state: "success",
      });
    }

    const newUser = new PlayerModel({ name, gained: 1000 }); // Initialize with 1000 points
    const createUser = await newUser.save();

    return res.status(200).json({
      message: "Player created successfully",
      user: createUser,
      state: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Game initiator route
router.post("/initiate-round", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const existingUser = await PlayerModel.findById(userId);
    if (!existingUser) {
      return res.status(401).send({ message: "Username is not existing" });
    }

    const generateRandomPlayer = () => {
      const randomName = `Player${Math.floor(Math.random() * 10000)}`;
      return {
        name: randomName,
        gained: 1000,
      };
    };

    // Create 4 random players
    const randomPlayers = Array.from({ length: 4 }, () =>
      generateRandomPlayer()
    );

    // Save the random players to the database
    const savedPlayers = await PlayerModel.insertMany(randomPlayers);

    const allPlayers = [
      existingUser._id,
      ...savedPlayers.map((player) => player._id),
    ];

    const newGameState = new GameBoardModel({
      multiplier: 0,
      isRunning: false,
      initialPoints: 0,
      players: allPlayers,
    });

    await newGameState.save();

    return res.status(200).json({
      message: "Random players created successfully",
      userId: existingUser._id,
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
    currentGame.multiplier = randomMultiplier;

    const gameplayers = currentGame.players;
    const filteredPlayers = gameplayers.filter(
      (player) => !player.equals(actualPlayer._id)
    );

    async function updatePlayers(players) {
      const playerPromises = players.map(async (p) => {
        const player = await PlayerModel.findById(p);
        if (player) {
          const randomPlayersPoints = Math.floor(Math.random() * 999) + 1;
          const randomPlayersMultiplier = Math.floor(Math.random() * 999) + 1;
          player.points = randomPlayersPoints;
          player.multiplier = randomPlayersMultiplier;
          await player.save();
        }
      });

      await Promise.all(playerPromises);
      await actualPlayer.save();
    }
    updatePlayers(filteredPlayers)
      .then(() => {
        console.log("Players updated successfully.");
      })
      .catch((err) => {
        console.error("Error updating players:", err);
      });
    const playersValues = await Promise.all(
      gameplayers.map(async (p) => {
        const player = await PlayerModel.findById(p);
        return player;
      })
    );
    await currentGame.save();

    res.status(201).json({
      status: "success",
      gameId: currentGame._id,
      gameMultiplier: currentGame.multiplier,
      players: playersValues,
    });
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
    await Promise.all(
      round.players.map(async (player) => {
        if (player.multiplier <= round.multiplier) {
          player.score = player.points * player.multiplier;
          player.gained += player.score;
        } else {
          player.score = 0;
          player.gained -= player.points;
        }
        await player.save();
      })
    );

    await round.save();
    res.status(200).json(round);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});


export default router;
