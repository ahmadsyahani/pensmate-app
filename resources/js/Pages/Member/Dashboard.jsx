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
    MapPin,
    Clock,
    CheckCircle2,
    CalendarCheck,
    ListTree,
    Inbox,
    QrCode,
    ChevronRight,
    Users,
    Sparkles,
    KeySquare,
    NotebookTabsIcon
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } }
};

function MemberStatCard({ icon: Icon, label, value, description, iconBg, textColor }) {
    return (
        <motion.div variants={fadeUp}>
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-border/80 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${textColor} shadow-sm`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
                        <p className="text-xl font-black text-foreground tracking-tight mt-1.5 leading-none">{value}</p>
                        <p className="text-[9px] text-muted-foreground mt-1 font-medium truncate">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function MemberDashboard({ auth, events, stats }) {
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        <h2 className="font-semibold text-sm text-foreground">Dashboard Member</h2>
                    </div>
                    <Badge variant="secondary" className="h-6 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-600 border-none">
                        Active Member
                    </Badge>
                </div>
            }
        >
            <Head title="Dashboard Member - PensMate" />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Glowing Member Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-2xl border border-border p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 shadow-lg text-white"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <Badge className="bg-indigo-500/20 text-indigo-200 border-none font-bold text-[9px] uppercase tracking-wider px-2 py-0.5">
                                PENS Students Hub
                            </Badge>
                            <h3 className="text-xl font-black tracking-tight md:text-2xl">
                                Halo, {auth.user.name.split(' ')[0]}! 👋
                            </h3>
                            <p className="text-xs text-indigo-100/70 max-w-xl font-medium leading-relaxed">
                                Selamat datang kembali di PensMate. Silakan pantau agenda terbaru kegiatan komunitas kita, cek susunan acara (rundown), dan lakukan presensi kehadiran secara mandiri.
                            </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <Button asChild variant="outline" className="border-indigo-500/30 text-xs bg-indigo-950/40 text-indigo-100 hover:bg-indigo-900/50 hover:text-white border font-bold">
                                <Link href={route('pensmates.index')} className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" /> Cari Mates
                                </Link>
                            </Button>
                            <Button asChild className="shadow-lg shadow-primary/20 text-xs font-semibold bg-white text-primary hover:bg-muted">
                                <Link href={route('kehadiran.index')} className="flex items-center gap-1.5 font-bold">
                                    <NotebookTabsIcon className="h-3.5 w-3.5 text-primary" /> Mulai Presensi
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* 3 Grid Member Stats Card */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    <MemberStatCard
                        icon={CalendarCheck}
                        label="Kehadiran Event"
                        value={`${stats.attendance_count} Kali`}
                        description="Jumlah event yang telah Anda ikuti"
                        iconBg="bg-blue-50"
                        textColor="text-blue-600"
                    />

                    <MemberStatCard
                        icon={CalendarDays}
                        label="Agenda Komunitas"
                        value={`${events.length} Event`}
                        description="Seluruh acara terdaftar di sistem"
                        iconBg="bg-amber-50"
                        textColor="text-amber-600"
                    />

                    <MemberStatCard
                        icon={CheckCircle2}
                        label="Status Autentikasi"
                        value="Terverifikasi"
                        description="NRP & KTM fisik disetujui admin"
                        iconBg="bg-emerald-50"
                        textColor="text-emerald-600"
                    />
                </motion.div>

                {/* Member Details Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Events & Rundown Timeline */}
                    <div className="lg:col-span-8 space-y-4">
                        {events.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-64"
                            >
                                <Card className="border border-dashed h-full flex flex-col items-center justify-center text-center p-6 bg-background/50">
                                    <Inbox className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                    <h4 className="font-semibold text-sm text-muted-foreground">Belum Ada Agenda Terbaru</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Cek kembali dalam beberapa hari ke depan untuk pembaruan kegiatan.</p>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: index * 0.05 }}
                                    >
                                        <Card className="shadow-sm border border-border bg-background hover:shadow-md transition-shadow">
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold uppercase tracking-wider">
                                                                Agenda Mendatang
                                                            </Badge>
                                                            <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                                                                <CalendarDays className="h-3.5 w-3.5" />
                                                                {new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-base font-extrabold text-foreground leading-tight tracking-tight mt-1">{event.title}</h4>
                                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator className="border-border/40" />

                                                {/* Rundown Timeline */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
                                                        <ListTree className="h-4 w-4" /> Susunan Acara / Rundown
                                                    </div>

                                                    {event.rundowns.length > 0 ? (
                                                        <div className="space-y-0 relative pl-2 pt-1">
                                                            {event.rundowns.map((rundown, rIdx) => (
                                                                <div key={rundown.id} className="flex gap-4 relative pb-4 last:pb-0">
                                                                    {/* Gradient timeline vertical line */}
                                                                    {rIdx !== event.rundowns.length - 1 && (
                                                                        <div className="absolute left-[3.5px] top-4 w-px h-[calc(100%-8px)] bg-border/60" />
                                                                    )}
                                                                    <div className="relative z-10 mt-1 flex justify-center shrink-0">
                                                                        <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                                                                    </div>

                                                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                                                        <div>
                                                                            <p className="text-xs font-semibold text-foreground/90">{rundown.activity}</p>
                                                                            {rundown.pic && <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">PIC: {rundown.pic}</p>}
                                                                        </div>
                                                                        <Badge variant="outline" className="font-mono text-[9px] border-border/80 text-muted-foreground bg-muted/20 w-fit shrink-0">
                                                                            {rundown.time_start.substring(0, 5)} - {rundown.time_end.substring(0, 5)}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-[11px] text-muted-foreground/60 italic pl-1 font-medium">Detail sesi acara belum dipublikasikan oleh panitia.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Presensi QR Access widget & Community Info */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* QR Quick Access Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.15 }}
                        >
                            <Card className="shadow-sm border border-border overflow-hidden bg-gradient-to-br from-background via-muted/10 to-background">
                                <CardHeader className="p-4 border-b border-border/50 bg-muted/5">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                                        <QrCode className="h-4 w-4 text-primary" /> Presensi QR & Token
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                                        Ingin melakukan verifikasi kehadiran di acara aktif saat ini? Gunakan panel Kehadiran untuk memindai kartu nama digital Anda atau memasukkan token presensi.
                                    </p>

                                    <div className="p-3 bg-muted/30 rounded-lg border border-border/40 text-xs font-medium space-y-1 text-muted-foreground/90">
                                        <div className="flex justify-between items-center text-foreground font-bold text-xs pb-1.5 border-b border-border/40 mb-1.5">
                                            <span>Informasi Presensi</span>
                                            <Badge className="bg-primary/10 text-primary border-none text-[8px] tracking-widest font-black uppercase">Active</Badge>
                                        </div>
                                        <p>1. Tunjukkan kartu QR di lokasi fisik.</p>
                                        <p>2. Dapatkan token dari panitia acara.</p>
                                        <p>3. Input token presensi mandiri.</p>
                                    </div>

                                    <Button asChild className="w-full h-8 text-[11px] font-bold shadow-sm">
                                        <Link href={route('kehadiran.index')} className="flex items-center justify-center gap-1">
                                            Buka Presensi <ChevronRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
