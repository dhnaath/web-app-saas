import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlarmClock,
  AlertOctagon,
  AlertTriangle,
  Archive,
  ArrowRight,
  ArrowRightLeft,
  Award,
  BarChart3,
  Bell,
  Book,
  BookOpen,
  Bookmark,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Camera,
  Car,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock,
  CloudSun,
  Code,
  Coins,
  Compass,
  CreditCard,
  Database,
  DollarSign,
  Droplet,
  Dumbbell,
  ExternalLink,
  FileBarChart,
  FileCheck,
  FileHeart,
  FileText,
  Film,
  Flame,
  FolderKanban,
  Fuel,
  Gamepad2,
  Gift,
  GitCommit,
  GitFork,
  Globe,
  GraduationCap,
  Grid2X2,
  HardDrive,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  Key,
  Layers,
  LayoutGrid,
  Lightbulb,
  LineChart,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Moon,
  Music,
  Navigation,
  Network,
  NotebookText,
  Package,
  PackageCheck,
  PartyPopper,
  PenTool,
  PhoneCall,
  PieChart,
  Pill,
  Plane,
  Podcast,
  Receipt,
  RefreshCw,
  RotateCcw,
  Scale,
  Scissors,
  ScrollText,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Smile,
  Snowflake,
  Sparkles,
  Sprout,
  Star,
  Store,
  Target,
  ThumbsUp,
  Ticket,
  Type,
  UserCheck,
  Users,
  Utensils,
  Wallet,
  Workflow,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

export type AppModulePillar = "all" | "productivity" | "personal" | "people";

export interface StandaloneSubFeature {
  title: string;
  to: string;
  icon: LucideIcon;
}

export interface UnifiedAppModuleDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  pillar: "productivity" | "personal" | "people";
  pillarLabel: string;
  category: string;
  categoryLabel: string;
  icon: LucideIcon;
  badge: string;
  accentGradient: string;
  features: StandaloneSubFeature[];
}

