import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './modules/counter/counterSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
