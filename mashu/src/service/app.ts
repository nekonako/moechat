import { API_URL } from '../constants';
import { api } from './api';

export const getUsersInRoom = async (roomId: string) => {
  try {
    const res = await api.get(`${API_URL}/ws/rooms/${roomId}`);
    return Promise.resolve(res);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
