'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/recipes', label: 'Recipes' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        variant === 'transparent'
          ? 'bg-parchment/80 backdrop-blur-md border-sand-200/50'
          : 'bg-parchment/95 backdrop-blur-md border-sand-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <Image
              src="/images/brand/logo.png"
              alt="Easy to Cook Meals"
              width={200}
              height={70}
              priority
              className="h-auto w-[160px] md:w-[200px] transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm md:text-base font-body transition-colors duration-300 ${
                  isActive(link.href)
                    ? 'text-terracotta-600 font-medium'
                    : 'text-ink-muted hover:text-terracotta-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
