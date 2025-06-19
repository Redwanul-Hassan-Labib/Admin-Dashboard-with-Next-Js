import { categories, quickLinks, usefulLinks } from '@/constant/footer';
import { Facebook, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './global/logo';

export default function Footer() {
  return (
    <footer className="bg-dark-lite en w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col">
            {/* Website logo here */}
            <Logo className="text-light" />
            <p className="mt-4 text-gray-300">Pabna, Bangladesh</p>
            <p className="mt-2 text-gray-300">+8800000-000000</p>
            <div className="mt-4 flex space-x-4">
              <Link
                target="_blank"
                href="https://www.facebook.com/groups/naturalsefafamily"
                className="text-red transition-all duration-300 hover:-translate-y-1 hover:text-white"
                aria-label="Visit our Facebook page ">
                <Facebook />
              </Link>
              <Link
                target="_blank"
                href="https://www.youtube.com/channel/UCZDOWSPodbqYsi4WIlUwc1g"
                className="text-red transition-all duration-300 hover:-translate-y-1 hover:text-white"
                aria-label="Visit our youtube page">
                <Youtube />
              </Link>
              <Link href="https://chat.whatsapp.com/G62FiyRWJnN8zSvNhfmMhY" aria-label="Visit our whatsapp group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="text-red transition-all duration-300 hover:-translate-y-1 hover:text-white">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex flex-col">
            <h5 className="text-light mb-4 text-lg font-semibold">Useful Links</h5>
            <ul className="space-y-1">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link className="hover:text-light text-gray-300 transition-colors" href={link.path}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <h5 className="text-light mb-4 text-lg font-semibold">Categories</h5>
            <ul className="space-y-1">
              {categories.map((link, index) => (
                <li key={index}>
                  <Link className="hover:text-light py-1 text-gray-300 transition-colors" href={link.path}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <h5 className="text-light mb-4 text-lg font-semibold">Quick Links</h5>
            <ul className="space-y-1">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link className="hover:text-light py-1 text-gray-300 transition-colors" href={link.path}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t py-6">
          <p className="text-center text-gray-300">
            Copyright &copy; {new Date().getFullYear()} All Rights Reserved to{' '}
            <Link className="text-light" href={'/'}>
              Next.ts
            </Link>{' '}
            <br /> Developed by{' '}
            <Link className="text-light" href="https://tariqul.vercel.app" target="_blank">
              Tariqul Islam
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
