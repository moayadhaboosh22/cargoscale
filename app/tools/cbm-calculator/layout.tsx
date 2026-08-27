import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'CBM Calculator — Calculate Shipment Volume | CargoScale',
  description: 'Quickly calculate the total volume (CBM) of your shipment from package dimensions and quantity. Free, no signup required.',
};

export default function CbmCalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
