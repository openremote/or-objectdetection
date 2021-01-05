import axios from 'api/axios';

enum CamType {
    webcam = 1,
    ip_cam = 2,
    local_file = 3
}

export interface Feed {
    id: number
    name: string
    description: string
    location: string
    feed_type: CamType
    url: string
    active: boolean
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

export async function deleteFeed(feed: Feed) {
    let response = await axios.delete(`/feeds/${feed.id}`)

    return response.status === 204;
}