import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import InputError from '@/Components/InputError';
import {
    ChevronLeft,
    Plus,
    Calendar,
    MapPin,
    Clock,
    User,
    Trash2,
    ListTree,
    Users,
    CheckCircle2,
    Loader2,
    Lock,
    Radio,
    Timer,
    CheckCheck,
} from 'lucide-react';

const fmtDate  = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fmtTime  = (t) => t?.substring(0, 5) ?? '--:--';
const fmtClock = (iso) =>
    new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

/* ─── Status badge config ─────────────────────────── */
const STATUS_CONFIG = {
    upcoming: {
        label: 'Akan Berlangsung',
        icon: Timer,
        className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
        dotClass: 'bg-amber-400',
        description: 'Rundown masih bisa diedit sebelum event dimulai.',
    },
    ongoing: {
        label: 'Sedang Berlangsung',
        icon: Radio,
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
        dotClass: 'bg-emerald-500 animate-pulse',
        description: 'Event sedang berjalan. Rundown tidak dapat diubah.',
    },
    ended: {
        label: 'Sudah Selesai',
        icon: CheckCheck,
        className: 'bg-muted text-muted-foreground border-border',
        dotClass: 'bg-muted-foreground',
        description: 'Event telah berakhir. Rundown terkunci.',
    },
};

