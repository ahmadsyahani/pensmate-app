import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Check,
    X,
    ExternalLink,
    Inbox,
    Users,
    Clock,
    Search,
    AlertCircle,
    UserCheck,
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

function StatCard({ icon: Icon, label, value, iconClass }) {
    return (
        <motion.div variants={fadeUp}>
            <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                        <p className="text-xl font-black text-foreground leading-none mt-1">{value}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function Approval({ auth, pendingUsers }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleApprove = (id) => {
        if (confirm('Yakin setujui pendaftaran mahasiswa ini?')) {
            router.post(route('admin.approve', id));
        }
    };

    const handleReject = (id) => {
        if (confirm('Yakin tolak dan hapus data pendaftaran ini?')) {
            router.post(route('admin.reject', id));
        }
    };

    const filteredUsers = pendingUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nrp.includes(searchQuery)
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="font-semibold text-sm text-foreground">Validasi Member</h2>
                    <span className="text-[10px] font-medium text-muted-foreground hidden sm:block">
                        {pendingUsers.length} menunggu
                    </span>
                </div>
            }
        >
            <Head title="Validasi Member" />

            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">

                {/* ── Page Title ───────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="text-base font-bold text-foreground tracking-tight">Antrean Pendaftar</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Tinjau dan verifikasi identitas mahasiswa baru.</p>
                </motion.div>

                {/* ── Stats ───────────────────────────────────────────── */}
                <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <StatCard icon={Clock} label="Menunggu" value={pendingUsers.length} iconClass="bg-amber-50 text-amber-600" />
                    <StatCard icon={Users} label="Disetujui" value="—" iconClass="bg-emerald-50 text-emerald-600" />
                    <motion.div variants={fadeUp}>
                        <Card className="border border-dashed border-amber-200 h-full bg-amber-50/50">
                            <CardContent className="p-3 sm:p-4 flex items-center gap-3 h-full">
                                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-foreground">Catatan</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Pastikan KTM jelas sebelum menyetujui.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* ── Table Area ───────────────────────────────────────── */}
                <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <Card className="border border-border">
                        {/* Toolbar */}
                        <div className="p-3 border-b border-border flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                            <div className="relative w-full sm:w-60">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau NRP..."
                                    className="h-8 w-full pl-8 text-xs"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <span className="text-[11px] text-muted-foreground shrink-0">
                                {filteredUsers.length} dari {pendingUsers.length} pendaftar
                            </span>
                        </div>

                        {/* Content */}
                        <CardContent className="p-0">
                            {filteredUsers.length === 0 ? (
                                <div className="py-16 flex flex-col items-center justify-center text-center">
                                    <Inbox className="h-8 w-8 text-muted-foreground/20 mb-2" />
                                    <h3 className="font-semibold text-sm text-muted-foreground">Antrean Kosong</h3>
                                    <p className="text-[11px] text-muted-foreground/70 mt-1">Belum ada pendaftar baru saat ini.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Mobile card view */}
                                    <div className="sm:hidden divide-y divide-border">
                                        {filteredUsers.map((user) => (
                                            <div key={user.id} className="p-4 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="font-bold text-sm text-primary">{user.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate">{user.name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{user.nrp}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" asChild className="h-8 text-xs flex-1">
                                                        <a href={`/storage/${user.ktm_image_path}`} target="_blank" rel="noreferrer">
                                                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Lihat KTM
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="outline" size="sm"
                                                        onClick={() => handleReject(user.id)}
                                                        className="h-8 w-8 p-0 shrink-0 text-rose-600 border-rose-200 hover:bg-rose-50"
                                                        title="Tolak"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(user.id)}
                                                        className="h-8 w-8 p-0 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        title="Terima"
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop table view */}
                                    <div className="hidden sm:block overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                    <TableHead className="w-[45%] h-9 py-0 pl-4 text-[11px] font-semibold">Identitas Pendaftar</TableHead>
                                                    <TableHead className="h-9 py-0 text-[11px] font-semibold">Dokumen KTM</TableHead>
                                                    <TableHead className="text-right h-9 py-0 pr-4 text-[11px] font-semibold">Tindakan</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map((user) => (
                                                    <TableRow key={user.id} className="hover:bg-muted/20">
                                                        <TableCell className="py-3 pl-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                                    <span className="font-bold text-xs text-primary">{user.name.charAt(0).toUpperCase()}</span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-xs">{user.name}</p>
                                                                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{user.nrp}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3">
                                                            <Button variant="outline" size="sm" asChild className="h-7 text-[10px]">
                                                                <a href={`/storage/${user.ktm_image_path}`} target="_blank" rel="noreferrer">
                                                                    <ExternalLink className="h-3 w-3 mr-1.5" /> Buka Lampiran
                                                                </a>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell className="text-right py-3 pr-4">
                                                            <div className="flex justify-end gap-1.5">
                                                                <Button
                                                                    variant="outline" size="sm"
                                                                    onClick={() => handleReject(user.id)}
                                                                    className="h-7 w-7 p-0 text-rose-600 border-rose-200 hover:bg-rose-50"
                                                                    title="Tolak"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleApprove(user.id)}
                                                                    className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                    title="Terima"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}