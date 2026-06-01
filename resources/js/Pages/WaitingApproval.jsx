import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Clock } from 'lucide-react';

export default function WaitingApproval({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-sm text-foreground">Menunggu Verifikasi</h2>
            }
        >
            <Head title="Menunggu Verifikasi — PensMate" />

            <div className="max-w-xl mx-auto pt-8 sm:pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="text-center space-y-6"
                >
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Clock className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground tracking-tight">
                            Akun Sedang Direview
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                            Halo <strong className="text-foreground font-semibold">{auth.user.name}</strong>, pendaftaran kamu berhasil! Admin PensMate sedang melakukan validasi terhadap foto KTM dan data kamu.
                        </p>
                    </div>

                    {/* Info box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-left">
                        <p className="font-semibold text-amber-800 text-xs mb-1">Yang perlu kamu tahu</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Proses verifikasi memakan waktu maksimal 1×24 jam. Mohon cek kembali secara berkala, atau hubungi admin jika belum ada update setelah 24 jam.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}