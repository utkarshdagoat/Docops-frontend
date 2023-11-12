import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface spaceName {
  name: string;
}

const initialState: spaceName = {
  name: '',
};

const spaceNameSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { updateName } = spaceNameSlice.actions;
export default spaceNameSlice.reducer;
