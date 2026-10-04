import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Download, TrendingUp, TrendingDown, 
  ShieldAlert, Database, Copy, X, 
  Building2, CheckCircle2, Table as TableIcon, LayoutGrid,
  ArrowUpRight, ArrowDownRight, Briefcase, CalendarClock, Package, 
  Layers, ExternalLink, Coins,
  Wheat, Flame, Trees, ShoppingBag, HeartPulse, HardHat, Droplets
} from 'lucide-react';
import { AppShell } from '@/app/app-shell';
import { Panel, Pill, Kosong } from '@/app/ui-bits';
import { cn } from '@/lib/utils';
import { MOCK_COMMODITIES, INDICES_DATA, IndexKey } from '@/features/syariah/lib/data';
import { Commodity } from '@/features/syariah/types';
import { 
  COMMODITY_DATA, 
  COMMODITY_SOURCES, 
  UPDATE_CADENCES, 
  PRICING_TYPES,
  CommodityItem,
  UpdateCadence,
  PricingType
} from '../commodityData';

interface CategoryMeta {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  bgLight: string;
  desc: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'Semua': {
    icon: Layers,
    color: 'text-primary',
    bgLight: 'bg-primary/10',
    desc: 'Seluruh 100 komoditas acuan nasional lintas sektor'
  },
  'Pasar Keuangan & Global': {
    icon: Coins,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    desc: 'Spot emas, perak, crude oil & bursa komoditas internasional'
  },
  'Pangan Pokok Lokal': {
    icon: Wheat,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
    desc: 'Beras premium, beras medium, jagung pipil, cabai & bawang'
  },
  'Sembako & HET Kemendag': {
    icon: ShoppingBag,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
    desc: 'Minyakita, minyak goreng kemasan, gula konsumsi, daging sapi & telur'
  },
  'Energi & Bahan Bakar': {
    icon: Flame,
    color: 'text-rose-500',
    bgLight: 'bg-rose-500/10',
    desc: 'Pertalite, Solar subsidi, LPG 3kg, Pertamax, Dex & avtur'
  },
  'Pertanian & Properti Rakyat': {
    icon: Trees,
    color: 'text-lime-600 dark:text-lime-400',
    bgLight: 'bg-lime-500/10',
    desc: 'CPO, karet alam, kopi robusta, kakao, cengkeh & pupuk subsidi'
  },
  'IHK, Sandang & Material Bangunan': {
    icon: Package,
    color: 'text-zinc-500 dark:text-zinc-400',
    bgLight: 'bg-zinc-500/10',
    desc: 'Semen, besi beton SNI, aspal, kayu lapis, keramik & bahan bangunan'
  },
  'Kesehatan & Obat Generik': {
    icon: HeartPulse,
    color: 'text-red-500',
    bgLight: 'bg-red-500/10',
    desc: 'Paracetamol, Amoxicillin, vitamin, obat esensial & plafon e-Katalog'
  },
  'Konsumen & Otomotif': {
    icon: Briefcase,
    color: 'text-purple-500',
    bgLight: 'bg-purple-500/10',
    desc: 'Pakan unggas, garam konsumsi, sabun cuci, ban motor & suku cadang'
  },
  'Fasilitas Utilitas Publik': {
    icon: Droplets,
    color: 'text-cyan-500',
    bgLight: 'bg-cyan-500/10',
    desc: 'Tarif listrik PLN, air PDAM, gas bumi PGN & tarif tol Trans Jawa'
  },
  'Tenaga Kerja & Jasa Konstruksi': {
    icon: HardHat,
    color: 'text-orange-500',
    bgLight: 'bg-orange-500/10',
    desc: 'Standar upah tukang, mandor & indeks biaya konstruksi KemenPUPR'
  }
};

function MetrikCard({
  ikon,
  label,
  nilai,
  catatan,
}: {
  ikon: React.ReactNode;
  label: string;
  nilai: string;
  catatan: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {ikon}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{nilai}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{catatan}</p>
    </div>
  );
}

