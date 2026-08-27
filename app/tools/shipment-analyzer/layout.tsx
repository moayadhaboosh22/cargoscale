import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Shipment Analyzer — Freight Estimation & Container Recommendation | CargoScale',
  description: 'Analyze your shipment: volume, chargeable weight, recommended container mix, and LCL vs FCL cost comparison — all in one free tool.',
};

export default function ShipmentAnalyzerLayout({ children }: { children: ReactNode }) {
  return children;
}
