import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Container Specifications (20GP, 40GP, 40HC) | CargoScale',
  description: 'Reference dimensions, capacities, and payload limits for standard shipping containers — 20\' General Purpose, 40\' General Purpose, and 40\' High Cube.',
};

export default function ContainersLayout({ children }: { children: ReactNode }) {
  return children;
}
