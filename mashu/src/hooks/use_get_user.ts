import router from 'next/router';
import { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../modules/websocket_provider';
import { getUsersInRoom } from '../service/app'

export const useGetUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { conn } = useContext(WebSocketContext)
  

  useEffect(() => {
    console.log(users)
    if (conn === null){
      router.push('/')
      return
    }
    const url = conn.url
    const roomId = url.split('/')
    getUsersInRoom(roomId[4])
      .then((res) => {
        console.log(res.data);
        setUsers(res.data.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return { users, error, setUsers };
};
