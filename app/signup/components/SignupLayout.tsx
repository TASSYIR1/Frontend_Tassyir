import Image from 'next/image';
import React, { ReactNode } from 'react';

interface SignupLayoutProps {
  children: ReactNode;
}

export default function SignupLayout({ children }: SignupLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#F5F7FB]" dir="rtl">
      {/* Header */}
      <div className="absolute z-20 pt-8 pr-8">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={120}
            height={40}
            priority
          />
        </div>
      </div>

      {/* Top left decorative blob */}
      <div className="fixed left-0 top-0 pointer-events-none rotate-180">
        <Image
          src="/Rectangle 9.png"
          alt="decoration"
          width={256}
          height={256}
          priority
          className="w-24 h-24 sm:w-36 sm:h-36 lg:w-64 lg:h-64"
        />
      </div>

      {/* Bottom right decorative blob */}
      <div className="fixed right-0 bottom-0 pointer-events-none">
        <Image
          src="/Rectangle 9.png"
          alt="decoration"
          width={256}
          height={256}
          priority
          className="w-24 h-24 sm:w-36 sm:h-36 lg:w-64 lg:h-64"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 lg:px-6">
        {children}
      </div>
    </div>
  );
}
