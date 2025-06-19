import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { ChildrenProps } from '@/types';

export default function Layout({ children }: ChildrenProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen w-[90vw] max-w-7xl py-14">{children}</main>
      <Footer />
    </>
  );
}
