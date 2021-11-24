import router from 'next/router';
import { useState } from 'react';
import { User } from '../../types/user';
import { registerService } from '../../service/register';
import Spinner from '../../component/spinner'

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)

  const onUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const onPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const onConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const onEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const submit = async (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      setLoading(true)
      if (confirmPassword !== password) {
        setMessage('wrong confirm password');
        return;
      }

      const user: User = {
        username: username,
        password: password,
        email: email,
        image: '',
      };

      if (username == '' || password == '' || email == '') {
        setMessage('Form harus diisi');
        setLoading(false)
        return
      }

      const res = await registerService(user);

      if (res.data.code === 201) {
        setLoading(false)
        return router.push('/login');
      }

      setMessage(res.data.message);
    } catch (err) {
      console.log(err);
      setMessage('Terjadi kesalahan');
      setLoading(false)
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
              className="bg-dark-secondary p-3 mt-4  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
              placeholder="email"
              onChange={onEmail}
            />
            <input
              type="password"
              className="bg-dark-secondary p-3 mt-4  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
              placeholder="password"
              onChange={onPassword}
            />
            <input
              type="password"
              className="bg-dark-secondary p-3 mt-4  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
              placeholder="confirm password"
              onChange={onConfirmPassword}
            />
            <span className="text-red mt-4 bg-red bg-opacity-10 pl-4 rounded-md">
              {message}
            </span>
            <button
              onClick={submit}
              className="p-3 font-bold bg-dark-secondary text-green mt-6 rounded-md"
            >
              {!loading && 'Sign Up'}
              {loading && <Spinner />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
