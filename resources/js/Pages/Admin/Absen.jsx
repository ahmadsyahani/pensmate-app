import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import {
    KeyRound, CalendarDays, MapPin, Clock, Loader2,
    RefreshCw, Trash2, CheckCircle2, Timer, AlertTriangle,
    Users, TimerOff, Pencil, Radio,
} from 'lucide-react';

/* ─── Helpers ────────────────────────────────────────────────── */
const fmtDate  = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime  = (t) => t?.substring(0, 5) ?? '--:--';
const fmtClock = (iso) => new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

/* ─── Countdown hook ─────────────────────────────────────────── */
function useCountdown(expiresAt, active) {
    const [remaining, setRemaining] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    useEffect(() => {
        if (!expiresAt || !active) { setRemaining('Tidak aktif'); setIsExpired(true); return; }
        const tick = () => {
            const diff = new Date(expiresAt) - new Date();
            if (diff <= 0) { setRemaining('Kedaluwarsa'); setIsExpired(true); return; }
            setIsExpired(false);
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setRemaining(`${m}m ${String(s).padStart(2, '0')}s`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [expiresAt, active]);
    return { remaining, isExpired };
}

/* ─── Status config ──────────────────────────────────────────── */
const STATUS = {
    upcoming: { label: 'Akan Berlangsung', dot: 'bg-amber-400',              badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    ongoing:  { label: 'Sedang Berlangsung', dot: 'bg-emerald-500 animate-pulse', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ended:    { label: 'Selesai',           dot: 'bg-muted-foreground',       badge: 'bg-muted text-muted-foreground border-border' },
};

/* ─── Duration options (simple) ──────────────────────────────── */
const DURATIONS = [
    { label: '15 Menit', value: 15 },
    { label: '30 Menit', value: 30 },
    { label: '1 Jam',    value: 60 },
    { label: '2 Jam',    value: 120 },
];

/* ─── Big Token Block ────────────────────────────────────────── */
function TokenBlock({ session, onDelete, deleting }) {
    const { remaining, isExpired } = useCountdown(session.expires_at, session.is_active && session.is_valid);
    const valid = session.is_active && !isExpired;

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Status pill */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full border ${
                valid ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted text-muted-foreground border-border'
            }`}>
                <span className={`h-2 w-2 rounded-full ${valid ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                {valid ? 'Token Aktif' : isExpired ? 'Kedaluwarsa' : 'Nonaktif'}
            </span>

            {/* Digit boxes */}
            <div className="flex gap-3 sm:gap-4">
                {session.token.split('').map((digit, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -16, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                        className={`w-14 h-20 sm:w-16 sm:h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black border-2 select-none ${
                            valid
                                ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/15'
                                : 'bg-muted border-border text-muted-foreground'
                        }`}
                    >
                        {digit}
                    </motion.div>
                ))}
            </div>

            {/* Countdown */}
            <div className={`flex items-center gap-2 text-base font-bold font-mono ${valid ? 'text-primary' : 'text-muted-foreground'}`}>
                <Timer className="h-4 w-4" />
                {remaining}
            </div>

            {/* Delete */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(session.id)}
                disabled={deleting}
                className="h-9 px-5 gap-2 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
            >
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Hapus Token
            </Button>
        </div>
    );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function Absen({ auth, events, sessions }) {
    const [deletingId, setDeletingId] = useState(null);
    const [customDur,  setCustomDur]  = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        event_id:         events.length > 0 ? String(events[0].id) : '',
        duration_minutes: 30,
    });

    const activeEvent   = events.find(e => e.id === Number(data.event_id));
    const activeSession = sessions.find(s => s.event_id === Number(data.event_id) && s.is_active && s.is_valid);
    const statusCfg     = STATUS[activeEvent?.status] ?? STATUS.ended;

    const handleGenerate = (e) => {
        e.preventDefault();
        post(route('admin.session.generate'), { preserveScroll: true, onSuccess: () => reset() });
    };

    const handleDelete = (id) => {
        setDeletingId(id);
        router.post(route('admin.session.deactivate', id), {}, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    const pickDuration = (val) => { setCustomDur(false); setData('duration_minutes', val); };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="font-semibold text-sm text-foreground">Sesi Token Absensi</h2>
                    <span className="text-[10px] font-medium text-muted-foreground hidden sm:block">Token 6 digit</span>
                </div>
            }
        >
            <Head title="Sesi Token Absensi — Admin" />

            <div className="max-w-5xl mx-auto space-y-6">

                {/* ── Step 1: Pilih Event ──────────────────────────────── */}
                <section className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center shrink-0">1</span>
                        <p className="text-sm font-bold text-foreground">Pilih Event</p>
                    </div>

                    {events.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-border p-8 text-center space-y-2">
                            <AlertTriangle className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                            <p className="text-xs text-muted-foreground">Belum ada event terdaftar.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {events.map(ev => {
                                const cfg      = STATUS[ev.status] ?? STATUS.ended;
                                const selected = data.event_id === String(ev.id);
                                return (
                                    <motion.button
                                        key={ev.id}
                                        type="button"
                                        onClick={() => { setData('event_id', String(ev.id)); }}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`text-left rounded-xl border-2 p-4 transition-all duration-150 ${
                                            selected
                                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                                : 'border-border bg-background hover:border-primary/40'
                                        }`}
                                    >
                                        {/* Status */}
                                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border mb-2 ${cfg.badge}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                            {cfg.label}
                                        </span>

                                        {/* Title */}
                                        <p className={`text-sm font-bold leading-snug truncate ${selected ? 'text-primary' : 'text-foreground'}`}>
                                            {ev.title}
                                        </p>

                                        {/* Meta */}
                                        <div className="mt-2 space-y-1 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3 w-3" />
                                                {fmtDate(ev.event_date)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3" />
                                                <span className="font-mono">{fmtTime(ev.start_time)} – {fmtTime(ev.end_time)}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3" />
                                                {ev.location}
                                            </span>
                                        </div>

                                        {/* Attendance badge */}
                                        {ev.attendances?.length > 0 && (
                                            <div className="mt-2.5 pt-2.5 border-t border-border flex items-center gap-1 text-[10px] text-emerald-600">
                                                <Users className="h-3 w-3" />
                                                <span className="font-semibold">{ev.attendances.length} hadir</span>
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ── Step 2: Token + Generate + Attendance ─────────────── */}
                {activeEvent && (
                    <motion.section
                        key={activeEvent.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"
                    >
                        {/* Left: Token hero + generate form */}
                        <div className="space-y-5">
                            {/* Event title bar */}
                            <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground mb-0.5">Event Dipilih</p>
                                    <p className="text-sm font-bold text-foreground truncate">{activeEvent.title}</p>
                                </div>
                                <span className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border ${statusCfg.badge}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                                    {statusCfg.label}
                                </span>
                            </div>

                            {/* Token hero */}
                            <div className="bg-background border border-border rounded-2xl overflow-hidden">
                                <div className={`h-1 w-full ${activeSession ? 'bg-gradient-to-r from-primary via-primary/70 to-accent' : 'bg-border'}`} />
                                <div className="py-10 px-6 flex flex-col items-center">
                                    <AnimatePresence mode="wait">
                                        {activeSession ? (
                                            <motion.div
                                                key={activeSession.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="w-full flex flex-col items-center"
                                            >
                                                <TokenBlock
                                                    session={activeSession}
                                                    onDelete={handleDelete}
                                                    deleting={deletingId === activeSession.id}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="empty"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex flex-col items-center gap-3 text-center"
                                            >
                                                <div className="h-16 w-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center">
                                                    <KeyRound className="h-7 w-7 text-muted-foreground/25" />
                                                </div>
                                                <p className="text-sm font-bold text-muted-foreground">Belum ada token aktif</p>
                                                <p className="text-xs text-muted-foreground/60 max-w-xs">
                                                    Atur durasi di bawah lalu klik Generate untuk membuat token baru.
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Generate form */}
                            <form onSubmit={handleGenerate} className="bg-background border border-border rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center shrink-0">2</span>
                                    <p className="text-sm font-bold text-foreground">Atur Durasi & Generate</p>
                                </div>

                                {/* Duration pills */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-muted-foreground">Durasi Token</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {DURATIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => pickDuration(opt.value)}
                                                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                                                    !customDur && data.duration_minutes === opt.value
                                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setCustomDur(true)}
                                            className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                                customDur
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                            }`}
                                        >
                                            <Pencil className="h-3 w-3" /> Kustom
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {customDur && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Input
                                                        type="number" min={5} max={480}
                                                        value={data.duration_minutes}
                                                        onChange={e => setData('duration_minutes', Number(e.target.value))}
                                                        className="h-9 text-sm font-mono w-28"
                                                    />
                                                    <span className="text-xs text-muted-foreground">menit (5 – 480)</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <p className="text-[10px] text-muted-foreground">
                                        Token berlaku selama{' '}
                                        <span className="font-semibold text-foreground">
                                            {data.duration_minutes >= 60
                                                ? `${data.duration_minutes / 60} jam`
                                                : `${data.duration_minutes} menit`}
                                        </span>{' '}
                                        sejak dibuat.
                                    </p>
                                </div>

                                {/* Warning */}
                                {activeSession && (
                                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span>
                                            Token aktif saat ini (<strong className="font-mono">{activeSession.token}</strong>) akan dihapus dan diganti.
                                        </span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-10 text-sm font-semibold gap-2 rounded-xl"
                                    disabled={processing}
                                >
                                    {processing
                                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Membuat Token...</>
                                        : <><RefreshCw className="h-4 w-4" /> Generate Token Baru</>
                                    }
                                </Button>
                            </form>
                        </div>

                        {/* Right: Attendance + History */}
                        <div className="space-y-4">

                            {/* Attendance list */}
                            <div className="bg-background border border-border rounded-2xl overflow-hidden">
                                <div className="px-4 py-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Kehadiran</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">Member yang sudah absen</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                                        (activeEvent.attendances?.length ?? 0) > 0
                                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                            : 'text-muted-foreground bg-muted border-border'
                                    }`}>
                                        <Users className="h-3 w-3" />
                                        {activeEvent.attendances?.length ?? 0}
                                    </span>
                                </div>

                                {!activeEvent.attendances?.length ? (
                                    <div className="py-10 flex flex-col items-center gap-2">
                                        <Users className="h-8 w-8 text-muted-foreground/15" />
                                        <p className="text-xs text-muted-foreground">Belum ada yang hadir</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
                                        {activeEvent.attendances.map((att, idx) => (
                                            <motion.div
                                                key={att.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                                            >
                                                <span className="text-[10px] font-mono font-bold text-muted-foreground/40 w-4 text-right shrink-0">{idx + 1}</span>
                                                <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-[11px] font-black text-primary">
                                                    {att.user?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-foreground truncate">{att.user?.name}</p>
                                                    <p className="text-[10px] font-mono text-muted-foreground">{att.user?.nrp}</p>
                                                </div>
                                                <p className="text-[10px] font-mono text-muted-foreground shrink-0">{fmtClock(att.attended_at)}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Session history */}
                            <div className="bg-background border border-border rounded-2xl overflow-hidden">
                                <div className="px-4 py-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                                    <p className="text-xs font-bold text-foreground">Riwayat Token</p>
                                    <span className="text-[10px] text-muted-foreground">{sessions.length} sesi</span>
                                </div>

                                {sessions.length === 0 ? (
                                    <div className="py-8 flex flex-col items-center gap-2">
                                        <TimerOff className="h-7 w-7 text-muted-foreground/15" />
                                        <p className="text-xs text-muted-foreground">Belum ada riwayat</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/50 max-h-56 overflow-y-auto">
                                        {sessions.map(s => {
                                            const expired = new Date(s.expires_at) < new Date();
                                            const valid   = s.is_active && !expired;
                                            return (
                                                <div key={s.id} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-bold text-foreground truncate">{s.event_title}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {new Date(s.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="font-mono font-black text-sm tracking-[0.18em] text-foreground">{s.token}</span>
                                                        <span className={`text-[9px] font-bold border rounded px-1.5 py-0.5 ${
                                                            valid
                                                                ? 'border-primary bg-primary/10 text-primary'
                                                                : 'border-border text-muted-foreground bg-muted'
                                                        }`}>
                                                            {valid ? 'AKTIF' : expired ? 'EXP' : 'OFF'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
