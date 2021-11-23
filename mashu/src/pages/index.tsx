import { getRoomService } from '../service/get_rooms';
import Loading from '../component/loading';
import { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createRoomService } from '../service/create_room';
import { WEBSOCKET_URL } from '../constants';
import { WebSocketContext } from '../modules/websocket_provider';
import router from 'next/router';
import { AuthContext } from '../modules/auth_provider';
import jwtDecode from 'jwt-decode';
import { UserInfo } from '../types/user_info';

export default function Index() {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const { setConn } = useContext(WebSocketContext);
  const { user, setUser } = useContext(AuthContext);

  const getRooms = async () => {
    try {
      const res = await getRoomService(); 
      if (res.data.data) {
        setRooms(res.data.data);
      }
    } catch (err) {
      console.log(err);
      setMessage('Terjadi kesalahan saat mengambil daftar room');
    }
  };

  useEffect(() => {
    getRooms();
    const token = localStorage.getItem('access_token');
    if (token) {
      const jwt: UserInfo = jwtDecode(token);
      setUser(jwt);
    } 
  }, []);

  const submit = async () => {
    try {
      setRoomName('')
      const res = await createRoomService({
        roomId: uuidv4(),
        roomName: roomName,
      });
      if (res.data) {
        setMessage('berhasil');
        setTimeout(async () => {
          setMessage('');
          await getRooms();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setMessage('terjadi Kesalahan');
    }
  };

  const joinRoom = (roomId: string) => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}/${roomId}?userId=${user.id}&username=${user.username}`
    );
    if (ws.OPEN) {
      setConn(ws);
      router.push('/app');
    }
  };

  const onRoomChange = (e) => {
    const value = e.target.value;
    setRoomName(value);
  };

  if (rooms === [] || user === null) return <Loading />;

  return (
    <>
      <div className="my-8 mx-32 h-full w-full">
        <div className="flex justify-center">
          <div className="p-5 w-96 shadow-lg rounded-md bg-dark-secondary">
            <div className="mt-3 text-center">
              {message && (
                <div className="mb-3 bg-red bg-opacity-10 p-2 rounded-md text-red">
                  {message}
                </div>
              )}
              <input
                type="text"
                className="p-2 bg-dark-primary border border-green rounded-md focus:outline-none"
                placeholder="room name"
                onChange={onRoomChange}
              />
              <button
                className="bg-dark-primary border border-green text-green rounded-md p-2 ml-4"
                onClick={submit}
              >
                buat room
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="font-bold">Daftar room</div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="bg-dark-secondary p-4 flex flex-row rounded-md w-full"
              >
                <div className="w-full">
                  <div className="text-sm">room</div>
                  <div className="text-yellow font-bold text-lg">
                    {room.roomName}
                  </div>
                </div>
                <div className="inline-block">
                  <button
                    className="bg-dark-primary px-4 text-yellow border border-yellow rounded-md"
                    onClick={() => joinRoom(room.roomId)}
                  >
                    join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