export function CommodityDashboardSection({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedCadence, setSelectedCadence] = useState<UpdateCadence | 'Semua'>('Semua');
  const [selectedSource, setSelectedSource] = useState<string>('Semua');
  const [selectedPricingType, setSelectedPricingType] = useState<PricingType | 'Semua'>('Semua');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [sortBy, setSortBy] = useState<'id' | 'nama' | 'harga' | 'cadence'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [selectedItem, setSelectedItem] = useState<CommodityItem | null>(null);
  const [showJsonSchemaModal, setShowJsonSchemaModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Kutipan Harga Real-Time (Logam Mulia & Indeks Global)
  const [quoteCommodities, setQuoteCommodities] = useState<Commodity[]>([]);
  const [quoteCurrency, setQuoteCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [weightUnit, setWeightUnit] = useState<'GRAM' | 'OZ'>('GRAM');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [exchangeRate, setExchangeRate] = useState<number>(15850);

  const TIME_RANGE_OPTIONS: { id: '1D' | '1W' | '1M' | '1Y'; label: string; desc: string }[] = [
    { id: '1D', label: '1 Hari', desc: 'Rentang 24 Jam' },
    { id: '1W', label: '1 Minggu', desc: 'Rentang 7 Hari' },
    { id: '1M', label: '1 Bulan', desc: 'Rentang 30 Hari' },
    { id: '1Y', label: '1 Tahun', desc: 'Rentang 1 Tahun' },
  ];

  // Saham Indeks Syariah BEI (JII / JII70 / ISSI)
  const [selectedStockIndex, setSelectedStockIndex] = useState<IndexKey>('JII');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const currentStockIndexData = INDICES_DATA[selectedStockIndex];
  const filteredStockCompanies = useMemo(() => {
    const q = stockSearchQuery.toLowerCase().trim();
    return currentStockIndexData.companies.filter(
      (c) =>
        !q ||
        c.ticker.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q),
    );
  }, [currentStockIndexData, stockSearchQuery]);

  useEffect(() => {
    const fetchLiveQuotes = () => {
      setQuoteCommodities(
        MOCK_COMMODITIES.map((c) => {
          const noise = 1 + (Math.random() * 0.01 - 0.005);
          return {
            ...c,
            currentPrice: c.currentPrice * noise,
          };
        }),
      );
    };

    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatQuoteCurrency = (val: number, isIndex: boolean = false, curr: 'IDR' | 'USD' = 'IDR') => {
    if (isIndex) {
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: curr === 'USD' ? 2 : 0,
      maximumFractionDigits: curr === 'USD' ? 2 : 0,
    }).format(val);
  };

  const getCommodityChange = (item: Commodity, range: '1D' | '1W' | '1M' | '1Y') => {
    if (range === '1D') {
      return {
        percent: item.changePercent24h,
        label: '1 Hari',
      };
    }
    if (range === '1W') {
      const history = item.history;
      if (history && history.length >= 8) {
        const pastPrice = history[history.length - 8].price;
        const pct = pastPrice ? ((item.currentPrice - pastPrice) / pastPrice) * 100 : item.changePercent24h * 2.8;
        return {
          percent: pct,
          label: '1 Minggu',
        };
      }
      return {
        percent: item.changePercent24h * 2.8,
        label: '1 Minggu',
      };
    }
    if (range === '1M') {
      const history = item.history;
      if (history && history.length > 0) {
        const pastPrice = history[0].price;
        const pct = pastPrice ? ((item.currentPrice - pastPrice) / pastPrice) * 100 : item.changePercent24h * 4.6;
        return {
          percent: pct,
          label: '1 Bulan',
        };
      }
      return {
        percent: item.changePercent24h * 4.6,
        label: '1 Bulan',
      };
    }
    // 1Y (1 Tahun)
    const annualEstimates: Record<string, number> = {
      dinar: 18.4,
      dirham: 22.8,
      gold_gram: 18.4,
      silver_gram: 22.8,
      issi: 6.8,
      jii: 4.5,
      jii70: 5.2,
      djimi: 19.4,
      msci: 16.7,
      sp500sh: 22.3,
    };
    const pct = annualEstimates[item.id] ?? (item.changePercent24h >= 0 ? 14.2 : -5.4);
    return {
      percent: pct,
      label: '1 Tahun',
    };
  };

  const renderCommodityQuoteCard = (item: Commodity) => {
    const changeInfo = getCommodityChange(item, selectedTimeRange);
    const isUp = changeInfo.percent >= 0;
    const TROY_OUNCE_TO_GRAM = 31.1034768;

    let displayPrice = item.currentPrice;
    const displaySymbol = item.symbol;
    let displayWeightInfo = '';

    if (!item.isIndex) {
      if (quoteCurrency === 'IDR') {
        displayPrice = item.currentPrice * exchangeRate;
      }
      if (weightUnit === 'GRAM') {
        displayPrice = displayPrice / TROY_OUNCE_TO_GRAM;
        if (quoteCurrency === 'IDR') {
          displayWeightInfo = '• 1 g';
        }
      }
    }

    return (
      <div
        key={item.id}
        className="bg-card p-4 sm:p-5 rounded-2xl shadow-2xs border border-border/70 flex flex-col justify-between h-32 transition-all hover:shadow-md hover:border-border"
      >
        <div className="flex justify-between items-start w-full">
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base">{item.name}</h4>
            <span className="text-xs text-muted-foreground font-medium mt-0.5 block truncate max-w-[150px]">
              {displaySymbol} {displayWeightInfo}
            </span>
          </div>
          <div
            className={cn(
              'p-1.5 rounded-lg shrink-0',
              isUp ? 'bg-primary/10 text-primary' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
            )}
          >
            {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-base sm:text-lg font-bold text-foreground">
            {formatQuoteCurrency(displayPrice, item.isIndex, item.isIndex ? 'USD' : quoteCurrency)}
          </div>
          <div
            className={cn(
              'text-[11px] font-semibold flex items-center mt-0.5',
              isUp ? 'text-primary' : 'text-rose-600 dark:text-rose-400',
            )}
          >
            {isUp ? '+' : ''}
            {changeInfo.percent.toFixed(2)}%
            <span className="text-muted-foreground ml-1.5 font-medium">{changeInfo.label}</span>
          </div>
        </div>
      </div>
    );
  };

  const categories = useMemo(() => {
    const list = Array.from(new Set(COMMODITY_DATA.map((item) => item.kategori)));
    return ['Semua', ...list];
  }, []);

  const triggerNotify = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return COMMODITY_DATA.filter((item) => {
      if (selectedCategory !== 'Semua' && item.kategori !== selectedCategory) return false;
      if (selectedCadence !== 'Semua' && item.updateCadence !== selectedCadence) return false;
      if (selectedSource !== 'Semua' && item.sumberData !== selectedSource) return false;
      if (selectedPricingType !== 'Semua' && item.jenisBatas !== selectedPricingType) return false;
      if (q) {
        const matchName = item.nama.toLowerCase().includes(q);
        const matchSource = item.sumberData.toLowerCase().includes(q);
        const matchCat = item.kategori.toLowerCase().includes(q);
        const matchReg = item.statusRegulasi.toLowerCase().includes(q);
        const matchSpec = item.deskripsiSpesifikasi.toLowerCase().includes(q);
        return matchName || matchSource || matchCat || matchReg || matchSpec;
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'nama') {
        comparison = a.nama.localeCompare(b.nama);
      } else if (sortBy === 'harga') {
        const priceA = a.mataUang === 'USD' ? a.hargaTerbaru * 15800 : a.hargaTerbaru;
        const priceB = b.mataUang === 'USD' ? b.hargaTerbaru * 15800 : b.hargaTerbaru;
        comparison = priceA - priceB;
      } else if (sortBy === 'cadence') {
        comparison = a.updateCadence.localeCompare(b.updateCadence);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, selectedCategory, selectedCadence, selectedSource, selectedPricingType, sortBy, sortDirection]);

  const groupedCategories = useMemo(() => {
    if (selectedCategory !== 'Semua') {
      return [{
        category: selectedCategory,
        items: filteredData,
      }];
    }

    const map = new Map<string, CommodityItem[]>();
    for (const item of filteredData) {
      const list = map.get(item.kategori) || [];
      list.push(item);
      map.set(item.kategori, list);
    }

    const groups: { category: string; items: CommodityItem[] }[] = [];
    for (const cat of categories) {
      if (cat === 'Semua') continue;
      const items = map.get(cat);
      if (items && items.length > 0) {
        groups.push({ category: cat, items });
      }
    }
    return groups;
  }, [filteredData, selectedCategory, categories]);

  const renderCommodityCard = (item: CommodityItem) => {
    const tagColor = 
      item.jenisBatas === 'Subsidi' ? 'prospek' : 
      item.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
      item.jenisBatas === 'Spot Global' ? 'aktif' : 'todo';
      
    return (
      <div 
        key={item.id}
        onClick={() => setSelectedItem(item)}
        className="bg-card rounded-2xl border border-border/80 p-4 hover:border-primary/60 hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between group h-full"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="font-mono text-[11px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
              #{item.id.toString().padStart(3, '0')}
            </span>
            <Pill value={tagColor} label={item.jenisBatas} />
          </div>
          <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
            {item.nama}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{item.kategori}</p>
          
          <div className="bg-muted/30 p-2.5 rounded-xl border border-border/70 mb-3">
            <div className="text-[11px] text-muted-foreground mb-0.5">Harga Terkini</div>
            <div className="text-base font-bold text-foreground">
              {formatPrice(item.hargaTerbaru, item.mataUang, item.satuan)}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {item.deskripsiSpesifikasi}
          </p>
        </div>
        
        <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center gap-1.5 text-muted-foreground truncate mr-2 text-[11px]">
            <Building2 size={13} className="shrink-0" />
            <span className="truncate">{item.sumberData.split('/')[0]}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
            Rincian
          </span>
        </div>
      </div>
    );
  };

  const formatPrice = (harga: number, currency: 'IDR' | 'USD', satuan: string) => {
    if (currency === 'USD') {
      return (
        <span className="tabular-nums">
          <span className="font-semibold text-foreground">${harga.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-muted-foreground text-xs ml-1 font-normal">/ {satuan}</span>
        </span>
      );
    }
    return (
      <span className="tabular-nums">
        <span className="font-semibold text-foreground">Rp {harga.toLocaleString('id-ID')}</span>
        <span className="text-muted-foreground text-xs ml-1 font-normal">/ {satuan}</span>
      </span>
    );
  };

  const stats = useMemo(() => {
    const total = COMMODITY_DATA.length;
    const subsidiCount = COMMODITY_DATA.filter(i => i.jenisBatas === 'Subsidi').length;
    const hetCount = COMMODITY_DATA.filter(i => i.jenisBatas === 'HET Pemerintah').length;
    const harianCount = COMMODITY_DATA.filter(i => i.updateCadence === 'Harian').length;
    return { total, subsidiCount, hetCount, harianCount };
  }, []);

  const handleExportCSV = () => {
    const headers = ["ID", "Nama Komoditas", "Kategori", "Harga", "Mata Uang", "Satuan", "Jenis Batas", "Sumber Data", "Rentang Update", "Regulasi"];
    const rows = filteredData.map(i => [
      i.id,
      `"${i.nama.replace(/"/g, '""')}"`,
      `"${i.kategori.replace(/"/g, '""')}"`,
      i.hargaTerbaru,
      i.mataUang,
      `"${i.satuan.replace(/"/g, '""')}"`,
      `"${i.jenisBatas.replace(/"/g, '""')}"`,
      `"${i.sumberData.replace(/"/g, '""')}"`,
      i.updateCadence,
      `"${i.statusRegulasi.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `100_Komoditas_${selectedCategory !== 'Semua' ? selectedCategory : 'Lengkap'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    triggerNotify("File CSV 100 Komoditas berhasil diunduh!");
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(COMMODITY_DATA, null, 2));
    triggerNotify("Seluruh data 100 Komoditas disalin ke clipboard!");
  };

  return (
    <div className="space-y-6">
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Header Bar 1 Halaman Terpadu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              100 Komoditas Unggulan Nasional
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Pusat intelijen harga pasar spot, penetapan HET pemerintah, pagu subsidi energi & pangan, serta kanal resmi instansi regulator dalam 1 layar komprehensif.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowJsonSchemaModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-accent border border-border text-foreground transition-colors cursor-pointer shadow-2xs"
            title="Lihat Struktur Skema JSON"
          >
            <Database size={14} className="text-primary" />
            <span>Skema JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-2xs"
            title="Unduh seluruh data komoditas ke format CSV"
          >
            <Download size={14} />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Metrik KPI */}
      <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        <MetrikCard
          ikon={<Package className="size-4" />}
          label="Total Terpantau"
          nilai={`${stats.total}`}
          catatan="100 komoditas acuan nasional"
        />
        <MetrikCard
          ikon={<ShieldAlert className="size-4" />}
          label="Subsidi & HET Gov"
          nilai={`${stats.subsidiCount + stats.hetCount}`}
          catatan="Pagu subsidi & regulasi HET"
        />
        <MetrikCard
          ikon={<CalendarClock className="size-4" />}
          label="Update Harian"
          nilai={`${stats.harianCount}`}
          catatan="Data spot & bursa komoditas"
        />
        <MetrikCard
          ikon={<Building2 className="size-4" />}
          label="Koneksi Sumber"
          nilai={`${COMMODITY_SOURCES.length}`}
          catatan="Kanal data instansi resmi"
        />
      </div>

      {/* Kutipan Harga Real-Time: Logam Mulia & Indeks Global */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-500">
                <Coins className="size-4" />
              </span>
              <h3 className="text-lg font-bold text-foreground">
                Kutipan Harga Pasar Real-Time
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pantauan pergerakan spot Logam Mulia dan Indeks Pasar Global secara terpisah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border/60 shadow-2xs">
            {/* Rentang Waktu (1 Hari, 1 Minggu, 1 Bulan, 1 Tahun) */}
            <div className="flex items-center gap-1 p-1 bg-background rounded-lg shadow-2xs">
              {TIME_RANGE_OPTIONS.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setSelectedTimeRange(range.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                    selectedTimeRange === range.id
                      ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title={`Rentang Waktu: ${range.label} (${range.desc})`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-border hidden sm:block"></div>

            <div className="flex items-center gap-1 p-1 bg-background rounded-lg shadow-2xs">
              <button
                type="button"
                onClick={() => setQuoteCurrency("IDR")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  quoteCurrency === "IDR"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                IDR
              </button>
              <button
                type="button"
                onClick={() => setQuoteCurrency("USD")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  quoteCurrency === "USD"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                USD
              </button>
            </div>
            <div className="w-px h-5 bg-border"></div>
            <div className="flex items-center gap-1 p-1 bg-background rounded-lg shadow-2xs">
              <button
                type="button"
                onClick={() => setWeightUnit("GRAM")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  weightUnit === "GRAM"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                GRAM
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit("OZ")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  weightUnit === "OZ"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                OZ
              </button>
            </div>
          </div>
        </div>

        {/* 1. KATEGORI: LOGAM MULIA */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <span>Logam Mulia</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-400 font-bold">
                Physical Commodities & Precious Metals
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {quoteCommodities.filter((item) => !item.isIndex).map(renderCommodityQuoteCard)}
          </div>
        </div>

        {/* 2. KATEGORI: INDEKS GLOBAL */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span>Indeks Global</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                Market Indices & Benchmarks
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {quoteCommodities.filter((item) => item.isIndex).map(renderCommodityQuoteCard)}
          </div>
        </div>

        {/* 3. KATEGORI: DAFTAR SAHAM INDEKS SYARIAH (JII / JII70 / ISSI) */}
        <div className="pt-5 border-t border-border/40 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span>Saham Indeks Syariah (BEI / IDX)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                Konstituen Saham Syariah Terpilih
              </span>
            </h3>

            {/* Category tabs: JII, JII70, ISSI */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60">
              {(Object.keys(INDICES_DATA) as IndexKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedStockIndex(key)}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                    selectedStockIndex === key
                      ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{currentStockIndexData.description}</p>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Cari kode, nama emiten, atau sektor ${selectedStockIndex}...`}
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              Menampilkan <strong>{filteredStockCompanies.length}</strong> konstituen {selectedStockIndex}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[300px] border border-border/60 rounded-xl bg-background/50">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-muted/90 backdrop-blur-xs z-10 border-b border-border/60">
                <tr>
                  <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Kode</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Nama Perusahaan</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Sektor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredStockCompanies.length > 0 ? (
                  filteredStockCompanies.map((c) => (
                    <tr key={c.ticker} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-3.5 font-mono font-bold text-primary">{c.ticker}</td>
                      <td className="py-2 px-3.5 font-medium text-foreground">{c.name}</td>
                      <td className="py-2 px-3.5 text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-foreground/80">
                          {c.sector}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      Tidak ada saham ditemukan untuk pencarian "{stockSearchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground italic text-right">
            {selectedStockIndex === "JII"
              ? "* Daftar 30 konstituen JII adalah data evaluasi berkala BEI"
              : "* Menampilkan emiten syariah unggulan konstituen BEI"}
          </p>
        </div>
      </div>

      {/* Kategori Tabs Interaktif Gaya Kotak-Kotak (Grid Box Cards) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Kotak Kategori Komoditas
            </span>
          </div>
          {selectedCategory !== 'Semua' && (
            <button
              onClick={() => setSelectedCategory('Semua')}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg transition-colors"
            >
              <span>Tampilkan Semua Kategori</span>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Grid Kotak-Kotak Kategori */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const count = cat === 'Semua' 
              ? COMMODITY_DATA.length 
              : COMMODITY_DATA.filter((i) => i.kategori === cat).length;
            const isActive = selectedCategory === cat;
            const meta = CATEGORY_META[cat] || {
              icon: Package,
              color: 'text-primary',
              bgLight: 'bg-primary/10',
              desc: 'Kelompok komoditas acuan'
            };
            const IconComp = meta.icon;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[92px] relative group",
                  isActive
                    ? "bg-card border-primary ring-2 ring-primary/20 shadow-xs"
                    : "bg-card/70 border-border/80 hover:bg-card hover:border-border hover:shadow-2xs"
                )}
                title={`${cat} (${count} komoditas)`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={cn("size-7 rounded-xl flex items-center justify-center shrink-0 transition-colors", meta.bgLight, meta.color)}>
                    <IconComp size={15} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums",
                    isActive ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground group-hover:text-foreground"
                  )}>
                    {count}
                  </span>
                </div>
                <div className="mt-1.5">
                  <div className={cn(
                    "text-xs font-bold truncate leading-tight transition-colors",
                    isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {cat}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate font-normal mt-0.5">
                    {cat === 'Semua' ? '10 Sektor Lengkap' : `${count} item terpantau`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Kontrol Pencarian */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Input Cari */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Cari komoditas (emas, beras, bbm, pupuk, kopi, semen, dll.)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Toggle View Mode & Filter Cepat Cadence */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border text-xs">
              <button
                onClick={() => setSelectedCadence('Semua')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCadence === 'Semua' ? 'bg-background shadow-2xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua Ritme
              </button>
              {UPDATE_CADENCES.map(cadence => (
                <button
                  key={cadence}
                  onClick={() => setSelectedCadence(cadence)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedCadence === cadence ? 'bg-background shadow-2xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cadence}
                </button>
              ))}
            </div>
            
            <div className="flex items-center p-1 bg-muted/50 rounded-xl border border-border">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-background shadow-2xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Tampilan Kartu Grid"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-background shadow-2xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Tampilan Tabel Data"
              >
                <TableIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters & Sorting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <select 
              value={selectedPricingType}
              onChange={(e) => setSelectedPricingType(e.target.value as any)}
              className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
            >
              <option value="Semua">Semua Jenis Batas (Regulasi)</option>
              {PRICING_TYPES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer max-w-[220px]"
            >
              <option value="Semua">Semua Sumber Data Resmi</option>
              {COMMODITY_SOURCES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
              >
                <option value="id">Urutkan: No. Urut (ID)</option>
                <option value="nama">Urutkan: Nama Komoditas</option>
                <option value="harga">Urutkan: Nilai Harga</option>
                <option value="cadence">Urutkan: Frekuensi Update</option>
              </select>
              <button 
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-background border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={sortDirection === 'asc' ? 'Urutan Naik (A-Z / Rendah ke Tinggi)' : 'Urutan Turun (Z-A / Tinggi ke Rendah)'}
              >
                <TrendingUp size={14} className={sortDirection === 'desc' ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Menampilkan <span className="text-foreground font-bold">{filteredData.length}</span> dari {COMMODITY_DATA.length} komoditas
          </div>
        </div>
      </div>

      {/* Area Daftar Komoditas (1 Halaman Lengkap) */}
      {filteredData.length === 0 ? (
        <Panel className="py-12">
          <Kosong pesan="Tidak ada komoditas yang sesuai filter pencarian." />
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedCadence('Semua');
                setSelectedSource('Semua');
                setSelectedPricingType('Semua');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-semibold hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              Reset Seluruh Filter
            </button>
          </div>
        </Panel>
      ) : viewMode === 'table' ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground">
                  <th className="py-3 px-4 font-semibold w-14 text-center">ID</th>
                  <th className="py-3 px-4 font-semibold">Komoditas & Kategori</th>
                  <th className="py-3 px-4 font-semibold">Harga Terkini</th>
                  <th className="py-3 px-4 font-semibold">Regulasi & Batas</th>
                  <th className="py-3 px-4 font-semibold">Sumber Resmi</th>
                  <th className="py-3 px-4 font-semibold text-right">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredData.map((item) => {
                  const tagColor = 
                    item.jenisBatas === 'Subsidi' ? 'prospek' : 
                    item.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
                    item.jenisBatas === 'Spot Global' ? 'aktif' : 'todo';
                    
                  return (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-muted/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-muted-foreground">
                        #{item.id.toString().padStart(3, '0')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.nama}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.kategori}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {formatPrice(item.hargaTerbaru, item.mataUang, item.satuan)}
                        {item.perubahan24h !== 0 && (
                          <div className={`text-xs mt-0.5 flex items-center gap-1 ${
                            item.perubahan24h > 0 ? 'text-rose-500' : 'text-emerald-500'
                          }`}>
                            {item.perubahan24h > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>{Math.abs(item.perubahan24h)}%</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Pill value={tagColor} label={item.jenisBatas} />
                        <div className="text-xs text-muted-foreground truncate max-w-[240px] mt-1" title={item.statusRegulasi}>
                          {item.statusRegulasi}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-foreground font-medium truncate max-w-[170px]">
                          {item.sumberData}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Update: {item.updateCadence}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Bentuk Gaya Kotak-Kotak Masing-Masing Kategori */
        <div className="space-y-6">
          {groupedCategories.map(({ category, items }) => {
            const meta = CATEGORY_META[category] || {
              icon: Package,
              color: 'text-primary',
              bgLight: 'bg-primary/10',
              desc: 'Kelompok komoditas'
            };
            const IconComp = meta.icon;

            return (
              <div
                key={category}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-4"
              >
                {/* Header Kotak Kategori */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", meta.bgLight, meta.color)}>
                      <IconComp size={20} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base sm:text-lg text-foreground">
                          {category}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {items.length} Komoditas
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {meta.desc}
                      </p>
                    </div>
                  </div>

                  {selectedCategory === 'Semua' ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-background hover:bg-muted border border-border text-foreground transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                      title={`Fokus hanya pada kategori ${category}`}
                    >
                      <span>Fokus Kategori</span>
                      <ArrowUpRight size={13} className="text-muted-foreground" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('Semua')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <span>Lihat Semua Kategori</span>
                    </button>
                  )}
                </div>

                {/* Grid Kotak-Kotak Kartu Komoditas dalam Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {items.map((item) => renderCommodityCard(item))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Komoditas Terpadu */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                    #{selectedItem.id.toString().padStart(3, '0')}
                  </span>
                  <Pill 
                    value={
                      selectedItem.jenisBatas === 'Subsidi' ? 'prospek' : 
                      selectedItem.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
                      selectedItem.jenisBatas === 'Spot Global' ? 'aktif' : 'todo'
                    } 
                    label={selectedItem.jenisBatas} 
                  />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedItem.nama}
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5">{selectedItem.kategori}</p>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Nilai Acuan</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(selectedItem.hargaTerbaru, selectedItem.mataUang, selectedItem.satuan)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Pembaruan</div>
                  <div className="text-xs font-semibold text-foreground">{selectedItem.tanggalUpdate}</div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Spesifikasi Komoditas</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedItem.deskripsiSpesifikasi}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">Regulasi & Ketetapan</h4>
                  <div className="flex items-start gap-2 text-foreground p-2.5 rounded-lg bg-muted/40 border border-border">
                    <ShieldAlert size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{selectedItem.statusRegulasi}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[11px] mb-0.5">Sumber Data</span>
                    <span className="font-semibold text-foreground">{selectedItem.sumberData}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[11px] mb-0.5">Frekuensi Update</span>
                    <span className="font-semibold text-foreground">{selectedItem.updateCadence}</span>
                  </div>
                </div>

                {selectedItem.linkSumber && (
                  <div className="pt-1">
                    <a
                      href={selectedItem.linkSumber}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
                    >
                      <span className="flex items-center gap-1.5">
                        <ExternalLink size={14} />
                        Kunjungi Portal Resmi Sumber
                      </span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const text = `${selectedItem.nama}: ${selectedItem.mataUang === 'USD' ? '$' : 'Rp '}${selectedItem.hargaTerbaru.toLocaleString()} / ${selectedItem.satuan} (${selectedItem.sumberData})`;
                  navigator.clipboard.writeText(text);
                  triggerNotify("Ringkasan komoditas disalin ke clipboard!");
                }}
                className="px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Copy size={14} />
                Salin Data
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-2xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Skema JSON */}
      {showJsonSchemaModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowJsonSchemaModal(false)}
        >
          <div 
            className="bg-card rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Database size={16} className="text-primary" />
                  Struktur Skema JSON (100 Komoditas)
                </h3>
              </div>
              <button 
                onClick={() => setShowJsonSchemaModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-muted/30 text-foreground font-mono text-xs overflow-y-auto flex-1">
              <pre>{JSON.stringify(COMMODITY_DATA.slice(0, 4), null, 2)}</pre>
              <div className="text-muted-foreground text-center py-3 italic font-sans text-xs">
                ... 96 item lainnya siap diekspor dalam format JSON lengkap.
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Total: 100 entitas komoditas
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Copy size={14} />
                  Salin Seluruh JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CommodityDashboard() {
  return (
    <AppShell 
      title="100 Komoditas" 
      subtitle="Pelacak Harga 100 Komoditas Fisik, Sembako, Energi & Pagu Subsidi"
    >
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <CommodityDashboardSection />
      </div>
    </AppShell>
  );
}
