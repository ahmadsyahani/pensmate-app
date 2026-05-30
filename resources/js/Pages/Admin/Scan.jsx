import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import {
    KeyRound,
    CalendarDays,
    MapPin,
    Clock,
    Sparkles,
    Loader2,
    ShieldCheck,
    RefreshCw,
    PowerOff,
    CheckCircle2,
    XCircle,
    Timer,
    AlertTriangle,
} from 'lucide-react';

// ─── Countdown timer hook ────────────────────────────────────────────────────
function useCountdown(expiresAt, isActive) {
    const [remaining, setRemaining] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!expiresAt || !isActive) {
            setRemaining('Tidak aktif');
            setIsExpired(true);
            return;
        }

        const tick = () => {
            const diff = new Date(expiresAt) - new Date();
            if (diff <= 0) {
                setRemaining('Kedaluwarsa');
                setIsExpired(true);
                return;
            }
            setIsExpired(false);
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setRemaining(`${m}m ${String(s).padStart(2, '0')}s`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [expiresAt, isActive]);

    return { remaining, isExpired };
}

// ─── Token Display Card ───────────────────────────────────────────────────────
function ActiveTokenCard({ session, onDeactivate, deactivating }) {
    const { remaining, isExpired } = useCountdown(session.expires_at, session.is_active && session.is_valid);
    const isValid = session.is_active && !isExpired;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`relative rounded-2xl border-2 overflow-hidden shadow-xl ${
                isValid
                    ? 'border-primary/40 bg-gradient-to-br from-primary/5 via-background to-primary/10'
                    : 'border-border bg-muted/30'
            }`}
        >
            {/* Glow effect for active tokens */}
            {isValid && (
                <div className="absolute inset-0 bg-primary/3 pointer-events-none" />
            )}

            <div className="p-6 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            {session.event_title}
                        </p>
                        <div className="flex items-center gap-2">
                            {isValid ? (
                                <Badge className="bg-emerald-500/15 text-emerald-600 border-none text-[9px] font-bold uppercase tracking-wider gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                    AKTIF
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider">
                                    {session.is_active ? 'KEDALUWARSA' : 'DINONAKTIFKAN'}
                                </Badge>
                            )}
                        </div>
                    </div>
                    {isValid && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeactivate(session.id)}
                            disabled={deactivating}
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-xs h-8 gap-1.5"
                        >
                            {deactivating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <PowerOff className="h-3.5 w-3.5" />
                            )}
                            Nonaktifkan
                        </Button>
                    )}
                </div>

                {/* Big Token Display */}
                <div className="my-5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">
                        Token Kehadiran
                    </p>
                    <div className="flex justify-center gap-2">
                        {session.token.split('').map((digit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className={`w-12 h-16 rounded-xl flex items-center justify-center text-3xl font-black tracking-tight border-2 shadow-sm ${
                                    isValid
                                        ? 'bg-background border-primary/30 text-primary shadow-primary/10'
                                        : 'bg-muted border-border text-muted-foreground'
                                }`}
                            >
                                {digit}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Countdown */}
                <div className={`flex items-center justify-center gap-2 text-sm font-bold ${
                    isValid ? (remaining.includes('m') && parseInt(remaining) < 5 ? 'text-amber-500' : 'text-primary') : 'text-muted-foreground'
                }`}>
                    <Timer className="h-4 w-4" />
                    <span>{remaining}</span>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Scan({ auth, events, sessions }) {
    const [deactivatingId, setDeactivatingId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        event_id:          events.length > 0 ? events[0].id : '',
        duration_minutes:  120,
    });

    const activeEvent = events.find(e => e.id === Number(data.event_id));

    // Sesi aktif yang valid untuk event yang dipilih
    const activeSessionForEvent = sessions.find(
        s => s.event_id === Number(data.event_id) && s.is_active && s.is_valid
    );

    // Semua sesi (untuk riwayat)
    const recentSessions = sessions.slice(0, 10);

    const handleGenerate = (e) => {
        e.preventDefault();
        post(route('admin.session.generate'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleDeactivate = (id) => {
        setDeactivatingId(id);
        router.post(route('admin.session.deactivate', id), {}, {
            preserveScroll: true,
            onFinish: () => setDeactivatingId(null),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        <h2 className="font-semibold text-sm text-foreground">Sesi Token Absensi</h2>
                    </div>
                    <Badge variant="secondary" className="h-6 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border-none">
                        Token 6 Digit
                    </Badge>
                </div>
            }
        >
            <Head title="Sesi Token Absensi - Admin Console" />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Info Banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-xs text-foreground/80 leading-relaxed">
                        <span className="font-bold text-foreground">Cara kerja:</span> Generate token 6 digit untuk event yang sedang berjalan → Tampilkan di layar/proyektor → Member masukkan token di halaman Kehadiran mereka secara mandiri. Token otomatis kedaluwarsa sesuai durasi yang dipilih.
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left: Generate Token */}
                    <div className="lg:col-span-5 space-y-5">
                        <Card className="shadow-md border border-border">
                            <CardHeader className="p-5 pb-3 border-b border-border bg-muted/5">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-primary" />
                                    Buat Sesi Token Baru
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Pilih event dan durasi, lalu klik Generate. Token lama untuk event ini akan otomatis dinonaktifkan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-5">
                                {events.length === 0 ? (
                                    <div className="py-6 text-center space-y-2">
                                        <AlertTriangle className="h-6 w-6 text-amber-500/50 mx-auto" />
                                        <p className="text-xs text-muted-foreground">Belum ada event terdaftar. Buat event terlebih dahulu.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleGenerate} className="space-y-4">
                                        {/* Event Selector */}
                                        <div className="space-y-2">
                                            <Label htmlFor="gen_event_id" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                Pilih Event
                                            </Label>
                                            <select
                                                id="gen_event_id"
                                                value={data.event_id}
                                                onChange={(e) => setData('event_id', e.target.value)}
                                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            >
                                                {events.map(ev => (
                                                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.event_date})</option>
                                                ))}
                                            </select>
                                            {errors.event_id && <p className="text-xs text-rose-500 font-semibold">{errors.event_id}</p>}
                                        </div>

                                        {/* Event Info */}
                                        {activeEvent && (
                                            <div className="bg-muted/40 p-3 rounded-lg border border-border/50 space-y-2 text-xs">
                                                <div className="flex items-center gap-1.5 font-bold text-foreground">
                                                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                                                    <span>{activeEvent.title}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground font-medium">
                                                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {activeEvent.event_date}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activeEvent.location}</span>
                                                    <span className="flex items-center gap-1 font-mono"><Clock className="h-3 w-3" /> {activeEvent.start_time?.substring(0, 5)} - {activeEvent.end_time?.substring(0, 5)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Duration */}
                                        <div className="space-y-2">
                                            <Label htmlFor="duration" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                Durasi Token
                                            </Label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[30, 60, 120, 180].map(d => (
                                                    <button
                                                        key={d}
                                                        type="button"
                                                        onClick={() => setData('duration_minutes', d)}
                                                        className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                                                            data.duration_minutes === d
                                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                                        }`}
                                                    >
                                                        {d < 60 ? `${d}m` : `${d/60}j`}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">Token berlaku {data.duration_minutes} menit sejak dibuat.</p>
                                            {errors.duration_minutes && <p className="text-xs text-rose-500 font-semibold">{errors.duration_minutes}</p>}
                                        </div>

                                        {/* Warning jika sudah ada sesi aktif */}
                                        {activeSessionForEvent && (
                                            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                                <span>Event ini sudah memiliki sesi aktif (<strong className="font-mono">{activeSessionForEvent.token}</strong>). Generate baru akan menonaktifkan token lama.</span>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full h-10 text-sm font-bold shadow-md shadow-primary/20 gap-2"
                                            disabled={processing || events.length === 0}
                                        >
                                            {processing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <KeyRound className="h-4 w-4" />
                                            )}
                                            {processing ? 'Membuat Token...' : 'Generate Token Baru'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Active Token Display + History */}
                    <div className="lg:col-span-7 space-y-5">

                        {/* Active Token for Selected Event */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">
                                Token Aktif untuk Event Dipilih
                            </p>
                            <AnimatePresence mode="wait">
                                {activeSessionForEvent ? (
                                    <ActiveTokenCard
                                        key={activeSessionForEvent.id}
                                        session={activeSessionForEvent}
                                        onDeactivate={handleDeactivate}
                                        deactivating={deactivatingId === activeSessionForEvent.id}
                                    />
                                ) : (
                                    <motion.div
                                        key="no-token"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center space-y-3"
                                    >
                                        <KeyRound className="h-10 w-10 mx-auto text-muted-foreground/20" />
                                        <p className="text-sm font-bold text-muted-foreground">Belum ada sesi aktif</p>
                                        <p className="text-xs text-muted-foreground/70">Generate token untuk event ini agar member bisa presensi mandiri.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Session History */}
                        <Card className="shadow-md border border-border overflow-hidden">
                            <CardHeader className="p-4 pb-2 border-b border-border bg-muted/5 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold text-foreground">Riwayat Sesi Token</CardTitle>
                                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold">{sessions.length} Sesi</Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                {recentSessions.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-muted-foreground/50 font-medium">
                                        Belum ada sesi token yang pernah dibuat.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {recentSessions.map((s) => {
                                            const exp = new Date(s.expires_at) < new Date();
                                            const valid = s.is_active && !exp;
                                            return (
                                                <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-muted/10 transition-colors">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-extrabold text-foreground truncate">{s.event_title}</p>
                                                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                                            {new Date(s.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="font-mono font-black text-base tracking-[0.2em] text-foreground">{s.token}</span>
                                                        {valid ? (
                                                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] gap-1">
                                                                <CheckCircle2 className="h-3 w-3" /> Aktif
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-muted-foreground font-bold text-[9px] gap-1">
                                                                <XCircle className="h-3 w-3" /> {s.is_active ? 'Expired' : 'Nonaktif'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </AuthenticatedLayout>
    );
}
