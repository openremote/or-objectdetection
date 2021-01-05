import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Config, getConfig, saveConfig } from 'api/ConfigApi';

const configuration: Config = {
  id: 0,
  name: "",
  resolution: "",
  framerate: "",
  detections_types: [],
  drawables: "",
  options: [],
  active: false
}

const initialState: { configSource: Config } = {
  configSource: configuration
};

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    LoadConfigurations: (state, action: PayloadAction<Config>) => {
      //set sources loaded from API to local state.
      state.configSource = action.payload;
    },
    SaveConfigurations: (state, action: PayloadAction<Config>) => {
      //add video source to local state array
      state.configSource = action.payload;
    }
  },
});

export const { LoadConfigurations, SaveConfigurations } = sourcesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectConfigurations = (state: any) => state.configSource;

export default sourcesSlice.reducer;

export const LoadConfig = (id: number) => async (dispatch: any) => {
  let config = await getConfig(id);
  dispatch(LoadConfigurations(config));
}

export const SaveConfig = (configuration: Config) => async (dispatch: any) => {
  let config = await saveConfig(configuration)
  console.log(config)
  dispatch(SaveConfigurations(config));
}

