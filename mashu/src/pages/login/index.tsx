import router from 'next/router';
import Link from 'next/link'
import { useContext, useState } from 'react';
import { loginService } from '../../service/login';
import Spinner from '../../component/spinner';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const onPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const submit = async (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const user = {
        username: username,
        password: password,
      };

      const res = await loginService(user);

      if (res.data.code === 200) {
        localStorage.setItem('access_token', res.data.data.accessToken);
        localStorage.setItem('refresh_token', res.data.data.refreshToken);
        return router.push('/');
      }

      setLoading(false);
      setMessage(res.data.message);
    } catch (err) {
      setLoading(false);
      console.log(err);
      setMessage('something wrong');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-w-full min-h-screen">
        <div className="m-4 p-6 place-content-center">
          <form className="flex flex-col py-12 mx-8">
            <div className="text-3xl font-bold text-center text-red text-gray-700">
              <span className="text-pink">✿ </span>
              <span className="text-yellow">Moe</span>Chat
              <span className="text-pink"> ✿ </span>
            </div>
            <input
              className="bg-dark-secondary p-3 mt-8  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
              placeholder="username"
              onChange={onUsername}
            />
            <input
              type="password"
              className="bg-dark-secondary p-3 mt-4  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
              placeholder="password"
              onChange={onPassword}
            />
            <span className="text-red mt-4 bg-red bg-opacity-10 pl-4 rounded-md">
              {message}
            </span>
            <button
              onClick={submit}
              className="p-3 font-bold bg-dark-secondary text-green mt-6 rounded-md"
            >
              {!loading && 'Log In'}
              {loading && <Spinner />}
            </button>
            <div className="mt-4 text-purple">
              <Link href="/register">register</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
