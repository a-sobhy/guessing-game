import { combineReducers, configureStore } from "@reduxjs/toolkit"
import playerSlice from "./features/playerSlice"
const reducers = combineReducers({
  player: playerSlice,
})
export const store = configureStore({
  reducer: reducers,
})
