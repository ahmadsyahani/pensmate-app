import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { motion } from 'framer-motion';
import {
    CalendarDays,
    Users,
    UserCheck,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    ArrowUpRight,
    Inbox,
    Settings,
    Database,
    Server,
    AlertCircle,
    Activity
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

function StatCard({ icon: Icon, label, value, description, href, iconClass, gradientClass }) {
    return (
        <motion.div variants={fadeUp}>
            <Card className="relative overflow-hidden border border-border/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group bg-background/50 backdrop-blur-sm">
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 ${gradientClass}`} />
                
                <CardContent className="p-5 sm:p-6 relative z-10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                {label}
                            </p>
                            <p className="text-3xl sm:text-4xl font-black text-foreground leading-none tracking-tight">
                                {value}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium leading-snug">
                                {description}
                            </p>
                        </div>
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${iconClass}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>

                    {href && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                            <Link
                                href={href}
                                className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors w-max group-hover:translate-x-1 duration-300"
                            >
                                Kelola Sekarang <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function AdminDashboard({ auth, events, stats }) {
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const firstName = auth.user.name.split(' ')[0];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" /> Admin Command Center
                    </h2>
                    <span className="text-xs font-medium text-muted-foreground hidden sm:block bg-muted/50 px-3 py-1 rounded-full">{today}</span>
                </div>
            }
        >
            <Head title="Admin Dashboard — PensMate" />

            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

                {/* ── Greeting Banner ────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 shadow-lg shadow-primary/5"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                System Online
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                                Halo, {firstName}! <span className="inline-block origin-bottom-right hover:animate-pulse">👋</span>
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                                Pantau operasional komunitas, verifikasi pendaftar baru, dan kelola timeline kegiatan PensMate dari satu tempat.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Button asChild variant="outline" className="h-10 px-4 text-xs font-semibold relative bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                                <Link href={route('admin.approval')} className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4" /> Antrean Verifikasi
                                    {stats.pending_members > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                                            {stats.pending_members}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                            <Button asChild className="h-10 px-4 text-xs font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                <Link href={route('admin.events.index')} className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Event Baru
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* ── Stats Row ───────────────────────────────────────── */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                >
                    <StatCard
                        icon={Users}
                        label="Total Anggota"
                        value={stats.total_members}
                        description="Mahasiswa terverifikasi"
                        iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        gradientClass="bg-blue-500"
                    />
                    <StatCard
                        icon={UserCheck}
                        label="Antrean Approval"
                        value={stats.pending_members}
                        description="Menunggu peninjauan"
                        href={route('admin.approval')}
                        iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        gradientClass="bg-amber-500"
                    />
                    <StatCard
                        icon={CalendarDays}
                        label="Event Terdaftar"
                        value={events.length}
                        description="Agenda kegiatan aktif"
                        href={route('admin.events.index')}
                        iconClass="bg-primary/10 text-primary"
                        gradientClass="bg-primary"
                    />
                </motion.div>

                {/* ── Main Grid ───────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left: Events List */}
                    <motion.div
                        className="lg:col-span-8"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                    >
                        <Card className="border border-border/60 shadow-sm bg-background/50 backdrop-blur-sm h-full flex flex-col">
                            <CardHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border/50 flex flex-row items-center justify-between gap-2">
                                <div>
                                    <CardTitle className="text-base font-black text-foreground flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5 text-primary" /> Agenda Mendatang
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">Daftar event & kontrol rundown acara</CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs text-primary font-medium hover:bg-primary/10 transition-colors">
                                    <Link href={route('admin.events.index')} className="flex items-center gap-1.5">
                                        <span className="hidden sm:inline">Lihat Semua</span>
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>

                            <CardContent className="p-0 flex-1">
                                {events.length === 0 ? (
                                    <div className="py-20 text-center flex flex-col items-center justify-center h-full">
                                        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4 border border-border shadow-inner">
                                            <Inbox className="h-6 w-6 text-muted-foreground/50" />
                                        </div>
                                        <p className="font-bold text-base text-foreground">Belum Ada Agenda</p>
                                        <p className="text-sm text-muted-foreground mt-1 mb-5 max-w-xs">Mulai rencanakan dan buat agenda pertama untuk komunitas.</p>
                                        <Button asChild className="h-9 text-xs font-semibold shadow-sm">
                                            <Link href={route('admin.events.index')}>
                                                <Plus className="h-4 w-4 mr-1.5" /> Buat Event Sekarang
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/50">
                                        {events.slice(0, 5).map((event, idx) => (
                                            <div
                                                key={event.id}
                                                className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors group"
                                            >
                                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black text-sm group-hover:scale-110 transition-transform duration-300">
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </div>
                                                    <div className="space-y-1.5 min-w-0">
                                                        <p className="font-bold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                                                            {event.title}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                                                                <CalendarDays className="h-3.5 w-3.5" />
                                                                {new Date(event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {event.start_time.substring(0, 5)} – {event.end_time.substring(0, 5)}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 truncate max-w-[150px] sm:max-w-[200px]">
                                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                                <span className="truncate">{event.location}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold shrink-0 self-start sm:self-auto hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm">
                                                    <Link href={route('admin.events.show', event.id)} className="flex items-center gap-1.5">
                                                        Kelola <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right: Quick Actions + System */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <Card className="border border-border/60 shadow-sm bg-background/50 backdrop-blur-sm">
                                <CardHeader className="px-5 py-4 border-b border-border/50">
                                    <CardTitle className="text-sm font-black text-foreground">Aksi Cepat</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    {[
                                        { href: route('admin.approval'), icon: UserCheck, title: 'Approval Member', sub: 'Tinjau pendaftaran baru', iconClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
                                        { href: route('admin.events.index'), icon: CalendarDays, title: 'Kelola Event', sub: 'Buat & atur agenda', iconClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
                                        { href: route('admin.session.index'), icon: Settings, title: 'Sesi Absensi', sub: 'Buka & kelola token', iconClass: 'bg-primary/10 text-primary' },
                                    ].map(({ href, icon: Icon, title, sub, iconClass }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconClass}`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{title}</p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* System Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                        >
                            <Card className="border border-border/60 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="px-5 py-4 border-b border-border/50 bg-muted/20">
                                    <CardTitle className="text-sm font-black text-foreground">Status Sistem</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {[
                                        { icon: Database, label: 'Database Engine' },
                                        { icon: Server, label: 'Inertia.js SSR' },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="flex items-center gap-2.5">
                                                <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Online</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex items-start gap-2.5 p-3 mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                                            Selalu tinjau berkas KTM fisik dengan seksama sebelum melakukan approval anggota baru.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
