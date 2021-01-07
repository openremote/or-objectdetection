import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Feed, getFeeds, getFeedDetails, createFeed, deleteFeed } from 'api/FeedApi';

const initialState: { videoSources: Feed[] } = {
  videoSources: []
};

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    LoadSources: (state, action: PayloadAction<Feed[]>) => {
      //set sources loaded from API to local state.
      state.videoSources = action.payload;
    },
    AddSource: (state, action: PayloadAction<Feed>) => {
      //add video source to local state array
      state.videoSources.push(action.payload);
    },
    RemoveSource: (state, action: PayloadAction<Feed>) => {
      //make api call

      //delete from local state array.
      var indexOfVideoToDelete = state.videoSources.indexOf(action.payload);
      state.videoSources.splice(indexOfVideoToDelete, 1);
    }
  },
});

export const { LoadSources, AddSource, RemoveSource } = sourcesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectSources = (state: any) => state.sources.videoSources;

export default sourcesSlice.reducer;


export const LoadVideoSources = () => async (dispatch: any) => {
  let feeds = await getFeeds();
  dispatch(LoadSources(feeds));
}

export const AddVideoSource = (videoSource: Feed) => async (dispatch: any) => {
  let feed = await createFeed(videoSource);
  dispatch(AddSource(feed));
}

export const RemoveVideoSource = (videoSource: Feed) => async (dispatch: any) => {
  let deleted = await deleteFeed(videoSource);

  if (deleted) {
    dispatch(RemoveSource(videoSource));
  } else {
    console.log("FAILED TO DELETE VIDEO FEED");
  }
}
