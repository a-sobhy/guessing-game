import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, handleError } from "../API/API";

export const joinGame = createAsyncThunk(
  "Player/register",
  async (params, thunkAPI) => {
    try {
      const { data } = await API.post(`/register`, params);
      if (data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(data.user));
      }
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

      if (data) {
        localStorage.setItem("gameInfo", JSON.stringify(data));
      }
      return data;
    } catch (error) {
      handleError(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  gameStart: null,
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
      state.gameStart = null;
      state.error = null;
    });
    builder.addCase(joinGame.rejected, (state, action) => {
      state.loading = false;
      state.gameStart = null;
      state.status = null;
      state.error = action.payload;
    });

    //! Initiate Round
    builder.addCase(initiateRound.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initiateRound.fulfilled, (state, action) => {
      state.loading = false;
      state.gameStart = action.payload;
      state.error = null;
    });
    builder.addCase(initiateRound.rejected, (state, action) => {
      state.loading = false;
      state.gameStart = null;
      state.error = action.payload;
    });
  },
});

export default playerSlice.reducer;
