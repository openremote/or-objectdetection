import axios from 'api/axios';
import { config } from 'process';
import AxiosResponse from 'axios';

export interface Config {
    id: number
    name: string
    resolution: string
    framerate: string
    detections_types: string[]
    drawables: string
    options: string[]
    active: boolean
}


export async function getConfig(feed_id: number): Promise<undefined | Config> {
    let config: Config | undefined;
    try {
        let { data } = await axios.get<Config>(`/configurations/feed/${feed_id}`);
        config = data;
    } catch(error) {
        config = undefined;
    }
    return config;
}

export async function saveConfig(config: Config) {
    let { data } = await axios.post<Config>("/configurations", config);
    console.log(config)
    return data;
}

export async function UpdateConf(config: Config): Promise<Config> {
    let { data } = await axios.put<Config>(`/configurations/${config.id}`, config);
    return data;
}
