import React, { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { Label } from '@/Components/ui/label';
import { motion } from 'framer-motion';
import InputError from '@/Components/InputError';
import { 
    KeyRound, 
    CalendarDays, 
    MapPin, 
    CheckCircle2, 
    Clock, 
    ShieldCheck, 
    CalendarCheck,
    Inbox,
    Loader2,
    Delete
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
        <div className="flex gap-2 justify-center">
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
                    className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 bg-background outline-none transition-all
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                        ${ digits[i]?.trim()
                            ? 'border-primary/50 text-primary shadow-sm shadow-primary/10'
                            : 'border-border text-foreground'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed`}
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

    const fadeUp = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
    };

    const containerVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } }
    };

    // Cari detail event yang sedang dipilih oleh member
    const activeSelectedEvent = events.find(e => e.id === Number(selectedEventId));
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        <h2 className="font-semibold text-sm text-foreground">Kehadiran &amp; Presensi</h2>
                    </div>
                    <Badge variant="secondary" className="h-6 text-[10px] font-semibold uppercase tracking-wider">
                        Token 6 Digit
                    </Badge>
                </div>
            }
        >
            <Head title="Kehadiran - Presensi Digital" />

            <div className="max-w-6xl mx-auto">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* Left Column: QR Card & Token Input */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Card Digital ID (tetap) */}
                        <motion.div variants={fadeUp}>
                            <Card className="overflow-hidden border border-border bg-gradient-to-br from-background via-muted/20 to-background shadow-lg relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                                
                                <CardHeader className="p-5 pb-3 border-b border-border/40">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                            <span className="text-xs font-black tracking-widest text-primary uppercase">PensMate Member Credential</span>
                                        </div>
                                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-mono tracking-widest uppercase">Verified</Badge>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                                    <div className="space-y-4 flex-1 text-center sm:text-left w-full">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Nama Anggota</p>
                                            <p className="text-lg font-black text-foreground tracking-tight">{auth.user.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Nomor Registrasi (NRP)</p>
                                            <p className="text-sm font-mono font-bold text-foreground/90">{auth.user.nrp}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Status Autentikasi</p>
                                            <p className="text-xs font-semibold text-emerald-600 flex items-center justify-center sm:justify-start gap-1">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Akun Terverifikasi
                                            </p>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground leading-relaxed pt-2">
                                            Masukkan token 6 digit yang ditampilkan panitia di layar/proyektor untuk mencatat kehadiran Anda.
                                        </div>
                                    </div>
                                    
                                    {/* KeyRound Icon as identity symbol */}
                                    <div className="p-6 bg-primary/5 border border-primary/20 shadow-inner rounded-2xl flex items-center justify-center shrink-0">
                                        <KeyRound className="w-20 h-20 text-primary/40" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Presensi Mandiri (OTP Token Input) */}
                        <motion.div variants={fadeUp}>
                            <Card className="shadow-md border border-border">
                                <CardHeader className="p-5 pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <KeyRound className="h-4 w-4 text-primary" /> Presensi Mandiri — Token 6 Digit
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Masukkan 6 digit token yang ditampilkan panitia di layar/proyektor.
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="p-5">
                                    {events.length === 0 ? (
                                        <div className="py-6 text-center space-y-2">
                                            <CalendarCheck className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                                            <p className="text-xs text-muted-foreground">Belum ada agenda atau event aktif.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={submit} className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="event_id" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pilih Acara</Label>
                                                <select
                                                    id="event_id"
                                                    value={selectedEventId}
                                                    onChange={(e) => handleEventChange(e.target.value)}
                                                    required
                                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                >
                                                    {events.map((event) => (
                                                        <option key={event.id} value={event.id}>
                                                            {event.title} ({event.event_date})
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.event_id} />
                                            </div>

                                            {activeSelectedEvent && (
                                                <div className="bg-muted/40 p-3 rounded-md border border-border/50 space-y-2 text-xs">
                                                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                                                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>{activeSelectedEvent.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                        <span>{activeSelectedEvent.location}</span>
                                                    </div>
                                                    {activeSelectedEvent.attendance_status ? (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] mt-1 flex items-center gap-1 w-fit">
                                                            <CheckCircle2 className="h-3 w-3" /> Sudah Hadir ({activeSelectedEvent.attended_at})
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-primary/30 text-primary font-bold text-[9px] mt-1 bg-primary/5 w-fit">
                                                            Belum Presensi
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* OTP Input */}
                                            <div className="space-y-3">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">
                                                    Token Kehadiran (6 Digit)
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
                                                className="w-full h-10 text-xs font-bold gap-2"
                                                disabled={processing || activeSelectedEvent?.attendance_status !== null || data.token.length < 6}
                                            >
                                                {processing ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <KeyRound className="h-4 w-4" />
                                                )}
                                                {activeSelectedEvent?.attendance_status ? 'Kehadiran Sudah Tercatat' : processing ? 'Memproses...' : 'Kirim Kehadiran'}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column: Riwayat Kehadiran */}
                    <div className="lg:col-span-5">
                        <motion.div variants={fadeUp} className="h-full">
                            <Card className="h-full shadow-md border border-border">
                                <CardHeader className="p-5 pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <CalendarCheck className="h-4 w-4 text-primary" /> Riwayat Kehadiran
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Daftar semua acara yang telah Anda hadiri di platform PensMate.
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="p-0">
                                    {history.length === 0 ? (
                                        <div className="py-16 text-center space-y-2">
                                            <Inbox className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                                            <p className="text-xs text-muted-foreground">Belum ada riwayat presensi tercatat.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border">
                                            {history.map((record) => (
                                                <div key={record.id} className="p-4 space-y-2 hover:bg-muted/20 transition-colors">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-extrabold text-foreground truncate">{record.event?.title}</p>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium flex items-center gap-1">
                                                                <MapPin className="h-3 w-3 shrink-0" /> {record.event?.location}
                                                            </p>
                                                        </div>
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] shrink-0">
                                                            HADIR
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold pt-1 border-t border-border/40">
                                                        <span className="flex items-center gap-1">
                                                            <CalendarDays className="h-3 w-3" />
                                                            {record.event?.event_date}
                                                        </span>
                                                        <span className="flex items-center gap-1 font-mono">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(record.attended_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