// 6 Master Workspaces yang menyatukan seluruh 47+ modul aplikasi
export const ALL_APP_MODULES: UnifiedAppModuleDef[] = [
  // 1. Work and Productivity (9 Modul)
  {
    id: "work-productivity",
    to: "/work-productivity",
    title: "Work and Productivity",
    subtitle:
      "Semua (9) · Execution (3) · Partners (2) · Control (3) · Ownership (1). Pusat orkestrasi operasional terpadu: pantau eksekusi proyek & target sasaran, kelola kemitraan vendor & pengadaan PO, tegakkan kontrol & audit regulasi, serta pantau struktur saham cap table.",
    pillar: "productivity",
    pillarLabel: "Productivity & Operations",
    category: "work-execution",
    categoryLabel: "Work & Execution",
    icon: Briefcase,
    badge: "9 Modul",
    accentGradient: "from-blue-600 to-indigo-700",
    features: [
      { title: "Target & Milestone", to: "/peh/milestones", icon: Target },
      { title: "Alur Kerja & Pipeline", to: "/peh/workflows", icon: Workflow },
      { title: "Pipeline Produksi Konten", to: "/peh/projects", icon: Layers },
      { title: "Vendor & Mitra Layanan", to: "/peh/vendors", icon: Building2 },
      { title: "Pengadaan & Purchase Orders", to: "/peh/procurement", icon: Receipt },
      { title: "Notulensi & Keputusan Rapat", to: "/peh/meetings", icon: FileCheck },
      { title: "Log Masalah & Insiden", to: "/peh/incidents", icon: AlertOctagon },
      { title: "Kepatuhan & Audit Regulasi", to: "/peh/compliance", icon: ShieldCheck },
      { title: "Struktur Saham & Cap Table", to: "/peh/cap-table", icon: PieChart },
      { title: "Project Manager", to: "/proyek", icon: FolderKanban },
      { title: "Task Manager", to: "/task-manager", icon: CheckSquare },
      { title: "Kanban Board", to: "/kanban", icon: LayoutGrid },
      { title: "Eisenhower Matrix", to: "/eisenhower", icon: Grid2X2 },
      { title: "Timeline & Gantt", to: "/timeline", icon: GitCommit },
      { title: "Deliverable Manager", to: "/deliverable-manager", icon: PackageCheck },
      { title: "Approval Manager", to: "/approval-manager", icon: ShieldCheck },
      { title: "Time Clock", to: "/lainnya?app=time-clock", icon: Clock },
      { title: "Ticket Desk", to: "/lainnya?app=ticket-desk", icon: Ticket },
      { title: "Handover Notes", to: "/lainnya?app=handover-notes", icon: FileText },
    ],
  },

  // 2. Business Operations and Customers (7 Modul)
  {
    id: "business-operations-and-customers",
    to: "/business-operations",
    title: "Business Operations and Customers",
    subtitle:
      "Semua (7) · Supply (2) · Customers (3) · Back Office (2). Pusat operasional rantai pasok: pengadaan vendor & stok produk pergudangan, manajemen CRM klien & portal kolaborasi, alur antrean layanan, serta tata kelola aset belanja back office.",
    pillar: "productivity",
    pillarLabel: "Productivity & Operations",
    category: "business-customers",
    categoryLabel: "Business & Customers",
    icon: Store,
    badge: "7 Modul",
    accentGradient: "from-amber-500 to-orange-600",
    features: [
      { title: "Vendors and Procurement", to: "/peh/vendors", icon: Building2 },
      { title: "Vendor Directory", to: "/peh/vendors", icon: Building2 },
      { title: "Pengadaan & Purchase Orders", to: "/peh/procurement", icon: Receipt },
      { title: "Service Rates", to: "/lainnya?app=services-ratecard", icon: DollarSign },
      { title: "Resource Manager", to: "/resource-manager", icon: Briefcase },
      { title: "Products and Stock", to: "/katalog-produk", icon: Package },
      { title: "Product Catalog", to: "/katalog-produk", icon: PackageCheck },
      { title: "Inventory", to: "/inventory", icon: Archive },
      { title: "Batch Track", to: "/lainnya?app=batch-track", icon: Boxes },
      { title: "Cold Chain", to: "/lainnya?app=cold-chain", icon: Snowflake },
      { title: "Client Records", to: "/klien", icon: Briefcase },
      { title: "Clients Directory", to: "/klien", icon: Briefcase },
      { title: "Contacts CRM", to: "/contacts", icon: Users },
      { title: "Client Orders", to: "/lainnya?app=client-orders", icon: FileBarChart },
      { title: "Custom Reports", to: "/lainnya?app=custom-reports", icon: BarChart3 },
      { title: "Client Communication", to: "/portal", icon: MessagesSquare },
      { title: "Collab Portal", to: "/portal", icon: Building2 },
      { title: "Client Messages", to: "/portal/pesan", icon: MessagesSquare },
      { title: "Interaction Manager", to: "/interaction-manager", icon: Network },
      { title: "Feedback Loop", to: "/lainnya?app=feedback-loop", icon: ThumbsUp },
      { title: "Service Flow", to: "/lainnya?app=queue-line", icon: Clock },
      { title: "Queue Line", to: "/lainnya?app=queue-line", icon: Clock },
      { title: "Book Slot", to: "/lainnya?app=book-slot", icon: CalendarCheck },
      { title: "Visitor Log", to: "/lainnya?app=visitor-log", icon: UserCheck },
      { title: "Loyalty Point", to: "/lainnya?app=loyalty-point", icon: Award },
      { title: "Spending and Assets", to: "/expense-tracker", icon: Receipt },
      { title: "Expense Tracker", to: "/expense-tracker", icon: Receipt },
      { title: "Subscription Manager", to: "/subscription-manager", icon: CreditCard },
      { title: "Asset Manager", to: "/asset-manager", icon: HardDrive },
      { title: "Data and Access", to: "/statistics", icon: LineChart },
      { title: "Statistics", to: "/statistics", icon: LineChart },
      { title: "Search Manager", to: "/search-manager", icon: Search },
      { title: "Access Directory", to: "/lainnya?app=access-matrix", icon: Key },
    ],
  },

  // 3. Knowledge and Learning (7 Modul)
  {
    id: "knowledge-and-learning",
    to: "/knowledge-and-learning",
    title: "Knowledge and Learning",
    subtitle:
      "Semua (7) · Documents (3) · Learning (2) · Creative (2). Pangkalan riset literatur & kurikulum: repositori dokumen & wiki pangkalan data, silabus kursus & flashcard hafalan, kredensial legal sertifikat, studio desain visual, serta editor kode digital.",
    pillar: "personal",
    pillarLabel: "Personal & Household",
    category: "knowledge-learning",
    categoryLabel: "Knowledge & Learning",
    icon: GraduationCap,
    badge: "7 Modul",
    accentGradient: "from-purple-500 to-indigo-600",
    features: [
      { title: "Notes and Documents", to: "/notes", icon: FileText },
      { title: "Notes", to: "/notes", icon: FileText },
      { title: "Quick Notes", to: "/catatan", icon: NotebookText },
      { title: "Documents", to: "/documents", icon: FileCheck },
      { title: "Database", to: "/database", icon: Database },
      { title: "Knowledge Library", to: "/knowledge-base", icon: BookOpen },
      { title: "Wiki Engine", to: "/wiki", icon: BookOpen },
      { title: "Bookmark Manager", to: "/bookmarks", icon: Bookmark },
      { title: "Incoterms Guide", to: "/incoterms", icon: Navigation },
      { title: "Research and Reading", to: "/research-manager", icon: Compass },
      { title: "Web Clipper", to: "/web-clipper", icon: Scissors },
      { title: "Reading List MVP", to: "/reading", icon: Book },
      { title: "Courses and Study", to: "/courses", icon: GraduationCap },
      { title: "Courses", to: "/courses", icon: GraduationCap },
      { title: "Flashcards", to: "/flashcards", icon: Layers },
      { title: "Exams", to: "/exams", icon: FileCheck },
      { title: "Skills and Credentials", to: "/languages", icon: Globe },
      { title: "Languages", to: "/languages", icon: Globe },
      { title: "Training Track", to: "/lainnya?app=training-track", icon: Award },
      { title: "Sertifikat & Dokumen Legal", to: "/vault?tab=certificates", icon: FileCheck },
      { title: "Ideas and Design", to: "/ideas", icon: Lightbulb },
      { title: "Ideas Board", to: "/ideas", icon: Lightbulb },
      { title: "Design Studio", to: "/design", icon: PenTool },
      { title: "Photography", to: "/photography", icon: Camera },
      { title: "Writing and Code", to: "/writing", icon: Type },
      { title: "Writing Editor", to: "/writing", icon: Type },
      { title: "Code Dev", to: "/code", icon: Code },
      { title: "Hak Cipta & Aset Digital", to: "/asset-manager", icon: ShieldCheck },
    ],
  },

  // 4. Personal Life (5 Modul)
  {
    id: "personal-life",
    to: "/personal-life",
    title: "Personal Life",
    subtitle:
      "Semua (5) · Habits and Mind (2) · Body and Health (2) · Personal Tools (1). Ruang gaya hidup privat: pelacak konsistensi kebiasaan, perencana hidup mandiri & wishlist, jurnal refleksi batin, kebugaran fisik, rekam medis dokter, serta brankas kata sandi.",
    pillar: "personal",
    pillarLabel: "Personal & Household",
    category: "personal-life",
    categoryLabel: "Personal & Habits",
    icon: Heart,
    badge: "5 Modul",
    accentGradient: "from-emerald-500 to-teal-600",
    features: [
      { title: "Habits and Planning", to: "/habit-tracker", icon: Flame },
      { title: "Habit Tracker MVP", to: "/habit-tracker", icon: Flame },
      { title: "Life Planner Hub", to: "/life/life-planner", icon: Sparkles },
      { title: "Personal Projects", to: "/proyek-personal", icon: Briefcase },
      { title: "Wishlist & Tabungan Impian", to: "/life/wishlist", icon: Gift },
      { title: "Journaling", to: "/journal", icon: BookOpen },
      { title: "Daily Journal", to: "/journal", icon: BookOpen },
      { title: "Gratitude Journal", to: "/journal?tab=gratitude", icon: Heart },
      { title: "Mood Tracker MVP", to: "/journal?tab=mood", icon: Smile },
      { title: "Fitness and Sleep", to: "/health?tab=workouts", icon: Dumbbell },
      { title: "Workouts", to: "/health?tab=workouts", icon: Dumbbell },
      { title: "Sleep Quality MVP", to: "/health?tab=sleep", icon: Moon },
      { title: "Body Metrics", to: "/health?tab=body-metrics", icon: Scale },
      { title: "Water Intake", to: "/health?tab=water", icon: Droplet },
      { title: "Health Records", to: "/health", icon: HeartPulse },
      { title: "Health Tracker", to: "/health", icon: Activity },
      { title: "Medical Records", to: "/health?tab=medical-records", icon: FileHeart },
      { title: "Vitals Tracker", to: "/health?tab=vitals", icon: HeartPulse },
      { title: "Med Reminder", to: "/lainnya?app=med-reminder", icon: Pill },
      { title: "Skincare Log", to: "/health?tab=skincare", icon: Sparkles },
      { title: "Personal Tools", to: "/passwords", icon: Key },
      { title: "Passwords", to: "/passwords", icon: Key },
      { title: "Utilities", to: "/kalkulator", icon: Calculator },
    ],
  },

  // 5. Home and Leisure (6 Modul)
  {
    id: "home-leisure",
    to: "/home-and-leisure",
    title: "Home and Leisure",
    subtitle:
      "Semua (6) · Home (2) · Vehicle (2) · Leisure (2). Tata kelola hunian domestik, logistik dapur & belanja sembako, registrasi servis kendaraan garasi, perencana liburan & cuaca, serta pemutar hiburan santai.",
    pillar: "people",
    pillarLabel: "People & Society",
    category: "home-leisure",
    categoryLabel: "Home & Leisure",
    icon: Home,
    badge: "6 Modul",
    accentGradient: "from-cyan-500 to-blue-600",
    features: [
      { title: "Household Care", to: "/lainnya?app=home-chores", icon: Home },
      { title: "Piket & Tugas Domestik", to: "/lainnya?app=home-chores", icon: CheckSquare },
      { title: "Servis & Perawatan Rumah", to: "/lainnya?app=appliance-care", icon: Wrench },
      { title: "Tanaman & Kebun", to: "/peh/plants", icon: Sprout },
      { title: "Inventaris Rumah & Elektronik", to: "/lainnya?app=home-inventory", icon: Archive },
      { title: "Kitchen and Shopping", to: "/recipes", icon: Utensils },
      { title: "Pantry Inventory", to: "/recipes?tab=pantry", icon: Archive },
      { title: "Cook Log", to: "/recipes?tab=cook-log", icon: BookOpen },
      { title: "Expiry Alert", to: "/recipes?tab=expiry", icon: AlertTriangle },
      { title: "Leftover Manager", to: "/recipes?tab=leftovers", icon: RefreshCw },
      { title: "Meal Planner", to: "/recipes?tab=meal-planner", icon: CalendarDays },
      { title: "Shopping List", to: "/shopping", icon: ShoppingCart },
      { title: "Vehicle Records", to: "/lainnya?app=vehicle-identity", icon: Car },
      { title: "Vehicle Registry", to: "/lainnya?app=vehicle-identity", icon: Car },
      { title: "Vehicle Renewals", to: "/lainnya?app=vehicle-renewals", icon: CalendarDays },
      { title: "Vehicle Logbook", to: "/lainnya?app=vehicle-logbook", icon: BookOpen },
      { title: "Vehicle Care", to: "/lainnya?app=mileage-fuel", icon: Fuel },
      { title: "Fuel Log", to: "/lainnya?app=mileage-fuel", icon: Fuel },
      { title: "Service History", to: "/lainnya?app=vehicle-service", icon: Wrench },
      { title: "Parts Lifecycle", to: "/lainnya?app=parts-lifecycle", icon: RefreshCw },
      { title: "Travel and Weather", to: "/trips", icon: Plane },
      { title: "Trip Planner", to: "/trips", icon: Plane },
      { title: "Weather", to: "/weather", icon: CloudSun },
      { title: "Entertainment", to: "/movies", icon: Film },
      { title: "Movies", to: "/movies", icon: Film },
      { title: "Games", to: "/games", icon: Gamepad2 },
      { title: "Podcasts", to: "/podcasts", icon: Podcast },
      { title: "Music", to: "/music", icon: Music },
    ],
  },

  // 6. Family and Community (9 Modul)
  {
    id: "family-community",
    to: "/family-and-community",
    title: "Family and Community",
    subtitle:
      "Semua (9) · Family (3) · Relationships (2) · Neighborhood (3) · Giving (1). Hub kehangatan keluarga besar: pohon silsilah genealogi, proteksi tanggap darurat, tabungan bersama, silaturahmi relasi, paguyuban RT/RW & aspirasi fasum, serta filantropi dampak sosial.",
    pillar: "people",
    pillarLabel: "People & Society",
    category: "family-community",
    categoryLabel: "Family & Community",
    icon: Users,
    badge: "9 Modul",
    accentGradient: "from-rose-500 to-pink-600",
    features: [
      { title: "Family Records", to: "/lainnya?app=family-tree", icon: GitFork },
      { title: "Family Tree", to: "/lainnya?app=family-tree", icon: GitFork },
      { title: "Family Archive", to: "/lainnya?app=family-archive", icon: Archive },
      { title: "House Rules", to: "/lainnya?app=family-rules", icon: Scale },
      { title: "Resep Warisan Keluarga", to: "/peh/family-recipes", icon: Utensils },
      { title: "Family Safety", to: "/lainnya?app=emergency-hub", icon: ShieldAlert },
      { title: "Medical Profile", to: "/lainnya?app=medical-family", icon: HeartHandshake },
      { title: "Disaster Prep", to: "/lainnya?app=disaster-prep", icon: ShieldAlert },
      { title: "Emergency Contacts", to: "/lainnya?app=emergency-hub", icon: PhoneCall },
      { title: "Family Life", to: "/peh/family-budget", icon: Heart },
      { title: "Tabungan & Dana Bersama", to: "/peh/family-budget", icon: Wallet },
      { title: "Carpool Plan", to: "/lainnya?app=carpool-plan", icon: Car },
      { title: "Bermain dengan Anabul", to: "/peh/pet-care", icon: Smile },
      { title: "Staying in Touch", to: "/lainnya?app=circle-groups", icon: Network },
      { title: "Relation Circles", to: "/lainnya?app=circle-groups", icon: Network },
      { title: "Catchup Reminder", to: "/lainnya?app=catchup-cadence", icon: PhoneCall },
      { title: "Meeting Timeline", to: "/lainnya?app=meeting-timeline", icon: CalendarDays },
      { title: "Borrow Log MVP", to: "/lainnya?app=borrowed-items", icon: ArrowRightLeft },
      { title: "Celebrations", to: "/lainnya?app=gift-tracker", icon: Gift },
      { title: "Gift Tracker", to: "/lainnya?app=gift-tracker", icon: Gift },
      { title: "Reunion Planner", to: "/lainnya?app=reunion-planner", icon: PartyPopper },
      { title: "Anniversary Tracker", to: "/lainnya?app=family-anniversary", icon: CalendarDays },
      { title: "Neighbors and Board", to: "/lainnya?app=rt-rw-directory", icon: Users },
      { title: "Neighbor Directory", to: "/lainnya?app=rt-rw-directory", icon: Users },
      { title: "Neighbor Community", to: "/komunitas-warga", icon: Home },
      { title: "Community Board", to: "/lainnya?app=community-announcements", icon: Megaphone },
      { title: "Membership Card", to: "/lainnya?app=membership-card", icon: CreditCard },
      { title: "Civic Services", to: "/lainnya?app=public-services-guide", icon: Compass },
      { title: "Services Guide", to: "/lainnya?app=public-services-guide", icon: Compass },
      { title: "Civil Registry", to: "/lainnya?app=civil-registry", icon: FileCheck },
      { title: "Civic Tax", to: "/lainnya?app=tax-civic", icon: Receipt },
      { title: "Civic Compliance", to: "/peh/civic", icon: Scale },
      { title: "Aspirasi & Laporan Fasum", to: "/komunitas-warga?tab=aspirasi", icon: MessageSquare },
      { title: "Civic Agenda", to: "/lainnya?app=civic-calendar", icon: CalendarDays },
      { title: "Civic Calendar", to: "/lainnya?app=civic-calendar", icon: CalendarDays },
      { title: "Meeting Resolutions", to: "/lainnya?app=meeting-resolutions", icon: ScrollText },
      { title: "Giving and Impact", to: "/zakat", icon: Coins },
      { title: "Giving", to: "/zakat", icon: Coins },
      { title: "Donation Log MVP", to: "/lainnya?app=donation-tracker", icon: Coins },
      { title: "Volunteer Log MVP", to: "/lainnya?app=volunteer-log", icon: Heart },
      { title: "Social Impact", to: "/peh/charity", icon: HeartHandshake },
    ],
  },
];

