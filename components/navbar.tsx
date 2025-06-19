'use client';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { Logo } from './global/logo';
import { ModeToggle } from './mode-toggle';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [navbarState, setNavbarState] = useState({
    showNavbar: true,
    lastScrollY: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at the top
      if (currentScrollY < navbarState.lastScrollY || currentScrollY < 10) {
        setNavbarState((prev) => ({ ...prev, showNavbar: true }));
      } else {
        // Hide navbar when scrolling down and not at the top
        setNavbarState((prev) => ({ ...prev, showNavbar: false }));
      }

      setNavbarState((prev) => ({ ...prev, lastScrollY: currentScrollY }));
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navbarState.lastScrollY]);

  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Navigation links data with proper typing
  type NavLink = { href: string; label: string } | false;

  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact' },
    isSignedIn ? { href: `/${user?.publicMetadata.role}`, label: 'Dashboard' } : false,
  ];

  // Filter out false values and create a typed array
  const filteredNavLinks = navLinks.filter((link): link is { href: string; label: string } => link !== false);

  return (
    <nav
      className={cn(
        'dark:bg-dark-lite en bg-light fixed top-0 z-[20] w-full bg-gradient-to-r p-4 shadow-sm backdrop-blur transition-transform duration-300',
        navbarState.showNavbar ? 'translate-y-0' : '-translate-y-full',
      )}>
      <div className="mx-auto flex w-[90vw] max-w-7xl items-center justify-between md:ps-5">
        {/* Logo */}
        <Logo />

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          <ul className="hidden space-x-6 lg:flex">
            {filteredNavLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className={'group relative px-1'}>
                  {link.label}
                  {isActive(link.href) && <span className="dark:bg-light absolute -bottom-0.5 left-0 h-[1.5px] w-full rounded-full bg-black"></span>}
                  {!isActive(link.href) && <span className="dark:bg-light absolute -bottom-0.5 left-0 h-[1.5px] w-0 origin-left rounded-full bg-black duration-300 group-hover:w-full"></span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          {/* Login Button for larger screens */}
          <div className="hidden md:flex">
            <SignedOut>
              <Link href="/sign-in">Login / Register</Link>
            </SignedOut>
          </div>
          <SignedIn>
            <Suspense fallback={<div className="h-10 w-10 rounded-full">loading</div>}>
              <UserButton afterSignOutUrl="/" />
            </Suspense>
          </SignedIn>

          <ModeToggle />

          {/* Mobile Menu (Sheet) */}
          <Sheet>
            <SheetTrigger className="dark:text-light cursor-pointer rounded px-1 py-1 lg:hidden" aria-label="Open menu">
              <AlignLeft />
            </SheetTrigger>
            <SheetContent side="left" className="border-none px-2">
              {/* Sheet Header */}
              <SheetHeader className="w-fit px-2">
                <SheetTitle className="dark:text-light-bg text-2xl font-medium">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <hr />

              {/* Mobile Navigation Links */}
              <ul className="flex flex-col space-y-4 px-2">
                {filteredNavLinks.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link href={link.href} className={'group dark:text-light-bg relative px-1'}>
                        {link.label}
                        {isActive(link.href) && <span className="dark:bg-light absolute -bottom-0.5 left-0 h-[1.5px] w-full rounded-full bg-black"></span>}
                        {!isActive(link.href) && <span className="dark:bg-light absolute -bottom-0.5 left-0 h-[1.5px] w-0 origin-left rounded-full bg-black duration-300 group-hover:w-full"></span>}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              {/* Mobile Login Button */}
              <ul className="md:hidden">
                <li className="px-2">
                  {!isSignedIn && (
                    <SheetClose asChild>
                      <SignedOut>
                        <Link href="/sign-in" className="dark:text-light text-black">
                          Login / Register
                        </Link>
                      </SignedOut>
                    </SheetClose>
                  )}
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
