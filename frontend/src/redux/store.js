import { combineReducers, configureStore } from "@reduxjs/toolkit"
import playerSlice from "./features/playerSlice"
import gameSlice from "./features/gameSlice"
const reducers = combineReducers({
  player: playerSlice,
  game: gameSlice,
})
export const store = configureStore({
  reducer: reducers,
})
