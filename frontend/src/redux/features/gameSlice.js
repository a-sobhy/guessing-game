import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, handleError } from "../API/API";

export const startRound = createAsyncThunk(
  "Game/startRound",
  async (params, thunkAPI) => {
    try {
      const { data } = await API.post(`/start-round`, params);
      if (data) {
        localStorage.setItem("roundInfo", JSON.stringify(data));
      }
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
      if (data) {
        localStorage.setItem("roundResults", JSON.stringify(data));
      }
      return data;
    } catch (error) {
      handleError(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  multiplier: null,
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
      state.error = null;
    });
    builder.addCase(startRound.rejected, (state, action) => {
      state.loading = false;
      state.status = null;
      state.multiplier = null;
      state.error = action.payload;
    });
  },
});

export default gameSlice.reducer;
