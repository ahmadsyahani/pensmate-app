import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Separator } from '@/Components/ui/separator';
import {
    Check,
    X,
    ExternalLink,
    Inbox,
    Users,
    UserCheck,
    Clock,
    Search,
    AlertCircle
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

function StatCard({ icon: Icon, iconClass, label, value }) {
    return (
        <motion.div variants={fadeUp}>
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                        <p className="text-xl font-bold text-foreground leading-none mt-1">{value}</p>
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
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <h2 className="font-semibold text-sm text-foreground">Validasi Member</h2>
                    </div>
                    <Badge variant="secondary" className="h-6 text-[10px] font-semibold uppercase tracking-wider">
                        {auth.user.role}
                    </Badge>
                </div>
            }
        >
            <Head title="Validasi Member" />

            <div className="max-w-6xl mx-auto space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mb-2"
                >
                    <h3 className="text-lg font-bold tracking-tight">Validasi Pendaftar</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Tinjau dan verifikasi identitas mahasiswa baru.</p>
                </motion.div>

                <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard icon={Clock} iconClass="bg-amber-50 text-amber-600" label="Menunggu" value={pendingUsers.length} />
                        <StatCard icon={Users} iconClass="bg-emerald-50 text-emerald-600" label="Disetujui" value="--" />
                        <motion.div variants={fadeUp}>
                            <Card className="shadow-sm bg-muted/10 h-full border-dashed border-2">
                                <CardContent className="p-4 flex items-center gap-3 h-full">
                                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="text-[11px] font-bold text-foreground">Perhatian</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">Pastikan KTM jelas sebelum menyetujui.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Table Area */}
                    <motion.div variants={fadeUp}>
                        <Card className="shadow-sm">
                            {/* Toolbar */}
                            <div className="p-3 border-b border-border bg-muted/5 flex flex-col sm:flex-row gap-3 justify-between items-center">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama atau NRP..."
                                        className="h-8 w-full pl-8 text-xs bg-white shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="text-[11px] text-muted-foreground font-medium">
                                    Total antrean: <span className="font-bold text-foreground">{pendingUsers.length}</span>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <CardContent className="p-0">
                                {filteredUsers.length === 0 ? (
                                    <div className="py-16 flex flex-col items-center justify-center text-center">
                                        <Inbox className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                        <h3 className="font-semibold text-sm text-muted-foreground">Antrean Kosong</h3>
                                        <p className="text-[11px] text-muted-foreground mt-1">Belum ada pendaftar baru saat ini.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/10 hover:bg-muted/10">
                                                    <TableHead className="w-[40%] h-10 py-0 pl-4 text-[11px] font-semibold">Identitas Pendaftar</TableHead>
                                                    <TableHead className="h-10 py-0 text-[11px] font-semibold">Dokumen KTM</TableHead>
                                                    <TableHead className="text-right h-10 py-0 pr-4 text-[11px] font-semibold">Tindakan</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map((user) => (
                                                    <TableRow key={user.id} className="hover:bg-muted/30">
                                                        <TableCell className="py-2.5 pl-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                                    <span className="font-bold text-xs text-foreground">{user.name.charAt(0).toUpperCase()}</span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-xs">{user.name}</p>
                                                                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{user.nrp}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-2.5">
                                                            <Button variant="outline" size="sm" asChild className="h-7 text-[10px] font-medium shadow-none">
                                                                <a href={`/storage/${user.ktm_image_path}`} target="_blank" rel="noreferrer">
                                                                    <ExternalLink className="h-3 w-3 mr-1.5" /> Buka Lampiran
                                                                </a>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell className="text-right py-2.5 pr-4">
                                                            <div className="flex justify-end gap-1.5">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleReject(user.id)}
                                                                    className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-none"
                                                                    title="Tolak"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleApprove(user.id)}
                                                                    className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-none"
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
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}