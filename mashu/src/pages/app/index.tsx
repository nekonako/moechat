import { useContext, useEffect, useRef, useState } from 'react';
import autosize from 'autosize';
import { WebSocketContext } from '../../modules/websocket_provider';
import router from 'next/router';
import ChatBody from '../../component/chat_body';
import { AuthContext } from '../../modules/auth_provider';
import { Message } from '../../types/message';
import { useGetUser } from '../../hooks/use_get_user';
import Loading from '../../component/loading';

export default function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const textarea = useRef(null);
  const { conn, setConn } = useContext(WebSocketContext);
  const { user } = useContext(AuthContext);
  const [connStatus, setConnStatus] = useState('');

  const { users, setUsers } = useGetUser();

  useEffect(() => {
    autosize(textarea.current);
    console.log(user);

    if (conn === null) {
      router.push('/');
      return;
    }

    conn.onmessage = (message) => {
      const m: Message = JSON.parse(message.data);
      if (m.message == 'newuser') {
        setUsers([...users, { username: m.username }]);
        return;
      }
      if (m.message == 'disconnect_user') {
        const deleteUser = users.filter((user) => user.username != m.username);
        setUsers([...deleteUser]);
        return;
      }
      user.id == m.clientId ? (m.type = 'recv') : (m.type = 'self');
      setMessages([...messages, m]);
    };

    conn.onclose = (conn) => {
      setConnStatus('disconnected');
    };

    conn.onerror = (conn) => {
      setConnStatus('connection error');
    };

    conn.onopen = (conn) => {
      setConnStatus('connected');
    };
  }, [textarea, messages, conn, users]);

  const sendMessage = () => {
    console.log(textarea.current.value, 'send');
    if (!textarea.current.value) return;
    conn.send(textarea.current.value);
    textarea.current.value = null;
  };

  const reconnect = () => {
    if (conn == null) {
      return router.push('/');
    }
    const ws = new WebSocket(conn.url);
    if (ws.OPEN) {
      setConn(ws);
      setUsers([]);
    }
  };

  if (users === [] || conn === null) <Loading />;

  return (
    <>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-9/12">
          <div className="p-4 mx-24 mb-14">
            <div>
              <ChatBody data={messages} />
            </div>
          </div>
          <div
            className="fixed bottom-0 z-20 w-9/12 mt-4"
            style={{ overflow: 'hidden' }}
          >
            <div className="flex flex-row bg-dark-secondary px-4 py-2 mx-4 rounded-md">
              <div className="flex w-full mr-4 bg-dark-secondary">
                <textarea
                  ref={textarea}
                  placeholder="Hello internet !"
                  className="w-full p-2 h-2 rounded-md bg-dark-primary focus:outline-none"
                  style={{
                    resize: 'none',
                  }}
                />
              </div>
              <div className="flex items-center">
                <button
                  className="p-2 rounded-md bg-dark-primary text-blue border border-blue"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/12 flex flex-col border-l-2 border-dark-secondary p-4">
          <div className="fixed">
            <OnCloseConnection reconnect={reconnect} message={connStatus} />
            <div className="text-lg font-bold mb-4">online</div>
            {users.map((user, index) => (
              <div
                key={index}
                className="flex flex-row items-center h-full min-w-full ml-4"
              >
                <div className="h-3 bg-green w-3 mr-4 items-center rounded-full"></div>
                <div>{user.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function OnCloseConnection({ reconnect, message }) {
  const disconectStyel =
    'px-4 flex flex-row justify-end w-full bg-red bg-opacity-10 text-red rounded-md';
  const connectedStyle =
    'px-4 flex flex-row justify-end w-full bg-green bg-opacity-10 text-green rounded-md';
  return (
    <div className="inline-block mb-4">
      <div
        className={
          message.includes('disconnected') ? disconectStyel : connectedStyle
        }
      >
        <div>{message}</div>
        {message.includes('disconnected') && (
          <div>
            <button
              className="px-2 ml-4 bg-dark-secondary border-red border rounded-md"
              onClick={reconnect}
            >
              reconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
