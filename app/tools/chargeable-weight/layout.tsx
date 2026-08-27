import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Chargeable Weight Calculator — Air Freight | CargoScale',
  description: 'Compare actual vs. volumetric weight for air freight shipments and calculate the chargeable weight used for pricing. Free, no signup required.',
};

export default function ChargeableWeightLayout({ children }: { children: ReactNode }) {
  return children;
}
