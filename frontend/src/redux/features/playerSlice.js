import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API, handleError } from "../API/API"

export const joinGame = createAsyncThunk(
  "Game/register",
  async (params, thunkAPI) => {
    try {
      const { data } = await API.post(`/register`, params)
      console.log("register from slice", data)
      return data
    } catch (error) {
      handleError(error)
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const initialState = {
  gameStart: null,
  loading: false,
  error: null,
}

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //! get all labels
    builder.addCase(joinGame.pending, (state) => {
      state.loading = true
    })
    builder.addCase(joinGame.fulfilled, (state, action) => {
      state.loading = false
      state.gameStart = action.payload.data
      state.error = null
    })
    builder.addCase(joinGame.rejected, (state, action) => {
      state.loading = false
      state.gameStart = null
      state.error = action.payload
    })
  },
})

export default playerSlice.reducer
