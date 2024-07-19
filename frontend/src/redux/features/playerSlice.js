import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, handleError } from "../API/API";

export const joinGame = createAsyncThunk(
  "Player/register",
  async (params, thunkAPI) => {
    try {
      const { data } = await API.post(`/register`, params);

      return data;
    } catch (error) {
      handleError(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const initiateRound = createAsyncThunk(
  "Player/initiateRound",
  async (params, thunkAPI) => {
    try {
      const { data } = await API.post(`/initiate-round`, params);

      return data;
    } catch (error) {
      handleError(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  initialGame: null,
  user: null,
  loginTime: null,
  randomPlayers: null,
  status: null,
  loading: false,
  error: null,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //! Register
    builder.addCase(joinGame.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(joinGame.fulfilled, (state, action) => {
      state.loading = false;
      state.status = action.payload.state;
      state.loginTime = action.payload.logedinAt;
      state.user = action.payload.user;
      state.initialGame = null;
      state.error = null;
    });
    builder.addCase(joinGame.rejected, (state, action) => {
      state.loading = false;
      state.initialGame = null;
      state.user = null;
      state.loginTime = null;
      state.status = null;
      state.error = action.payload;
    });

    //! Initiate Round
    builder.addCase(initiateRound.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initiateRound.fulfilled, (state, action) => {
      state.loading = false;
      state.initialGame = action.payload.game;
      state.randomPlayers = action.payload.randomPlayers;
      state.error = null;
    });
    builder.addCase(initiateRound.rejected, (state, action) => {
      state.loading = false;
      state.initialGame = null;
      state.randomPlayers = null;
      state.error = action.payload;
    });
  },
});

export default playerSlice.reducer;
