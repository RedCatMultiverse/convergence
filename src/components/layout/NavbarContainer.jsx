'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarContainer() {
  const pathname = usePathname();
  const isDemo = pathname === '/games/demo' || pathname.startsWith('/games/demo/');
  
  // Don't render the navbar on demo pages
  if (isDemo) {
    return null;
  }
  
  return <Navbar />;
} 