import axios from 'api/axios';

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

export async function getConfig(id: number) {
    let { data } = await axios.get<Config>(`/configurations/${id}`)
    console.log(data)
    return data;
}

export async function saveConfig(config: Config) {
    let { data } = await axios.post<Config>("/configurations", config);
    console.log(config)
    return data;
}
