'use client';

// We simply pass through the children to the root layout
// The auth context is provided by the root layout
export default function DemoLayout({ children }) {
  return children;
} 