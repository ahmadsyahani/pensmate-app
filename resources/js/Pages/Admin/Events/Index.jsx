import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import InputError from '@/Components/InputError';
import {
    Plus,
    Search,
    CalendarDays,
    Trash2,
    Inbox,
    ListTree,
    MapPin,
    Clock,
    Loader2,
    X,
    ArrowUpRight,
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};
const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.06 } },
};

export default function Index({ auth, events }) {
    const [isModalOpen,     setIsModalOpen]     = useState(false);
    const [searchQuery,     setSearchQuery]     = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '', description: '', event_date: '',
        start_time: '', end_time: '', location: '',
    });

    const closeModal = () => { setIsModalOpen(false); reset(); clearErrors(); };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.events.store'), { onSuccess: () => closeModal() });
    };

    const handleDelete = (id) => {
        router.delete(route('admin.events.destroy', id));
        setDeleteConfirmId(null);
    };

    const filtered = events.filter(ev =>
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const upcomingCount = events.filter(e => new Date(e.event_date) >= new Date()).length;

    const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="font-semibold text-sm text-foreground">Kelola Event</h2>
                    <span className="text-[10px] font-medium text-muted-foreground hidden sm:block">
                        {events.length} event · {upcomingCount} akan datang
                    </span>
                </div>
            }
        >
            <Head title="Kelola Event" />

            <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">

                {/* ── Page Header ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
                >
                    <div>
                        <h3 className="text-base font-bold text-foreground tracking-tight">Daftar Event</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {events.length === 0
                                ? 'Belum ada event yang dibuat.'
                                : `${events.length} event terdaftar, ${upcomingCount} akan datang.`}
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        size="sm"
                        className="h-8 text-xs font-medium gap-1.5 self-start sm:self-auto"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Buat Event
                    </Button>
                </motion.div>

                {/* ── Search ───────────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}>
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari event atau lokasi..."
                            className="w-full h-9 pl-9 pr-8 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all placeholder:text-muted-foreground/50"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* ── Card Grid ────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-4">
                                <Inbox className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada event'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                                {searchQuery
                                    ? 'Coba kata kunci lain atau hapus filter.'
                                    : 'Mulai buat event pertama untuk komunitas.'}
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => setIsModalOpen(true)} variant="outline" size="sm"
                                    className="mt-4 h-8 text-xs font-medium gap-1.5">
                                    <Plus className="h-3.5 w-3.5" /> Buat Event Sekarang
                                </Button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                        >
                            {filtered.map((event) => {
                                const isUpcoming   = new Date(event.event_date) >= new Date();
                                const isDelConfirm = deleteConfirmId === event.id;
                                return (
                                    <motion.div key={event.id} variants={fadeUp} layout>
                                        <div className="group relative bg-background border border-border rounded-xl hover:shadow-sm transition-all duration-200 overflow-hidden flex flex-col h-full">

                                            {/* Status stripe */}
                                            <div className={`h-0.5 w-full ${isUpcoming ? 'bg-primary' : 'bg-border'}`} />

                                            <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1">
                                                {/* Title + Badge */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm font-bold text-foreground leading-snug">{event.title}</h4>
                                                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                                            {event.description || <span className="italic">Tidak ada deskripsi.</span>}
                                                        </p>
                                                    </div>
                                                    {isUpcoming ? (
                                                        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
                                                            Upcoming
                                                        </span>
                                                    ) : (
                                                        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-border text-muted-foreground/60">
                                                            Selesai
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Meta */}
                                                <div className="space-y-1.5 text-[11px] text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                                        <span>{fmtDate(event.event_date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="font-mono">{event.start_time.substring(0,5)} – {event.end_time.substring(0,5)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-auto pt-3 border-t border-border">
                                                    <AnimatePresence mode="wait">
                                                        {isDelConfirm ? (
                                                            <motion.div
                                                                key="confirm"
                                                                initial={{ opacity: 0, y: 4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <p className="text-[11px] text-muted-foreground flex-1">Hapus event ini?</p>
                                                                <Button size="sm" variant="outline"
                                                                    onClick={() => setDeleteConfirmId(null)}
                                                                    className="h-7 px-3 text-[11px]">
                                                                    Batal
                                                                </Button>
                                                                <Button size="sm"
                                                                    onClick={() => handleDelete(event.id)}
                                                                    className="h-7 px-3 text-[11px]">
                                                                    Hapus
                                                                </Button>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="normal"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Button variant="outline" size="sm" asChild
                                                                    className="flex-1 h-7 text-[11px] font-medium">
                                                                    <Link href={route('admin.events.show', event.id)} className="flex items-center justify-center gap-1.5">
                                                                        <ListTree className="h-3 w-3 shrink-0" />
                                                                        Lihat Rundown
                                                                    </Link>
                                                                </Button>
                                                                <Button variant="ghost" size="sm"
                                                                    onClick={() => setDeleteConfirmId(event.id)}
                                                                    className="h-7 w-7 p-0 text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-all">
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Modal Buat Event ──────────────────────────────────────── */}
            <Dialog open={isModalOpen} onOpenChange={open => !open && closeModal()}>
                <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden border border-border rounded-xl bg-background">
                    <form onSubmit={submit}>
                        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
                            <DialogTitle className="text-sm font-bold">Buat Event Baru</DialogTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">Isi informasi agenda kegiatan di bawah ini.</p>
                        </DialogHeader>

                        <div className="px-5 py-4 space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev_title" className="text-xs font-semibold">
                                    Nama Event <span className="text-destructive">*</span>
                                </Label>
                                <Input id="ev_title" placeholder="Contoh: Makrab Maba 2026"
                                    value={data.title} onChange={e => setData('title', e.target.value)}
                                    required className="h-9 text-sm" />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="ev_desc" className="text-xs font-semibold flex gap-1.5">
                                    Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
                                </Label>
                                <Textarea id="ev_desc" placeholder="Tuliskan ringkasan acara..."
                                    value={data.description} onChange={e => setData('description', e.target.value)}
                                    className="resize-none h-16 text-sm" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-3 sm:col-span-1 space-y-1.5">
                                    <Label htmlFor="ev_date" className="text-xs font-semibold">
                                        Tanggal <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="ev_date" type="date" value={data.event_date}
                                        onChange={e => setData('event_date', e.target.value)}
                                        required className="h-9 text-sm" />
                                    <InputError message={errors.event_date} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ev_start" className="text-xs font-semibold">
                                        Mulai <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="ev_start" type="time" value={data.start_time}
                                        onChange={e => setData('start_time', e.target.value)}
                                        required className="h-9 text-sm" />
                                    <InputError message={errors.start_time} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ev_end" className="text-xs font-semibold">
                                        Selesai <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="ev_end" type="time" value={data.end_time}
                                        onChange={e => setData('end_time', e.target.value)}
                                        required className="h-9 text-sm" />
                                    <InputError message={errors.end_time} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="ev_loc" className="text-xs font-semibold">
                                    Lokasi <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                    <Input id="ev_loc" placeholder="Contoh: Gedung A, Lt.2"
                                        value={data.location} onChange={e => setData('location', e.target.value)}
                                        required className="h-9 text-sm pl-9" />
                                </div>
                                <InputError message={errors.location} />
                            </div>
                        </div>

                        <div className="px-5 py-3.5 border-t border-border flex items-center justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={closeModal}
                                className="h-8 px-4 text-xs font-medium">
                                Batal
                            </Button>
                            <Button type="submit" size="sm" disabled={processing}
                                className="h-8 px-5 text-xs font-medium gap-1.5">
                                {processing
                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>
                                    : <><Plus className="h-3.5 w-3.5" /> Simpan Event</>
                                }
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}