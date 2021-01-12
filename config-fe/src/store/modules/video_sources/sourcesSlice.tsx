import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Feed, getFeeds, getFeedDetails, createFeed, deleteFeed, Snapshot, FeedChangeEvent, ChangeFeed } from 'api/FeedApi';
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
        let feed = state.videoSources.findIndex(x => x.id === action.payload?.id);
        if(feed !== -1) {
          console.log(feed);
          state.videoSources.splice(feed, 1);
        }
      },
      ChangeFeedActive: (state, action : PayloadAction<Feed>) => {
        var foundIndex = state.videoSources.findIndex(x => x.id == action.payload.id);
        state.videoSources[foundIndex] = action.payload;
      },
      LoadSnapshots: (state, action: PayloadAction<Snapshot[]>) => {
        state.snapshots = action.payload;
      }
    },
  });
  
export const { LoadSources, AddSource, RemoveSource, LoadSnapshots, ChangeFeedActive } = sourcesSlice.actions;

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

export const StartStopVideoSource = (FeedChangeEvent: FeedChangeEvent) => async (dispatch : any) => {
  let updatedfeed = await ChangeFeed(FeedChangeEvent);
  dispatch(ChangeFeedActive(updatedfeed));
}

export const FetchSnapshots = () => async (dispatch : any) => {
  let tempSnapshots = [] as Snapshot[];
  //subscriptions storing the client subscribe messages.
  let subscriptions = [] as any[];

  //initialize the callback function on message received.
  var onQueueMessage = (message) => {
    //find which subscription we are based on the subscription header and fetch this subscription
    let indexOfSub = subscriptions.findIndex(x => x.subscription.id == message.headers.subscription);
    let sub = subscriptions[indexOfSub];

    let blob = new Blob([message.binaryBody]);
    let snapshot: Snapshot = { feed_id: sub.feed_id, snapshot: blob};
    tempSnapshots.push(snapshot);

    //finally unsubscribe from the subscription so we only receive one frame and remove the sub from the list.
    sub.subscription.unsubscribe();
    subscriptions.splice(indexOfSub, 1);

    //ack the message sent.
    message.ack();
  }

  //fetch stompclient instance
  let client = stompClient;

  //attempt to connect to rabbitmq
  client.activate();

  client.onConnect =  (frame) => {
    for(let feed of store.getState().sources.videoSources) {
      //only fetch for active feeds.
      if(feed.active) {
        //subscribe to the queue for messages.
        var sub = client.subscribe("/queue/video-queue", onQueueMessage, {'ack': 'client-individual', 'prefetch-count': 1 });
        
        subscriptions.push({
          subscription: sub,
          feed_id: feed.id
        });
      }
    }
  };

  //wait 3 seconds then deactivate the client to give the client time to receive a single frame.
  setTimeout(function() {
    client.deactivate();

    //in the end, pass all the results to the snapshot state.
    dispatch(LoadSnapshots(tempSnapshots));
  }, 3000);
}