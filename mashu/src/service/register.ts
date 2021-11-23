import { API_URL } from '../constants';
import { User } from "../types/user"
import { api } from './api'

export const registerService = async (data : User) => {
  try {
    const res = await api.post(`${API_URL}/register`, data);
    return Promise.resolve(res);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
