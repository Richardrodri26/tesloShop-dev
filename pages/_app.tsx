import '@/styles/globals.css'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app'
import { lightTheme } from '../themes';
import { SWRConfig } from 'swr';
import { AuthProvider, CartProvider, UIProvider } from '@/context';

export default function App({ Component, pageProps }: AppProps) {
  //session={session}
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
        <SWRConfig
          value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>

    </SessionProvider>

  )
}
