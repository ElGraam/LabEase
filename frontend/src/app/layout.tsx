import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { authOption } from '@/lib/next-auth/auth';
import { Providers } from '@/providers/providers';
import { Box, SystemStyleObject } from '@chakra-ui/react';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
  title: 'labManager',
  description: 'labManagerは、研究室の情報を管理するためのアプリケーションです。',
};

const boxStyle: SystemStyleObject = {
  maxWidth: '1140px',
  padding: '0 20px',
  margin: '0 auto',
  minHeight: 'calc(100vh - 750px)',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // サーバー側でセッション情報を取得しておき、セッションの初期値として渡す
  const session = await getServerSession(authOption);
  return (
    <html lang='jp'>
      <link rel="icon" href="/favicon.png" sizes="any" />
      <body>
        <Providers session={session}>
          <Header />
          <Box as='main' sx={boxStyle}>
            {children}
          </Box>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
