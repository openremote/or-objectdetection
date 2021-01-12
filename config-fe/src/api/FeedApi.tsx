import axios from 'api/axios';
import { Config } from './ConfigApi';

enum CamType {
    webcam = 1,
    ip_cam = 2,
    local_file = 3
}

export interface FeedChangeEvent {
    feed_id: number
}

export interface Feed {
    id: number
    name: string
    description: string
    location: string
    feed_type: CamType
    url: string
    active: boolean
    configuration: Config
}

export interface Snapshot {
    feed_id: number
    snapshot: Blob
}

export async function getFeeds() {
    let { data } = await axios.get<Feed[]>("/feeds")
    return data
}

export async function getFeedDetails(id: number) {
    let { data } = await axios.get<Feed>(`/feeds/${id}`)
    return data
}

export async function createFeed(feed: Feed) {
    let { data } = await axios.post<Feed>("/feeds", feed);
    console.log(data);
    return data;
}

export async function updateFeed(feed: Feed) {
    let { data } = await axios.put<Feed>(`/feeds/${feed.id}`, feed);
    return data;
}

export async function deleteFeed(feed: Feed) {
    let response = await axios.delete(`/feeds/${feed.id}`)
    return response.status === 204;
}

export async function ChangeFeed(feed: FeedChangeEvent) {
    let { data } = await axios.put<Feed>(`/feeds/start/${feed.feed_id}`, null);
    return data;
}