export default function Show({ auth, event }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId,    setDeleteId]    = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        time_start: '', time_end: '', activity: '', pic: '',
    });

    const closeModal = () => { setIsModalOpen(false); reset(); clearErrors(); };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.rundowns.store', event.id), { onSuccess: () => closeModal() });
    };

    const handleDelete = (id) => {
        router.delete(route('admin.rundowns.destroy', id));
        setDeleteId(null);
    };

    const attendanceCount = event.attendances?.length ?? 0;
    const status          = event.status;          // 'upcoming' | 'ongoing' | 'ended'
    const canEdit         = event.can_edit;         // true only when upcoming
    const statusCfg       = STATUS_CONFIG[status] ?? STATUS_CONFIG.ended;
    const StatusIcon      = statusCfg.icon;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full min-w-0 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Button variant="ghost" size="icon" asChild
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0">
                            <Link href={route('admin.events.index')}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="h-4 w-px bg-border mx-0.5 shrink-0" />
                        <h2 className="font-bold text-sm text-foreground truncate max-w-[140px] sm:max-w-[400px]">
                            {event.title}
                        </h2>
                    </div>

                    {/* Status badge di header */}
                    <span className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusCfg.className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dotClass}`} />
                        {statusCfg.label}
                    </span>
                </div>
            }
        >
            <Head title={`Rundown – ${event.title}`} />

            <div className="max-w-5xl mx-auto space-y-5">

                {/* ── Lock banner (ongoing / ended) ─────────────────────── */}
                <AnimatePresence>
                    {!canEdit && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm ${statusCfg.className}`}
                        >
                            <Lock className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold leading-snug">{statusCfg.label}</p>
                                <p className="text-[11px] opacity-80 mt-0.5 font-medium">{statusCfg.description}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Event Summary Card ────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-background border border-border rounded-2xl overflow-hidden">
                        {/* Top accent bar — warna sesuai status */}
                        <div className={`h-1 w-full ${
                            status === 'upcoming' ? 'bg-gradient-to-r from-amber-400 via-primary to-accent'
                          : status === 'ongoing'  ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-primary'
                          :                        'bg-gradient-to-r from-muted-foreground/30 to-border'
                        }`} />

                        <div className="p-5 sm:p-6">
                            {/* Title + meta row */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                                {/* Left: title & desc */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                            Detail Event
                                        </p>
                                        {/* Status inline badge */}
                                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.className}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dotClass}`} />
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-foreground leading-tight">
                                        {event.title}
                                    </h3>
                                    {event.description && (
                                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                                            {event.description}
                                        </p>
                                    )}
                                </div>

                                {/* Right: meta pills */}
                                <div className="shrink-0 flex flex-col gap-2">
                                    <div className="flex items-center gap-2.5 bg-muted/60 rounded-lg px-3.5 py-2 text-xs text-foreground">
                                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span className="font-medium">{fmtDate(event.event_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-muted/60 rounded-lg px-3.5 py-2 text-xs text-foreground">
                                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span className="font-mono font-semibold">
                                            {fmtTime(event.start_time)}
                                            <span className="mx-1 text-muted-foreground">–</span>
                                            {fmtTime(event.end_time)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-muted/60 rounded-lg px-3.5 py-2 text-xs text-foreground">
                                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span className="font-medium">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stat row */}
                            <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-0.5 bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
                                    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wide">Sesi Rundown</p>
                                    <p className="text-2xl font-black text-primary leading-none mt-0.5">{event.rundowns.length}</p>
                                </div>
                                <div className="flex flex-col gap-0.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wide">Member Hadir</p>
                                    <p className="text-2xl font-black text-emerald-600 leading-none mt-0.5">{attendanceCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Tabs ─────────────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
                    <Tabs defaultValue="rundown" className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <TabsList className="h-10 bg-muted/60 border border-border p-1 inline-flex w-auto gap-1 rounded-xl">
                                <TabsTrigger value="rundown"
                                    className="text-xs font-semibold flex items-center gap-1.5 px-4 rounded-lg data-[state=active]:shadow-sm">
                                    <ListTree className="h-3.5 w-3.5" />
                                    Susunan Acara
                                    {event.rundowns.length > 0 && (
                                        <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                                            {event.rundowns.length}
                                        </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="attendance"
                                    className="text-xs font-semibold flex items-center gap-1.5 px-4 rounded-lg data-[state=active]:shadow-sm">
                                    <Users className="h-3.5 w-3.5" />
                                    Kehadiran
                                    {attendanceCount > 0 && (
                                        <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                                            {attendanceCount}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* ── Tab: Rundown (timeline) ───────────────────── */}
                        <TabsContent value="rundown" className="mt-0">
                            <div className="bg-background border border-border rounded-2xl overflow-hidden">
                                {/* Header */}
                                <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Susunan Acara</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {event.rundowns.length} sesi terjadwal
                                        </p>
                                    </div>

                                    {canEdit ? (
                                        <Button onClick={() => setIsModalOpen(true)} size="sm"
                                            className="h-8 text-xs font-semibold gap-1.5 px-4 rounded-lg">
                                            <Plus className="h-3.5 w-3.5" /> Tambah Sesi
                                        </Button>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted border border-border rounded-lg px-3 py-2">
                                            <Lock className="h-3 w-3" />
                                            {status === 'ongoing' ? 'Event berlangsung' : 'Event selesai'}
                                        </span>
                                    )}
                                </div>

                                {event.rundowns.length === 0 ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                                        <div className="h-16 w-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-4">
                                            <ListTree className="h-7 w-7 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">Belum ada sesi</p>
                                        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                                            {canEdit
                                                ? 'Tambahkan sesi untuk menyusun rundown acara ini.'
                                                : 'Tidak ada sesi yang ditambahkan sebelum event ini.'}
                                        </p>
                                        {canEdit && (
                                            <Button onClick={() => setIsModalOpen(true)} variant="outline"
                                                className="mt-5 h-8 text-xs font-semibold gap-1.5 px-5 rounded-lg">
                                                <Plus className="h-3.5 w-3.5" /> Tambah Sesi Pertama
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    /* ── Vertical Timeline ── */
                                    <div className="px-5 sm:px-8 py-6">
                                        <div className="relative">
                                            {/* Vertical connector line */}
                                            <div className="absolute left-[72px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/40 via-border to-border/30 rounded-full" />

                                            <div className="space-y-3">
                                                {event.rundowns.map((item, idx) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: -12 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.06 }}
                                                        className="relative flex items-stretch gap-0 group"
                                                    >
                                                        {/* Time column */}
                                                        <div className="w-[68px] shrink-0 flex flex-col items-end justify-center pr-4 py-4">
                                                            <p className="text-[11px] font-mono font-bold text-foreground leading-none">
                                                                {fmtTime(item.time_start)}
                                                            </p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <div className="w-2 h-px bg-muted-foreground/30" />
                                                                <p className="text-[10px] font-mono text-muted-foreground/60 leading-none">
                                                                    {fmtTime(item.time_end)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Dot on the line */}
                                                        <div className="relative z-10 flex items-center justify-center shrink-0 w-5">
                                                            <div className={`h-4 w-4 rounded-full border-2 border-background shrink-0 ring-2 transition-all duration-200
                                                                ${idx === 0
                                                                    ? 'bg-primary ring-primary/30 scale-110'
                                                                    : 'bg-primary/70 ring-primary/15 group-hover:bg-primary group-hover:ring-primary/30'
                                                                }`}
                                                            />
                                                        </div>

                                                        {/* Content card */}
                                                        <div className="flex-1 min-w-0 ml-4">
                                                            <div className="bg-muted/30 hover:bg-muted/60 border border-border/60 hover:border-border rounded-xl px-5 py-4 transition-all duration-200 cursor-default">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-bold text-foreground leading-snug">
                                                                            {item.activity}
                                                                        </p>
                                                                        {item.pic && (
                                                                            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
                                                                                <User className="h-3 w-3 shrink-0" />
                                                                                <span>{item.pic}</span>
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Duration badge */}
                                                                    <span className="shrink-0 text-[10px] font-semibold text-primary/70 bg-primary/8 border border-primary/15 rounded-md px-2 py-1 font-mono mt-0.5">
                                                                        {fmtTime(item.time_start)}
                                                                        <span className="mx-0.5 text-muted-foreground">–</span>
                                                                        {fmtTime(item.time_end)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Delete button — hanya tampil jika canEdit */}
                                                        {canEdit && (
                                                            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-2">
                                                                <AnimatePresence mode="wait">
                                                                    {deleteId === item.id ? (
                                                                        <motion.div key="c"
                                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            exit={{ opacity: 0 }}
                                                                            className="flex items-center gap-1.5">
                                                                            <Button size="sm" variant="outline"
                                                                                onClick={() => setDeleteId(null)}
                                                                                className="h-7 px-2.5 text-[10px] font-semibold rounded-lg">
                                                                                Batal
                                                                            </Button>
                                                                            <Button size="sm"
                                                                                onClick={() => handleDelete(item.id)}
                                                                                className="h-7 px-2.5 text-[10px] font-bold rounded-lg">
                                                                                Hapus
                                                                            </Button>
                                                                        </motion.div>
                                                                    ) : (
                                                                        <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                                            <Button variant="ghost" size="sm"
                                                                                onClick={() => setDeleteId(item.id)}
                                                                                className="h-8 w-8 p-0 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg">
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* ── Tab: Kehadiran ────────────────────────────── */}
                        <TabsContent value="attendance" className="mt-0">
                            <div className="bg-background border border-border rounded-2xl overflow-hidden">
                                <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Daftar Kehadiran</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {attendanceCount} member telah hadir
                                        </p>
                                    </div>
                                    {attendanceCount > 0 && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                                            {attendanceCount} Hadir
                                        </span>
                                    )}
                                </div>

                                {attendanceCount === 0 ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                                        <div className="h-16 w-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-4">
                                            <Users className="h-7 w-7 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">Belum ada presensi</p>
                                        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                                            Member yang presensi via token akan muncul di sini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/60">
                                        {event.attendances.map((att, idx) => (
                                            <motion.div
                                                key={att.id}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-muted/20 transition-colors"
                                            >
                                                <span className="text-[11px] font-bold text-muted-foreground/40 w-6 text-right shrink-0 font-mono">
                                                    {idx + 1}
                                                </span>
                                                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-sm font-black text-primary">
                                                    {att.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">{att.user?.name}</p>
                                                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{att.user?.nrp}</p>
                                                </div>
                                                <div className="shrink-0 text-right space-y-1.5">
                                                    <p className="text-[11px] font-mono text-muted-foreground">{fmtClock(att.attended_at)}</p>
                                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5 inline-flex items-center gap-1">
                                                        <CheckCircle2 className="h-2.5 w-2.5" /> HADIR
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* ── Modal Tambah Sesi — hanya bisa dibuka jika canEdit ─── */}
            {canEdit && (
                <Dialog open={isModalOpen} onOpenChange={open => !open && closeModal()}>
                    <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden border border-border rounded-2xl bg-background">
                        <form onSubmit={submit}>
                            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
                                <DialogTitle className="text-sm font-bold">Tambah Sesi Rundown</DialogTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">Isi waktu dan nama aktivitas sesi ini.</p>
                            </DialogHeader>

                            <div className="px-6 py-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rd_start" className="text-xs font-semibold">
                                            Jam Mulai <span className="text-destructive">*</span>
                                        </Label>
                                        <Input id="rd_start" type="time" value={data.time_start}
                                            onChange={e => setData('time_start', e.target.value)}
                                            required className="h-9 text-sm font-mono" />
                                        <InputError message={errors.time_start} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rd_end" className="text-xs font-semibold">
                                            Jam Selesai <span className="text-destructive">*</span>
                                        </Label>
                                        <Input id="rd_end" type="time" value={data.time_end}
                                            onChange={e => setData('time_end', e.target.value)}
                                            required className="h-9 text-sm font-mono" />
                                        <InputError message={errors.time_end} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="rd_act" className="text-xs font-semibold">
                                        Nama Aktivitas <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="rd_act" placeholder="Contoh: Registrasi &amp; Presensi"
                                        value={data.activity} onChange={e => setData('activity', e.target.value)}
                                        required className="h-9 text-sm" />
                                    <InputError message={errors.activity} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="rd_pic" className="text-xs font-semibold flex gap-1.5">
                                        PIC <span className="text-muted-foreground font-normal">(opsional)</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                        <Input id="rd_pic" placeholder="Contoh: Sie Acara"
                                            value={data.pic} onChange={e => setData('pic', e.target.value)}
                                            className="h-9 text-sm pl-9" />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 bg-muted/10">
                                <Button type="button" variant="ghost" size="sm" onClick={closeModal}
                                    className="h-8 px-4 text-xs font-medium rounded-lg">
                                    Batal
                                </Button>
                                <Button type="submit" size="sm" disabled={processing}
                                    className="h-8 px-5 text-xs font-semibold gap-1.5 rounded-lg">
                                    {processing
                                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>
                                        : <><Plus className="h-3.5 w-3.5" /> Simpan Sesi</>
                                    }
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AuthenticatedLayout>
    );
}