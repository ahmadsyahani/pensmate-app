import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Card className="border-border/50 shadow-2xl bg-card/90 backdrop-blur-sm border-t-4 border-t-primary w-full max-w-md mx-auto">
                <CardHeader className="space-y-2 pb-6 text-center">
                    <CardTitle className="text-2xl font-extrabold tracking-tight">Verifikasi Email Anda</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Terima kasih telah mendaftar! Sebelum memulai, mohon verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 font-medium text-sm text-green-600 bg-green-50/50 p-4 rounded-lg border border-green-200 text-center">
                            Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat registrasi.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Button 
                                type="submit" 
                                className="w-full sm:w-auto flex-1 h-11 text-sm font-bold transition-all shadow-sm hover:shadow-md" 
                                disabled={processing}
                            >
                                Kirim Ulang Email
                            </Button>

                            <Button 
                                asChild
                                variant="outline"
                                className="w-full sm:w-auto h-11 text-sm font-bold"
                            >
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
