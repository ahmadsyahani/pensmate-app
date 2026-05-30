import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Users, CalendarDays, Award } from 'lucide-react';

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

export default function PensMates({ auth, members, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // Mengirim request pencarian secara dynamic ke backend
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('pensmates.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    // Auto-search saat kolom input dikosongkan secara penuh
    useEffect(() => {
        if (search === '' && filters.search) {
            router.get(route('pensmates.index'), {}, {
                preserveState: true,
                replace: true
            });
        }
    }, [search]);

    // Beragam gradient bg untuk avatar inisial
    const gradients = [
        'from-pink-500 to-rose-500 text-white',
        'from-purple-500 to-indigo-500 text-white',
        'from-blue-500 to-cyan-500 text-white',
        'from-teal-500 to-emerald-500 text-white',
        'from-amber-500 to-orange-500 text-white',
    ];

    const getAvatarGradient = (name) => {
        const charCode = name.charCodeAt(0) || 0;
        return gradients[charCode % gradients.length];
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <h2 className="font-semibold text-sm text-foreground">PensMates</h2>
                    </div>
                    <Badge variant="secondary" className="h-6 text-[10px] font-semibold uppercase tracking-wider">
                        {members.length} Mates
                    </Badge>
                </div>
            }
        >
            <Head title="PensMates - Direktori Anggota" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">Temukan Temanmu! 🤝</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Cari dan hubungi sesama mahasiswa PENS yang aktif di PensMate.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-80 relative">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama atau NRP..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs focus-visible:ring-primary shadow-sm"
                            />
                        </div>
                        <button type="submit" className="hidden" />
                    </form>
                </div>

                {/* Member Grid */}
                {members.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-16 text-center border border-dashed rounded-lg bg-background/50 backdrop-blur-sm"
                    >
                        <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <h4 className="font-semibold text-sm text-muted-foreground">Tidak Ada Teman Ditemukan</h4>
                        <p className="text-xs text-muted-foreground mt-1 px-4">
                            Coba cari menggunakan kata kunci nama lengkap atau NRP yang lain.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {members.map((member) => (
                                <motion.div
                                    key={member.id}
                                    variants={cardVariants}
                                    layout
                                    className="h-full"
                                >
                                    <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border-border bg-background/50 backdrop-blur-sm group hover:-translate-y-0.5">
                                        <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                                            <div className="flex items-start gap-3">
                                                {/* Initial Avatar */}
                                                <div className={`h-11 w-11 rounded-full shrink-0 flex items-center justify-center font-bold text-sm bg-gradient-to-tr shadow-sm ${getAvatarGradient(member.name)}`}>
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <div className="flex items-center gap-1.5 justify-between">
                                                        <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors pr-2">
                                                            {member.name}
                                                        </p>
                                                        <Badge variant="secondary" className="h-5 text-[9px] bg-emerald-50 text-emerald-600 border-none shrink-0 font-medium font-sans">
                                                            Active
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[11px] font-mono text-muted-foreground">{member.nrp}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                                                    <span className="truncate text-foreground/80">{member.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                                                    <span>Member Komunitas</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 italic font-normal">
                                                    <CalendarDays className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                                                    <span>Terdaftar {new Date(member.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
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
