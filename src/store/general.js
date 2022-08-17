import { configureStore } from '@reduxjs/toolkit';
import stateSlice from './common-state';

const store = configureStore({
  reducer: {
    commonState: stateSlice.reducer,
  },
});

export default store;
