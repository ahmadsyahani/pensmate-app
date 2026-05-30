import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
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
    TrendingUp,
    Inbox,
    Settings
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

function StatCard({ icon: Icon, label, value, description, href, gradient }) {
    return (
        <motion.div variants={fadeUp}>
            <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/80 group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500`} />

                <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">
                            {label}
                        </span>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-tr ${gradient} text-white shadow-sm`}>
                            <Icon className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-2xl font-black text-foreground leading-none tracking-tight">
                            {value}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            {description}
                        </p>
                    </div>

                    {href && (
                        <div className="pt-1 border-t border-border/30">
                            <Link href={href} className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:gap-1.5 transition-all">
                                Kelola Detail <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function AdminDashboard({ auth, events, stats }) {
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <h2 className="font-semibold text-sm text-foreground">Admin Console Dashboard</h2>
                    </div>
                    <Badge variant="secondary" className="h-6 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border-none">
                        SUPER ADMIN
                    </Badge>
                </div>
            }
        >
            <Head title="Admin Dashboard - PensMate" />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Sleek Gradient Welcome Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-2xl border border-border/40 p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-xl group text-white"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <Badge className="bg-primary/20 text-indigo-200 border-none font-bold text-[9px] uppercase tracking-wider px-2 py-0.5">
                                {today}
                            </Badge>
                            <h3 className="text-xl font-black tracking-tight md:text-2xl">
                                Halo, Administrator {auth.user.name.split(' ')[0]}! 👑
                            </h3>
                            <p className="text-xs text-indigo-100/70 max-w-xl font-medium">
                                Selamat datang di Pusat Kendali PensMate. Pantau operasional, verifikasi mahasiswa pendaftar baru, dan kelola timeline kegiatan komunitas Anda.
                            </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <Button asChild variant="outline" className="border-indigo-500/30 text-xs bg-indigo-950/40 text-indigo-100 hover:bg-indigo-900/50 hover:text-white border">
                                <Link href={route('admin.approval')} className="flex items-center gap-1">
                                    <UserCheck className="h-3.5 w-3.5" /> Antrean
                                </Link>
                            </Button>
                            <Button asChild className="shadow-lg shadow-primary/20 text-xs font-semibold">
                                <Link href={route('admin.events.index')} className="flex items-center gap-1">
                                    <Plus className="h-3.5 w-3.5" /> Event Baru
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    <StatCard
                        icon={Users}
                        label="Total Anggota Komunitas"
                        value={stats.total_members}
                        description="Mahasiswa PENS terverifikasi aktif"
                        gradient="from-blue-500 to-indigo-600"
                    />

                    <StatCard
                        icon={UserCheck}
                        label="Antrean Approval Member"
                        value={stats.pending_members}
                        description="Memerlukan tindakan peninjauan"
                        href={route('admin.approval')}
                        gradient={stats.pending_members > 0 ? "from-rose-500 to-pink-600" : "from-amber-400 to-orange-500"}
                    />

                    <StatCard
                        icon={CalendarDays}
                        label="Jumlah Event Aktif"
                        value={events.length}
                        description="Agenda kegiatan yang direncanakan"
                        href={route('admin.events.index')}
                        gradient="from-emerald-500 to-teal-600"
                    />
                </motion.div>

                {/* Dashboard Grid Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left side: Upcoming events details list */}
                    <div className="lg:col-span-8 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.15 }}
                        >
                            <Card className="shadow-sm border border-border">
                                <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-border bg-muted/5">
                                    <div>
                                        <CardTitle className="text-sm font-bold text-foreground">Agenda & Kegiatan Mendatang</CardTitle>
                                        <CardDescription className="text-[11px] mt-0.5">Daftar event terdaftar serta kontrol rundown.</CardDescription>
                                    </div>
                                    <Button asChild variant="ghost" size="sm" className="h-8 text-[11px] text-primary font-bold px-2">
                                        <Link href={route('admin.events.index')}>Kelola Semua Event &rarr;</Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {events.length === 0 ? (
                                        <div className="py-16 text-center">
                                            <Inbox className="h-9 w-9 text-muted-foreground/30 mx-auto mb-3" />
                                            <h4 className="font-semibold text-sm text-muted-foreground">Belum Ada Agenda Terdaftar</h4>
                                            <p className="text-xs text-muted-foreground mt-1">Gunakan tombol 'Event Baru' untuk menambahkan agenda perdana.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/60">
                                            {events.slice(0, 4).map((event) => (
                                                <div key={event.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-muted/30 transition-colors group">
                                                    <div className="space-y-1.5 min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Badge variant="outline" className="font-mono text-[9px] border-primary/20 text-primary bg-primary/5 uppercase font-bold py-0.5">
                                                                EVENT-{event.id}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                                                                <CalendarDays className="h-3 w-3" />
                                                                {event.event_date}
                                                            </span>
                                                        </div>
                                                        <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                                            {event.title}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                                                {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                                                            </span>
                                                            <span className="flex items-center gap-1 truncate">
                                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                                {event.location}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Button asChild variant="outline" size="sm" className="h-8 text-xs font-bold shrink-0 shadow-sm border-border hover:bg-muted">
                                                        <Link href={route('admin.events.show', event.id)} className="flex items-center gap-0.5">
                                                            Detail Rundown <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right side: Quick Info / Platform Status Panel */}
                    <div className="lg:col-span-4 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.2 }}
                        >
                            <Card className="shadow-sm border border-border bg-background">
                                <CardHeader className="p-4 border-b border-border bg-muted/5 flex flex-row items-center gap-2">
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-sm font-bold text-foreground">Sistem & Kebijakan</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2 text-xs leading-relaxed text-muted-foreground font-medium">
                                        <p>
                                            Untuk kenyamanan penggunaan bersama, pastikan untuk meninjau berkas pendaftaran calon anggota secara valid dengan mencocokkan KTM fisik mereka.
                                        </p>
                                        <p>
                                            Token presensi acara dibagikan kepada member saat sesi presensi dibuka guna menjaga kevalidan rekaman data kehadiran.
                                        </p>
                                    </div>
                                    <Separator className="border-border/60" />

                                    <div className="space-y-3 pt-1">
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Pusat Bantuan & Konfigurasi</p>
                                        <div className="space-y-2">
                                            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs flex justify-between items-center">
                                                <div className="font-semibold text-foreground">Database Engine</div>
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px]">ONLINE</Badge>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs flex justify-between items-center">
                                                <div className="font-semibold text-foreground">Inertia.js SSR</div>
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px]">ONLINE</Badge>
                                            </div>
                                        </div>
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
