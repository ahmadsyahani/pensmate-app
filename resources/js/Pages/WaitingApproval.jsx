import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Clock } from 'lucide-react';

export default function WaitingApproval({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Menunggu Verifikasi</h2>}
        >
            <Head title="Waiting Approval" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card className="border-border/50 shadow-xl bg-card/90 backdrop-blur-sm border-t-4 border-t-amber-500 overflow-hidden">
                        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                            <div className="bg-amber-100 text-amber-600 p-5 rounded-full mb-8 shadow-inner shadow-amber-200/50 relative">
                                <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping" />
                                <Clock className="w-12 h-12 relative z-10" strokeWidth={1.5} />
                            </div>
                            
                            <h3 className="text-3xl font-extrabold tracking-tight mb-4 text-foreground">Akun Sedang Direview</h3>
                            
                            <div className="space-y-4 max-w-lg text-muted-foreground leading-relaxed text-base">
                                <p>
                                    Halo <strong className="text-foreground">{auth.user.name}</strong>, pendaftaran kamu berhasil! Saat ini admin PensMate sedang melakukan validasi terhadap foto KTM dan data kamu.
                                </p>
                                <p className="font-medium bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200 text-sm">
                                    Proses ini memakan waktu maksimal 1x24 jam. Mohon cek kembali secara berkala ya.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}