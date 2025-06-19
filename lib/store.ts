import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './features/global/global-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      globals: globalSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
