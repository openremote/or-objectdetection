import { createSlice } from '@reduxjs/toolkit';

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState: {
      videoSources: []
    },
    reducers: {
      LoadSources: (state, action) => {
        //set sources loaded from API to local state.
        state.videoSources = action.payload;
      },
      AddSource: (state, action) => {
        //make api call
        
        //add video source to local state array
        state.videoSources.push(action.payload);
      },
      RemoveSource: (state, action) => {
        //make api call

        //delete from local state array.
        var indexOfVideoToDelete = state.videoSources.indexOf(action.payload);
        state.videoSources.splice(indexOfVideoToDelete, 1);
      }
    },
  });
  
  export const { LoadSources, AddSource, RemoveSource } = sourcesSlice.actions;
  
  export const LoadVideoSources = () => async dispatch => {
    //const response = await api.call
    //dispatch(LoadSources(response.data));

    var mockData = [
        {
            source_name: "Traffic Cam",
            source_type: "IP_CAM", //<- ENUM
            source_url: "http://localhost:3000/traffic.mp4",
            source_description: "Nice camera on a nice street"
        },
        {
            source_name: "Office CAM",
            source_type: "IP_CAM", //<- ENUM
            source_url: "http://localhost:3000/office.mp4",
            source_description: "camera watching over an office"
        }
    ]

    //for now we mock it, since we have no API
    setTimeout(() => {
        dispatch(LoadSources(mockData));
      }, 1000);
  }

  export const AddVideoSource = (videoSource) => async dispatch => {
    //const response = await api.call
    //dispatch(AddSource(response.data));

    //mock it for now
    setTimeout(() => {
        dispatch(AddSource(videoSource));
    }, 1000);
  }

  export const RemoveVideoSource = (videoSource) => async dispatch => {
    //const response = await api.call
    //dispatch(RemoveSource(response.data));

    //mock it for now
    setTimeout(() => {
        dispatch(RemoveSource(videoSource));
    }, 1000);
  }
  
  // The function below is called a selector and allows us to select a value from
  // the state. Selectors can also be defined inline where they're used instead of
  // in the slice file. For example: `useSelector((state) => state.counter.value)`
  export const selectSources = state => state.sources.videoSources;
  
  export default sourcesSlice.reducer;