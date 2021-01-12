import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import counterReducer from "./modules/counter/counterSlice";
import sourcesReducer from "./modules/video_sources/sourcesSlice";
import authReducer from "./modules/auth/authSlice";
import configReducer from "./modules/configuration/configSlice";


export default configureStore({
  reducer: {
    counter: counterReducer,
    sources: sourcesReducer,
    auth: authReducer,
    config: configReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // Ignore blob dispatch action type.
      ignoredActions: ['sources/LoadSnapshots'],
    }
  })
});
