import React, { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { motion } from 'framer-motion';
import InputError from '@/Components/InputError';
import {
    KeyRound,
    CalendarDays,
    MapPin,
    CheckCircle2,
    Clock,
    CalendarCheck,
    Inbox,
    Loader2,
    Fingerprint,
    BadgeCheck
} from 'lucide-react';

// ─── OTP-Style 6-Digit Input ─────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
    const inputRefs = useRef([]);
    const digits = (value + '      ').slice(0, 6).split('');

    const handleChange = (i, val) => {
        val = val.replace(/\D/g, '').slice(-1);
        const newDigits = digits.map((d, idx) => idx === i ? val : d);
        const newVal = newDigits.join('').replace(/ /g, '');
        onChange(newVal);
        if (val && i < 5) {
            inputRefs.current[i + 1]?.focus();
        }
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i].trim() && i > 0) {
            inputRefs.current[i - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < 5) inputRefs.current[i + 1]?.focus();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        const nextFocus = Math.min(pasted.length, 5);
        inputRefs.current[nextFocus]?.focus();
    };

    return (
        <div className="flex gap-2 sm:gap-3 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]?.trim() || ''}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-black rounded-xl border-2 bg-background/50 outline-none transition-all duration-300
                        focus:border-primary focus:ring-4 focus:ring-primary/20 shadow-sm
                        ${digits[i]?.trim()
                            ? 'border-primary text-primary bg-primary/5 scale-105 shadow-md shadow-primary/10'
                            : 'border-border/60 text-foreground hover:border-primary/50'
                        }
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:scale-100 disabled:shadow-none`}
                />
            ))}
        </div>
    );
}

export default function Kehadiran({ auth, events, history }) {
    const [selectedEventId, setSelectedEventId] = useState(events.length > 0 ? events[0].id : '');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        event_id: events.length > 0 ? events[0].id : '',
        token: '',
    });

    const handleEventChange = (eventId) => {
        setSelectedEventId(eventId);
        setData('event_id', eventId);
        clearErrors('token');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('kehadiran.store'), {
            onSuccess: () => {
                reset('token');
                clearErrors();
            }
        });
    };

    const activeSelectedEvent = events.find(e => e.id === Number(selectedEventId));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-primary" /> Kehadiran & Presensi
                    </h2>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full hidden sm:block">
                        Digital Check-in
                    </span>
                </div>
            }
        >
            <Head title="Kehadiran — Presensi Digital" />

            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* ── Left: Credential + Input ──────────────────────── */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Member Credential Card (ID Card Style) */}
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-indigo-500/5 p-6 sm:p-8 shadow-lg shadow-primary/5"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                            
                            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Photo/Avatar Placeholder */}
                                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 p-1 shrink-0 shadow-lg shadow-primary/20">
                                    <div className="h-full w-full bg-background rounded-xl flex items-center justify-center">
                                        <span className="text-3xl font-black text-primary">
                                            {auth.user.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 space-y-4 text-center sm:text-left">
                                    <div>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Kartu Tanda Anggota</p>
                                        <p className="text-2xl font-black text-foreground leading-tight">{auth.user.name}</p>
                                        <p className="text-sm font-mono text-muted-foreground mt-0.5">{auth.user.nrp}</p>
                                    </div>
                                    <div className="inline-flex items-center justify-center sm:justify-start gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                                        <BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Terverifikasi Aktif</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Token Input Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <Card className="border border-border/60 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-indigo-500 via-primary to-purple-500 w-full" />
                                <CardHeader className="p-6 pb-2 text-center">
                                    <CardTitle className="text-lg font-black text-foreground">Presensi Mandiri</CardTitle>
                                    <CardDescription className="text-sm max-w-sm mx-auto mt-1">
                                        Masukkan 6 digit token rahasia yang diberikan oleh panitia acara.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 sm:p-8 pt-4">
                                    {events.length === 0 ? (
                                        <div className="py-10 text-center space-y-3">
                                            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 border border-border shadow-inner">
                                                <CalendarCheck className="h-8 w-8 text-muted-foreground/40" />
                                            </div>
                                            <p className="font-bold text-foreground">Tidak Ada Event Aktif</p>
                                            <p className="text-xs text-muted-foreground max-w-xs mx-auto">Kehadiran tidak dapat dicatat karena belum ada agenda event terdekat.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={submit} className="space-y-8">
                                            {/* Event Selector */}
                                            <div className="space-y-3">
                                                <Label htmlFor="event_id" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    Pilih Acara
                                                </Label>
                                                <select
                                                    id="event_id"
                                                    value={selectedEventId}
                                                    onChange={(e) => handleEventChange(e.target.value)}
                                                    required
                                                    className="w-full h-12 rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                                >
                                                    {events.map((event) => (
                                                        <option key={event.id} value={event.id}>
                                                            {event.title} ({new Date(event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.event_id} />

                                                {/* Event Info Card */}
                                                {activeSelectedEvent && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }} 
                                                        animate={{ opacity: 1, height: 'auto' }} 
                                                        className="mt-3 bg-muted/30 p-4 rounded-xl border border-border/50 text-sm overflow-hidden"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                                <MapPin className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="font-bold text-foreground">{activeSelectedEvent.title}</p>
                                                                <p className="text-xs text-muted-foreground">{activeSelectedEvent.location}</p>
                                                                
                                                                {activeSelectedEvent.attendance_status ? (
                                                                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 pt-1.5">
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                        <span className="text-xs font-bold">Terverifikasi Hadir Pukul {new Date(activeSelectedEvent.attended_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5 text-amber-500 pt-1.5">
                                                                        <Clock className="h-4 w-4" />
                                                                        <span className="text-xs font-bold">Belum Absen</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* OTP Input Container */}
                                            <div className="space-y-4 bg-muted/20 p-6 rounded-2xl border border-border/50 relative overflow-hidden">
                                                {activeSelectedEvent?.attendance_status && (
                                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                                                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <p className="font-bold text-foreground text-center px-4">Anda sudah melakukan presensi<br/>pada event ini.</p>
                                                    </div>
                                                )}

                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block text-center">
                                                    Token Akses (6 Digit)
                                                </Label>
                                                <OtpInput
                                                    value={data.token}
                                                    onChange={(val) => setData('token', val)}
                                                    disabled={processing || activeSelectedEvent?.attendance_status !== null}
                                                />
                                                <InputError message={errors.token} className="text-center" />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-12 text-sm font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 rounded-xl"
                                                disabled={processing || activeSelectedEvent?.attendance_status !== null || data.token.length < 6}
                                            >
                                                {processing ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <KeyRound className="h-5 w-5" />
                                                )}
                                                {activeSelectedEvent?.attendance_status ? 'Kehadiran Sudah Tercatat' : processing ? 'Memproses Token...' : 'Konfirmasi Kehadiran'}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* ── Right: History ────────────────────────────────── */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="h-full"
                        >
                            <Card className="border border-border/60 shadow-sm bg-background/50 backdrop-blur-sm h-full flex flex-col">
                                <CardHeader className="p-6 border-b border-border/50">
                                    <CardTitle className="text-sm font-black text-foreground flex items-center gap-2">
                                        <HistoryIcon className="h-4 w-4 text-primary" /> Riwayat Kehadiran
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        Jejak rekam partisipasi Anda di komunitas.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 flex-1">
                                    {history.length === 0 ? (
                                        <div className="py-20 text-center flex flex-col items-center justify-center h-full">
                                            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4 border border-border shadow-inner">
                                                <Inbox className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                            <p className="text-sm font-bold text-foreground">Belum ada riwayat</p>
                                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">Anda belum pernah melakukan presensi di event apapun.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/50">
                                            {history.map((record, index) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                                                    key={record.id} 
                                                    className="p-5 sm:p-6 hover:bg-muted/30 transition-colors group"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{record.event?.title}</p>
                                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
                                                                <span className="flex items-center gap-1.5">
                                                                    <CalendarDays className="h-3.5 w-3.5 text-primary/70" />
                                                                    {new Date(record.event?.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <MapPin className="h-3.5 w-3.5 text-rose-500/70" />
                                                                    <span className="truncate max-w-[120px]">{record.event?.location}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                                            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2.5 py-1 shadow-sm">
                                                                HADIR
                                                            </span>
                                                            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(record.attended_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Icon helper
function HistoryIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    )
}
