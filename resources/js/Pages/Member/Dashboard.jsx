import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { motion } from 'framer-motion';
import {
    CalendarDays,
    MapPin,
    CheckCircle2,
    Inbox,
    QrCode,
    ChevronRight,
    Users,
    NotebookTabsIcon,
    TrendingUp,
    Sparkles,
    ArrowUpRight
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

function StatCard({ icon: Icon, label, value, description, iconClass, gradientClass }) {
    return (
        <motion.div variants={fadeUp} className="h-full">
            <Card className="h-full relative overflow-hidden border border-border/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group bg-background/50 backdrop-blur-sm">
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 ${gradientClass}`} />
                
                <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col h-full justify-center">
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
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${iconClass}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function EventCard({ event, isPast = false, delay = 0, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay }}
            className={`h-full ${className}`}
        >
            <Card className={`h-full flex flex-col border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-background/50 backdrop-blur-sm group ${isPast ? 'opacity-80 hover:opacity-100 grayscale hover:grayscale-0' : ''}`}>
                {/* Top gradient bar */}
                <div className={`h-1 w-full shrink-0 ${isPast ? 'bg-muted-foreground/50' : 'bg-gradient-to-r from-primary via-indigo-500 to-purple-500'}`} />
                
                <div className={`px-5 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1 ${isPast ? 'flex-col items-start justify-start' : ''}`}>
                    <div className="space-y-2 flex-1 w-full">
                        <div className={`flex items-center gap-2 text-xs font-bold w-max px-2.5 py-1 rounded-md ${isPast ? 'bg-muted text-muted-foreground' : 'bg-primary/5 text-primary'}`}>
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            {new Date(event.event_date).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <MapPin className="h-4 w-4 shrink-0 text-rose-500/70" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>

                    <div className={`shrink-0 ${isPast ? 'w-full mt-auto pt-2' : 'sm:self-end'}`}>
                        <Button asChild variant={isPast ? "outline" : "default"} className={`h-9 px-4 text-xs font-semibold shadow-sm w-full sm:w-auto ${!isPast && 'hover:shadow-md hover:shadow-primary/20 transition-all'}`}>
                            <Link href={route('member.events.show', event.id)} className="flex items-center justify-center gap-1.5">
                                Lihat Detail <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

export default function MemberDashboard({ auth, upcoming_events, past_events, stats }) {
    const firstName = auth.user.name.split(' ')[0];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full min-w-0 gap-2">
                    <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" /> Dashboard
                    </h2>
                    <span className="text-xs font-medium text-muted-foreground hidden sm:block bg-muted/50 px-3 py-1 rounded-full">
                        Halo, {firstName} 👋
                    </span>
                </div>
            }
        >
            <Head title="Dashboard — PensMate" />

            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

                {/* ── Greeting Banner ────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-indigo-500/10 via-primary/5 to-background p-6 sm:p-8 shadow-lg shadow-indigo-500/5"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl translate-y-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                PENS Students Hub
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                                Selamat datang, {firstName}!
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                                Pantau agenda komunitas terbaru, cek susunan acara secara mendetail, dan lakukan presensi kehadiran Anda secara mandiri di sini.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Stats & Actions Row ───────────────────────────────────────── */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                    <StatCard
                        icon={TrendingUp}
                        label="Kehadiran Event"
                        value={`${stats.attendance_count}x`}
                        description="Event yang telah diikuti"
                        iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        gradientClass="bg-emerald-500"
                    />
                    <StatCard
                        icon={CalendarDays}
                        label="Agenda Komunitas"
                        value={`${upcoming_events.length}`}
                        description="Total acara mendatang"
                        iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        gradientClass="bg-blue-500"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Status Akun"
                        value="Aktif"
                        description="KTM terverifikasi"
                        iconClass="bg-primary/10 text-primary"
                        gradientClass="bg-primary"
                    />

                    {/* Eksplorasi Actions as 4th card */}
                    <motion.div variants={fadeUp} className="h-full">
                        <Card className="h-full relative overflow-hidden border border-border/60 shadow-sm bg-background/50 backdrop-blur-sm flex flex-col hover:border-indigo-500/30 transition-all duration-300">
                            <CardHeader className="px-5 pt-5 pb-3">
                                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Eksplorasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5 pt-0 flex-1 flex flex-col justify-center gap-2">
                                <Link
                                    href={route('pensmates.index')}
                                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:shadow-sm transition-all group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-md bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Users className="h-3.5 w-3.5 text-indigo-600" />
                                        </div>
                                        <p className="text-xs font-bold text-foreground group-hover:text-indigo-600 transition-colors">Cari PensMates</p>
                                    </div>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                <Link
                                    href={route('kehadiran.index')}
                                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <QrCode className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Presensi Mandiri</p>
                                    </div>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* ── Main Content ─────────────────────────────────────── */}
                <div className="space-y-8">
                    
                    {/* Upcoming Events Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1.5 rounded-full bg-primary" />
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
                                Agenda Mendatang
                            </h3>
                        </div>

                        {upcoming_events.length === 0 ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="border border-dashed border-border bg-background/30 backdrop-blur-sm">
                                    <CardContent className="py-16 text-center">
                                        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 border border-border shadow-inner">
                                            <Inbox className="h-8 w-8 text-muted-foreground/40" />
                                        </div>
                                        <p className="font-bold text-base text-foreground">Belum Ada Agenda Terjadwal</p>
                                        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                                            Saat ini belum ada event baru. Cek kembali secara berkala untuk mendapatkan pembaruan kegiatan dari komunitas.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {upcoming_events.map((event, index) => (
                                    <EventCard key={event.id} event={event} delay={index * 0.1} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Past Events Section (Horizontal Scroll) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1.5 rounded-full bg-muted-foreground" />
                            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                                Agenda Yang Sudah Dilaksanakan
                            </h3>
                        </div>

                        {past_events.length === 0 ? (
                            <div className="py-4 text-center">
                                <p className="text-sm text-muted-foreground italic">Belum ada riwayat event.</p>
                            </div>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {past_events.map((event, index) => (
                                    <div key={event.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                                        <EventCard event={event} isPast={true} delay={index * 0.1} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
