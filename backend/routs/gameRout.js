import e from "express";
import { PlayerModel } from "../models/playerModel.js";
import { GameBoardModel } from "../models/gameBoardModel.js";
const router = e.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Kindly enter the username" });
    }
    if (!email) {
      return res.status(400).send({ message: "Kindly enter the email" });
    }
    if (!password) {
      return res.status(400).send({ message: "Kindly enter the password" });
    }
    const existingUser = await PlayerModel.findOne({ name });
    if (existingUser) {
      return res.status(400).send({ message: "Username is already taken" });
    }

    const newUser = {
      name,
      email,
      password,
    };

    const createUser = await PlayerModel.create(newUser);

    return res
      .status(200)
      .json({ message: "User created successfully", user: createUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: "name must be entered" });
    }
    const userLogin = await PlayerModel.findOne({ name });
    if (!userLogin) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).json(userLogin);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/gameBoard", async (req, res) => {
  const gameState = await GameBoardModel.find({});
  res.status(201).send({ data: gameState });
});

router.post("/start-round", async (req, res) => {
  const newGameState = new GameBoardModel({ player: 1, isRunning: true });
  await newGameState.save();
  res.send(newGameState);
});
export default router;
