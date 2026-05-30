import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
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
    Inbox,
    Circle,
} from 'lucide-react';

const fmtDate  = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fmtTime  = (t) => t?.substring(0, 5) ?? '--:--';
const fmtClock = (iso) =>
    new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

const avatarColors = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100   text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100  text-amber-700',
    'bg-rose-100   text-rose-700',
];
const avatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild
                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60">
                            <Link href={route('admin.events.index')}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="h-3.5 w-px bg-border mx-1" />
                        <h2 className="font-semibold text-sm text-foreground truncate max-w-[220px] sm:max-w-[400px]">
                            {event.title}
                        </h2>
                    </div>
                    <Badge variant="secondary" className="h-6 text-[10px] font-semibold uppercase tracking-wider shrink-0">
                        {auth.user.role}
                    </Badge>
                </div>
            }
        >
            <Head title={`Rundown – ${event.title}`} />

            <div className="max-w-5xl mx-auto space-y-6">

                {/* ── Event Summary Card ─────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white border border-border rounded-2xl shadow-sm p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Detail Event</p>
                                <h3 className="text-lg font-black text-foreground leading-tight">{event.title}</h3>
                                {event.description && (
                                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{event.description}</p>
                                )}
                            </div>
                            <div className="shrink-0 flex flex-wrap sm:flex-col gap-2 text-xs text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                                    <span>{fmtDate(event.event_date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                                    <span className="font-mono">{fmtTime(event.start_time)} – {fmtTime(event.end_time)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stat row */}
                        <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-4 text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                                <ListTree className="h-3.5 w-3.5 text-muted-foreground/50" />
                                <span className="text-muted-foreground">{event.rundowns.length} sesi rundown</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-emerald-600 font-semibold">{attendanceCount} member hadir</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Tabs ───────────────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
                    <Tabs defaultValue="rundown" className="w-full space-y-5">
                        <div className="flex items-center justify-between gap-4">
                            <TabsList className="h-9 rounded-full bg-muted/60 border border-border p-1 inline-flex w-auto gap-1">
                                <TabsTrigger value="rundown"
                                    className="text-xs font-semibold flex items-center gap-1.5 px-4 rounded-full data-[state=active]:shadow-sm">
                                    <ListTree className="h-3.5 w-3.5" />
                                    Susunan Acara
                                    {event.rundowns.length > 0 && (
                                        <span className="bg-background text-foreground/70 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                                            {event.rundowns.length}
                                        </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="attendance"
                                    className="text-xs font-semibold flex items-center gap-1.5 px-4 rounded-full data-[state=active]:shadow-sm">
                                    <Users className="h-3.5 w-3.5" />
                                    Kehadiran
                                    {attendanceCount > 0 && (
                                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                                            {attendanceCount}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* ── Tab: Rundown (timeline) ───────────────────── */}
                        <TabsContent value="rundown" className="mt-0">
                            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                                {/* Header */}
                                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                    <p className="text-sm font-bold text-foreground">Susunan Acara</p>
                                    <Button onClick={() => setIsModalOpen(true)} size="sm"
                                        className="h-8 rounded-full text-xs font-bold gap-1.5 px-4">
                                        <Plus className="h-3.5 w-3.5" /> Tambah Sesi
                                    </Button>
                                </div>

                                {event.rundowns.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center">
                                        <div className="h-14 w-14 rounded-3xl border-2 border-dashed border-border flex items-center justify-center mb-4">
                                            <ListTree className="h-6 w-6 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">Belum ada sesi</p>
                                        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                                            Tambahkan sesi untuk menyusun rundown acara ini.
                                        </p>
                                        <Button onClick={() => setIsModalOpen(true)} variant="outline"
                                            className="mt-4 h-8 rounded-full text-xs font-semibold gap-1.5 px-4">
                                            <Plus className="h-3.5 w-3.5" /> Tambah Sesi Pertama
                                        </Button>
                                    </div>
                                ) : (
                                    /* ── Vertical Timeline ── */
                                    <div className="px-5 py-4">
                                        <div className="relative">
                                            {/* Vertical line */}
                                            <div className="absolute left-[52px] top-3 bottom-3 w-px bg-border/60" />

                                            <div className="space-y-1">
                                                {event.rundowns.map((item, idx) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="relative flex items-start gap-4 py-3 group"
                                                    >
                                                        {/* Time label */}
                                                        <div className="w-[44px] shrink-0 text-right">
                                                            <p className="text-[10px] font-mono font-bold text-muted-foreground leading-none">
                                                                {fmtTime(item.time_start)}
                                                            </p>
                                                            <p className="text-[9px] font-mono text-muted-foreground/50 mt-0.5 leading-none">
                                                                {fmtTime(item.time_end)}
                                                            </p>
                                                        </div>

                                                        {/* Dot */}
                                                        <div className="relative z-10 mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary/80 shadow-sm shrink-0 ring-2 ring-primary/10" />

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0 bg-muted/30 hover:bg-muted/50 rounded-xl px-4 py-3 transition-colors">
                                                            <p className="text-sm font-semibold text-foreground leading-snug">{item.activity}</p>
                                                            {item.pic && (
                                                                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                                                                    <User className="h-3 w-3" /> {item.pic}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Delete */}
                                                        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center mt-1">
                                                            <AnimatePresence mode="wait">
                                                                {deleteId === item.id ? (
                                                                    <motion.div key="c"
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        exit={{ opacity: 0 }}
                                                                        className="flex items-center gap-1.5">
                                                                        <Button size="sm" variant="outline"
                                                                            onClick={() => setDeleteId(null)}
                                                                            className="h-7 px-3 text-[10px] font-semibold rounded-full">
                                                                            Batal
                                                                        </Button>
                                                                        <Button size="sm"
                                                                            onClick={() => handleDelete(item.id)}
                                                                            className="h-7 px-3 text-[10px] font-bold rounded-full bg-rose-600 hover:bg-rose-700 text-white border-none">
                                                                            Hapus
                                                                        </Button>
                                                                    </motion.div>
                                                                ) : (
                                                                    <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                                        <Button variant="ghost" size="sm"
                                                                            onClick={() => setDeleteId(item.id)}
                                                                            className="h-7 w-7 p-0 rounded-full text-muted-foreground/40 hover:text-rose-600 hover:bg-rose-50">
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* ── Tab: Kehadiran ───────────────────────────────── */}
                        <TabsContent value="attendance" className="mt-0">
                            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                    <p className="text-sm font-bold text-foreground">Daftar Kehadiran</p>
                                    {attendanceCount > 0 && (
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] gap-1 rounded-full px-2.5">
                                            <CheckCircle2 className="h-3 w-3" /> {attendanceCount} Hadir
                                        </Badge>
                                    )}
                                </div>

                                {attendanceCount === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center">
                                        <div className="h-14 w-14 rounded-3xl border-2 border-dashed border-border flex items-center justify-center mb-4">
                                            <Users className="h-6 w-6 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">Belum ada presensi</p>
                                        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                                            Member yang presensi via token akan muncul di sini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/50">
                                        {event.attendances.map((att, idx) => (
                                            <motion.div
                                                key={att.id}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
                                            >
                                                {/* Rank */}
                                                <span className="text-[11px] font-bold text-muted-foreground/40 w-5 text-right shrink-0">
                                                    {idx + 1}
                                                </span>

                                                {/* Avatar */}
                                                <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-black ${avatarColor(att.user?.name)}`}>
                                                    {att.user?.name?.charAt(0).toUpperCase()}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">{att.user?.name}</p>
                                                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{att.user?.nrp}</p>
                                                </div>

                                                {/* Time & badge */}
                                                <div className="shrink-0 text-right space-y-1">
                                                    <p className="text-[11px] font-mono font-semibold text-muted-foreground">{fmtClock(att.attended_at)}</p>
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold rounded-full px-2 gap-1">
                                                        <CheckCircle2 className="h-2.5 w-2.5" /> HADIR
                                                    </Badge>
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

            {/* ══ Modal Tambah Sesi ════════════════════════════════════════════ */}
            <Dialog open={isModalOpen} onOpenChange={open => !open && closeModal()}>
                <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden border border-border rounded-2xl shadow-2xl bg-white">
                    <form onSubmit={submit}>
                        <DialogHeader className="px-6 pt-6 pb-5 border-b border-border">
                            <DialogTitle className="text-base font-black">Tambah Sesi Rundown</DialogTitle>
                            <p className="text-xs text-muted-foreground mt-1">Isi waktu dan nama aktivitas sesi ini.</p>
                        </DialogHeader>

                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="rd_start" className="text-xs font-semibold">
                                        Jam Mulai <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input id="rd_start" type="time" value={data.time_start}
                                        onChange={e => setData('time_start', e.target.value)}
                                        required className="h-9 text-sm font-mono rounded-lg" />
                                    <InputError message={errors.time_start} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="rd_end" className="text-xs font-semibold">
                                        Jam Selesai <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input id="rd_end" type="time" value={data.time_end}
                                        onChange={e => setData('time_end', e.target.value)}
                                        required className="h-9 text-sm font-mono rounded-lg" />
                                    <InputError message={errors.time_end} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="rd_act" className="text-xs font-semibold">
                                    Nama Aktivitas <span className="text-rose-500">*</span>
                                </Label>
                                <Input id="rd_act" placeholder="Contoh: Registrasi & Presensi"
                                    value={data.activity} onChange={e => setData('activity', e.target.value)}
                                    required className="h-9 text-sm rounded-lg" />
                                <InputError message={errors.activity} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="rd_pic" className="text-xs font-semibold flex gap-1.5">
                                    PIC <span className="text-muted-foreground font-normal">(opsional)</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Input id="rd_pic" placeholder="Contoh: Sie Acara"
                                        value={data.pic} onChange={e => setData('pic', e.target.value)}
                                        className="h-9 text-sm pl-10 rounded-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2.5">
                            <Button type="button" variant="ghost" size="sm" onClick={closeModal}
                                className="h-9 px-5 text-sm font-semibold rounded-full">
                                Batal
                            </Button>
                            <Button type="submit" size="sm" disabled={processing}
                                className="h-9 px-6 text-sm font-bold gap-2 rounded-full shadow-sm">
                                {processing
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                                    : <><Plus className="h-4 w-4" /> Simpan Sesi</>
                                }
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}