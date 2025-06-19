import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IGlobalState {
  language: 'bn' | 'en';
}

// Initial state
const initialState: IGlobalState = {
  language: 'bn',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'bn'>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = globalSlice.actions;
export default globalSlice.reducer;
