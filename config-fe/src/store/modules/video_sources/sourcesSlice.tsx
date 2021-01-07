import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Feed, getFeeds, getFeedDetails, createFeed, deleteFeed, Snapshot } from 'api/FeedApi';
import stompClient from 'rabbitMQ/rabbitMQ'
import store from 'store/store';

const initialState: { videoSources: Feed[], snapshots: Snapshot[] } = {
  videoSources: [],
  snapshots: []
};

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {
      LoadSources: (state, action : PayloadAction<Feed[]>) => {
        //set sources loaded from API to local state.
        state.videoSources = action.payload;
      },
      AddSource: (state, action : PayloadAction<Feed>) => {
        //add video source to local state array
        state.videoSources.push(action.payload);
      },
      RemoveSource: (state, action : PayloadAction<Feed>) => {
        //delete from local state array.
        var indexOfVideoToDelete = state.videoSources.indexOf(action.payload);
        state.videoSources.splice(indexOfVideoToDelete, 1);
      },
      LoadSnapshots: (state, action: PayloadAction<Snapshot[]>) => {
        state.snapshots = action.payload;
      }
    },
  });
  
export const { LoadSources, AddSource, RemoveSource, LoadSnapshots } = sourcesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectSources = (state : any) => state.sources.videoSources;

export default sourcesSlice.reducer;

  
export const LoadVideoSources = () => async (dispatch : any) => {
  let feeds = await getFeeds();
  dispatch(LoadSources(feeds));
}

export const AddVideoSource = (videoSource: Feed) => async (dispatch : any) => {
  let feed = await createFeed(videoSource);
  dispatch(AddSource(feed));
}

export const RemoveVideoSource = (videoSource: Feed) => async (dispatch : any) => {
  let deleted = await deleteFeed(videoSource);

  if(deleted) {
    dispatch(RemoveSource(videoSource));
  } else {
    console.log("FAILED TO DELETE VIDEO FEED");
  }
}

export const FetchSnapshots = () => async (dispatch : any) => {
  let tempSnapshots = [] as Snapshot[];

  //fetch stompclient instance
  let client = stompClient;

  //attempt to connect to rabbitmq
  client.activate();

  client.onConnect =  (frame) => {

    for(let feed of store.getState().sources.videoSources) {
      //only fetch for active feeds.
      if(feed.active) {
        //subscribe to the queue for messages.
        var sub = client.subscribe("/queue/video-queue/", (message) => {

          let blob = new Blob([message.binaryBody]);
          let snapshot: Snapshot = { feed_id: feed.id, snapshot: blob};
          tempSnapshots.push(snapshot);

          //if we got a message unsubscribe
          sub.unsubscribe();
        });
      }
    }
  };

  //wait 3 seconds then deactivate the client to give the client time to receive a single frame.
  setTimeout(function() {
    client.deactivate();
  }, 3000);

  //in the end, pass all the results to the snapshot state.
  dispatch(LoadSnapshots(tempSnapshots));
}