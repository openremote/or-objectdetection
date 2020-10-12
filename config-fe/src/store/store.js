import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './modules/counter/counterSlice';
import sourcesReducer from './modules/video_sources/sourcesSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    sources: sourcesReducer,
  },
});