interface AppModuleSectionProps {
  favorites?: string[];
  toggleFavorite?: (id: string) => void;
  getGradient?: (id: string) => string;
}

const MasterWorkspaceFlipCard = ({
  app,
  isFavorite,
  onToggleFavorite,
}: {
  app: UnifiedAppModuleDef;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = app.icon;
  const featuresCount = app.features?.length || 0;

  return (
    <div
      className="group h-[360px] w-full [perspective:1200px]"
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="relative h-full w-full rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] shadow-sm hover:shadow-md"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT CARD */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-card border border-border/80 [backface-visibility:hidden] overflow-hidden">
          <div>
            {/* Header: Icon, Badges, Title & Fav */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`size-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${app.accentGradient} text-white shadow-md shadow-primary/15 group-hover:scale-105 transition-transform shrink-0`}
                >
                  <Icon className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-primary/80">
                      {app.categoryLabel}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {app.badge}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug mt-0.5">
                    {app.title}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(app.id);
                }}
                className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
                title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              >
                <Star
                  className={`size-4 ${
                    isFavorite
                      ? "fill-amber-400 text-amber-500"
                      : "text-muted-foreground/60"
                  }`}
                />
              </button>
            </div>

            {/* Subtitle / Description */}
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mt-3">
              {app.subtitle}
            </p>
          </div>

          {/* Sub-features preview list */}
          <div className="pt-3 border-t border-border/50 flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-2">
              <span>{featuresCount} Sub-Fitur & Aplikasi</span>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
              >
                Buka Direktori
                <ChevronRight className="size-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-hidden">
              {app.features.slice(0, 4).map((f) => {
                const SubIcon = f.icon;
                return (
                  <Link
                    key={f.title}
                    to={f.to as any}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/60 hover:bg-primary/15 hover:text-primary transition-colors text-foreground/85 border border-border/40 truncate max-w-[170px]"
                  >
                    <SubIcon className="size-3 shrink-0 text-primary/70" />
                    <span className="truncate">{f.title}</span>
                  </Link>
                );
              })}
              {featuresCount > 4 && (
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  +{featuresCount - 4} lainnya
                </button>
              )}
            </div>
          </div>

          {/* Bottom Launch Button */}
          <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center gap-2">
            <Link
              to={app.to as any}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 active:scale-98 transition-all shadow-xs"
            >
              <span>Buka Halaman {app.title}</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="size-9 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0"
              title="Balik kartu untuk rincian semua modul"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>

        {/* BACK CARD */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 rounded-3xl bg-card border border-border/80 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
          <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Icon className="size-4.5 text-primary" />
              <h5 className="text-sm font-bold text-foreground truncate max-w-[210px]">
                {app.title} — Semua Modul
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="size-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              title="Kembali ke depan"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-1">
            {app.features.map((f) => {
              const SubIcon = f.icon;
              return (
                <Link
                  key={f.title}
                  to={f.to as any}
                  className="flex items-center justify-between p-1.5 px-2 rounded-lg hover:bg-muted/80 text-xs text-foreground/90 transition-colors group/item"
                >
                  <div className="flex items-center gap-2 truncate">
                    <SubIcon className="size-3.5 text-primary/70 group-hover/item:text-primary transition-colors shrink-0" />
                    <span className="truncate font-medium">{f.title}</span>
                  </div>
                  <ChevronRight className="size-3 text-muted-foreground/60 group-hover/item:text-foreground group-hover/item:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2.5 border-t border-border/40">
            <Link
              to={app.to as any}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
            >
              <span>Masuk ke {app.title}</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AppModuleSection({
  favorites = [],
  toggleFavorite = () => {},
}: AppModuleSectionProps) {
  const [activePillar, setActivePillar] = useState<AppModulePillar>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Subcategory list based on active pillar
  const availableSubcategories = useMemo(() => {
    const list = ALL_APP_MODULES.filter(
      (app) => activePillar === "all" || app.pillar === activePillar
    );
    const set = new Set<string>();
    list.forEach((app) => set.add(app.categoryLabel));
    return Array.from(set);
  }, [activePillar]);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return ALL_APP_MODULES.filter((app) => {
      const matchPillar =
        activePillar === "all" || app.pillar === activePillar;
      const matchSub =
        activeSubcategory === "all" || app.categoryLabel === activeSubcategory;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        app.title.toLowerCase().includes(q) ||
        app.subtitle.toLowerCase().includes(q) ||
        app.categoryLabel.toLowerCase().includes(q) ||
        app.pillarLabel.toLowerCase().includes(q) ||
        app.features?.some((f) => f.title.toLowerCase().includes(q));

      return matchPillar && matchSub && matchQuery;
    });
  }, [activePillar, activeSubcategory, searchQuery]);

  const countAll = ALL_APP_MODULES.length;
  const countProductivity = ALL_APP_MODULES.filter(
    (a) => a.pillar === "productivity"
  ).length;
  const countPersonal = ALL_APP_MODULES.filter(
    (a) => a.pillar === "personal"
  ).length;
  const countPeople = ALL_APP_MODULES.filter((a) => a.pillar === "people").length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-5 sm:mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <LayoutGrid className="size-6 sm:size-7 text-primary" />
          <span>App Module — 6 Master Workspaces</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-3xl mx-auto leading-relaxed">
          Semua bagian telah dileburkan dan diiriskan ke dalam 6 halaman workspace terpadu: Work and Productivity (9 Modul), Business Operations and Customers (7 Modul), Knowledge and Learning (7 Modul), Personal Life (5 Modul), Home and Leisure (6 Modul), dan Family and Community (9 Modul).
        </p>
      </div>

      {/* 3 Pillar Tabs Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full mb-3">
        <button
          onClick={() => {
            setActivePillar("all");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "all"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Layers className="size-4 shrink-0" />
          <span>Semua Workspace</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "all"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countAll}
          </span>
        </button>

        <button
          onClick={() => {
            setActivePillar("productivity");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "productivity"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <CheckSquare className="size-4 shrink-0" />
          <span>Productivity & Operations</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "productivity"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countProductivity}
          </span>
        </button>

        <button
          onClick={() => {
            setActivePillar("personal");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "personal"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Heart className="size-4 shrink-0" />
          <span>Personal, Knowledge & Home</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "personal"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countPersonal}
          </span>
        </button>

        <button
          onClick={() => {
            setActivePillar("people");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "people"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Users className="size-4 shrink-0" />
          <span>Family, Home & Community</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "people"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countPeople}
          </span>
        </button>
      </div>

      {/* Subcategory Pills & Search Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 mb-5 max-w-[1500px]">
        {/* Subcategory Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full md:w-auto">
          <button
            onClick={() => setActiveSubcategory("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeSubcategory === "all"
                ? "bg-foreground text-background font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua Workspace
          </button>
          {availableSubcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubcategory(sub)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeSubcategory === sub
                  ? "bg-foreground text-background font-semibold"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dari seluruh workspace & modul..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of 6 Master Workspaces */}
      {filteredApps.length === 0 ? (
        <div className="w-full py-16 text-center text-muted-foreground">
          <Package className="size-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-foreground">
            Tidak ada workspace yang cocok
          </p>
          <p className="text-xs mt-1">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1500px]">
          {filteredApps.map((app) => (
            <MasterWorkspaceFlipCard
              key={app.id}
              app={app}
              isFavorite={favorites.includes(app.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AppModuleSection;
