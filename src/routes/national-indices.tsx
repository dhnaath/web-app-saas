import React from 'react';
import { AppShell } from '@/app/app-shell';
import { NationalIndicesSection } from '@/features/launcher/NationalIndicesSection';

export function NationalIndicesDashboard() {
  return (
    <AppShell
      title="10 Indeks Pembangunan"
      subtitle="Dashboard Indikator Sosial-Ekonomi & Kesejahteraan Nasional Menuju Indonesia Emas 2045"
    >
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <NationalIndicesSection />
      </div>
    </AppShell>
  );
}
