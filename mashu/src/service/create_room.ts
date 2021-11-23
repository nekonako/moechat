import { AxiosResponse } from 'axios';
import { api } from './/api';
import { API_URL } from '../constants';

type Room = {
  roomName: string;
  roomId: string;
};

export async function createRoomService(
  data: Room
): Promise<AxiosResponse<any, any>> {
  try {
    const res = await api.post(`${API_URL}/ws`, data);
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
}
