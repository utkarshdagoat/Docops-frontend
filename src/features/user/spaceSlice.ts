import { createSlice } from "@reduxjs/toolkit";
import { spaceApi } from "../../services/space";
import { SpaceResponse } from "../../services/space";

const initialState: SpaceResponse[] = []

const spaceNameSlice = createSlice({
  name: 'space',
  initialState: initialState,
  reducers: {

  },
  extraReducers(builder) {
    builder.addMatcher(spaceApi.endpoints.getFilesForSpaces.matchFulfilled, (state, { payload }) => {
      state = payload

    })

  }
});
export default spaceNameSlice.reducer;
