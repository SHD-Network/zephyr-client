import '@/styles/Global.scss';
import Layout from './layoutChild';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
