'use client';

import Image from 'next/image';

type FloatingIcon = {
  src: string;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  hideOnMobile?: boolean;
};

/**
 * Fixed, hand-placed positions rather than random ones: random values would be
 * regenerated on every render (and differ between server and client), so icons
 * would jump around and icons could clump on top of each other.
 * Left/right bands keep the icons clear of the centred page content.
 */
const icons: FloatingIcon[] = [
  { src: '/icon/10364410.png', top: 8, left: 6, size: 56, duration: 19, delay: 0, rotation: -12 },
  { src: '/icon/10397311.png', top: 22, left: 84, size: 62, duration: 23, delay: 1.6, rotation: 14, hideOnMobile: true },
  { src: '/icon/2040910.png', top: 34, left: 11, size: 48, duration: 17, delay: 3.2, rotation: 8 },
  { src: '/icon/2093858-200.png', top: 47, left: 90, size: 52, duration: 25, delay: 0.8, rotation: -18, hideOnMobile: true },
  { src: '/icon/3946856-40.png', top: 58, left: 5, size: 60, duration: 21, delay: 2.4, rotation: 20 },
  { src: '/icon/4221540.png', top: 70, left: 86, size: 44, duration: 18, delay: 4, rotation: -6 },
  { src: '/icon/6509613.png', top: 82, left: 13, size: 58, duration: 24, delay: 1.2, rotation: 16, hideOnMobile: true },
  { src: '/icon/7978338.png', top: 91, left: 79, size: 50, duration: 20, delay: 3.6, rotation: -22 },
  { src: '/icon/artificial-intelligence.png', top: 14, left: 72, size: 54, duration: 26, delay: 2, rotation: 10 },
  { src: '/icon/images.png', top: 41, left: 93, size: 46, duration: 16, delay: 5, rotation: -14, hideOnMobile: true },
  { src: '/icon/ISO_C++_Logo.svg.png', top: 64, left: 74, size: 52, duration: 22, delay: 0.4, rotation: 6 },
  { src: '/icon/python_18894.png', top: 88, left: 4, size: 56, duration: 19, delay: 4.4, rotation: -10, hideOnMobile: true },
];

export default function FloatingIcons() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {icons.map((icon) => (
        <div
          key={icon.src}
          className={`absolute floating-icon pointer-events-auto ${
            icon.hideOnMobile ? 'hidden md:block' : ''
          }`}
          style={
            {
              top: `${icon.top}%`,
              left: `${icon.left}%`,
              width: icon.size,
              height: icon.size,
              '--rot': `${icon.rotation}deg`,
              animation: `floatIcon ${icon.duration}s ease-in-out ${icon.delay}s infinite`,
            } as React.CSSProperties
          }
        >
          <Image
            src={icon.src}
            alt=""
            width={icon.size}
            height={icon.size}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}
