import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { decode } from 'punycode';
import { createContext, useEffect, useState } from 'react';
import { UserInfo } from '../types/user_info';

export const AuthContext = createContext<{
  isAuthentcate: boolean;
  setAuthenticate: (auth: boolean) => void;
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
}>({
  isAuthentcate: false,
  setAuthenticate: () => {},
  user: null,
  setUser: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const [isAuthentcate, setAuthenticate] = useState(false);
  const [user, setUser] = useState<UserInfo>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); 
    if (!token) {
      if (window.location.pathname != '/register') {
        router.push('/login');
        return;
      }
      //return;
    }

    const decode: UserInfo = jwtDecode(token);
    if (token && decode) {
      setUser({
        email: decode.email,
        username: decode.username,
        id: decode.id,
      });
      setAuthenticate(true);
    }

  }, [isAuthentcate]);

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuthentcate: isAuthentcate,
          setAuthenticate: setAuthenticate,
          user: user,
          setUser: setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
