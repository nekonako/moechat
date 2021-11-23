import '../styles/global.css';
import 'webrtc-adapter';

import type { AppProps /*, AppContext */ } from 'next/app';
import { AuthContextProvider } from '../modules/auth_provider';
import { WebSocketProvider } from '../modules/websocket_provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <WebSocketProvider>
        <div className="flex flex-col h-full min-h-screen font-sans text-base antialiased bg-dark-primary text-white transition-all duration-300 md:flex-row">
          <Component {...pageProps} />
        </div>
      </WebSocketProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
