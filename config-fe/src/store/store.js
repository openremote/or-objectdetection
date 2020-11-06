import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./modules/counter/counterSlice";
import sourcesReducer from "./modules/video_sources/sourcesSlice";
import authReducer from "./modules/auth/authSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    sources: sourcesReducer,
    auth: authReducer
  }
});
