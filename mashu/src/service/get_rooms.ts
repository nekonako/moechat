import { AxiosResponse } from 'axios';
import { API_URL } from '../constants';
import { api } from './api';

export async function getRoomService(): Promise<AxiosResponse<any, any>> {
  try {
    const res = await api.get(`${API_URL}/ws`);
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
}
