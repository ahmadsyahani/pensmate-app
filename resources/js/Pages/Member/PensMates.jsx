import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Users, CalendarDays, Award } from 'lucide-react';

const AVATAR_COLORS = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-indigo-100 text-indigo-700',
    'bg-teal-100 text-teal-700',
    'bg-orange-100 text-orange-700',
];

const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

export default function PensMates({ auth, members, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('pensmates.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    useEffect(() => {
        if (search === '' && filters.search) {
            router.get(route('pensmates.index'), {}, {
                preserveState: true,
                replace: true
            });
        }
    }, [search]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="font-semibold text-sm text-foreground">PensMates</h2>
                    <span className="text-[10px] font-medium text-muted-foreground">{members.length} anggota</span>
                </div>
            }
        >
            <Head title="PensMates — Direktori Anggota" />

            <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">

                {/* ── Header + Search ──────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-foreground tracking-tight">Direktori Anggota</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Cari dan hubungi sesama mahasiswa PENS yang aktif di PensMate.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="w-full sm:w-64">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama atau NRP..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                        <button type="submit" className="hidden" />
                    </form>
                </div>

                {/* ── Member Grid ──────────────────────────────────────── */}
                {members.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center border border-dashed border-border rounded-xl"
                    >
                        <Users className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                        <h4 className="font-semibold text-sm text-muted-foreground">Tidak Ada Hasil</h4>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Coba kata kunci nama lengkap atau NRP lain.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {members.map((member) => (
                                <motion.div
                                    key={member.id}
                                    variants={cardVariants}
                                    layout
                                    className="h-full"
                                >
                                    <Card className="h-full border border-border hover:shadow-sm hover:border-primary/20 transition-all duration-200">
                                        <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                                            {/* Top: Avatar + Name */}
                                            <div className="flex items-start gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor(member.name)}`}>
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-0.5">
                                                    <div className="flex items-center gap-2 justify-between">
                                                        <p className="font-bold text-sm text-foreground truncate">
                                                            {member.name}
                                                        </p>
                                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 shrink-0">
                                                            AKTIF
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] font-mono text-muted-foreground">{member.nrp}</p>
                                                </div>
                                            </div>

                                            {/* Bottom: Details */}
                                            <div className="space-y-1.5 pt-3 border-t border-border text-[11px] text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{member.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="h-3 w-3 shrink-0" />
                                                    <span>Member Komunitas</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="h-3 w-3 shrink-0" />
                                                    <span>
                                                        Terdaftar {new Date(member.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
