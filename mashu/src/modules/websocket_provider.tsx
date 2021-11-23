import {
  createContext,
  useState,
} from 'react';

type Conn = WebSocket | null;

export const WebSocketContext = createContext<{
  conn: Conn;
  setConn: (v: Conn) => void;
}>({
  conn: null,
  setConn: () => {},
});

export const WebSocketProvider = ({ children }) => {
  const [conn, setConn] = useState<Conn>(null);

  return (
    <WebSocketContext.Provider
      value={{
        conn: conn,
        setConn: setConn,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
