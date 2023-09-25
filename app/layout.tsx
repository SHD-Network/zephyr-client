'use client';

import '@/styles/Global.scss';
import Layout from './layoutChild';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Oxanium } from 'next/font/google';

const font = Oxanium({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={font.className}>
        <MantineProvider
          defaultColorScheme="dark"
          theme={{
            primaryColor: 'red',
            fontFamily: 'inherit',
            headings: {
              fontFamily: 'inherit',
            },
          }}
        >
          <Layout>{children}</Layout>
        </MantineProvider>
      </body>
    </html>
  );
}
