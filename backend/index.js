import e from "express";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import gameRouter from "./routs/gameRout.js";

const app = e();
app.use(e.json());
app.use(cors());

app.use("/api", gameRouter);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`This app is listening on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connect error", error);
  });
