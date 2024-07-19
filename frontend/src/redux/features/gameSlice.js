import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, handleError } from "../API/API";

export const startRound = createAsyncThunk(
  "Game/startRound",
  async (params, thunkAPI) => {
    try {
      const { data } = await API.post(`/start-round`, params);
      console.log("Start Round", data);
      return data;
    } catch (error) {
      handleError(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getResults = createAsyncThunk(
  "Game/getResults",
  async (params, thunkAPI) => {
    try {
      const { data } = await API.post(`/calculate-results`, params);

      return data;
    } catch (error) {
      handleError(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  multiplier: null,
  roundPlayers: null,
  game: null,
  status: null,
  loading: false,
  error: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //! Start Round
    builder.addCase(startRound.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(startRound.fulfilled, (state, action) => {
      state.loading = false;
      state.status = action.payload.status;
      state.multiplier = action.payload.gameMultiplier;
      state.roundPlayers = action.payload.players;
      state.game = action.payload.game;
      state.error = null;
    });
    builder.addCase(startRound.rejected, (state, action) => {
      state.loading = false;
      state.status = null;
      state.roundPlayers = null;
      state.game = null;
      state.multiplier = null;
      state.error = action.payload;
    });
    
    //! Get Results
    builder.addCase(getResults.pending, (state) => {
      state.loading = true;
    });
    // builder.addCase(getResults.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.status = action.payload.status;
    //   state.multiplier = action.payload.gameMultiplier;
    //   state.roundPlayers = action.payload.players;
    //   state.game = action.payload.game;
    //   state.error = null;
    // });
    // builder.addCase(getResults.rejected, (state, action) => {
    //   state.loading = false;
    //   state.status = null;
    //   state.roundPlayers = null;
    //   state.game = null;
    //   state.multiplier = null;
    //   state.error = action.payload;
    // });
  },
});

export default gameSlice.reducer;
