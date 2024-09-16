// pages/_app.tsx
import { AppProps } from 'next/app'; // Import AppProps type
import { AuthProvider } from '../lib/AuthContext';

function MyApp({ Component, pageProps }: AppProps) { // Add types to Component and pageProps
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
