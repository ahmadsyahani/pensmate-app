import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nrp: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk — PensMate" />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                {/* Heading */}
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Masuk</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Masukkan NRP dan password untuk melanjutkan.
                    </p>
                </div>

                {status && (
                    <div className="mb-6 text-sm font-medium text-foreground bg-muted border border-border rounded-lg px-4 py-3">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* NRP */}
                    <div className="space-y-1.5">
                        <Label htmlFor="nrp" className="text-sm font-semibold text-foreground">
                            NRP Mahasiswa
                        </Label>
                        <Input
                            id="nrp"
                            type="text"
                            name="nrp"
                            value={data.nrp}
                            className="h-10"
                            autoComplete="nrp"
                            autoFocus
                            placeholder="Contoh: 3124600000"
                            onChange={(e) => setData('nrp', e.target.value)}
                        />
                        <InputError message={errors.nrp} />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                                Password
                            </Label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="h-10"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked)}
                        />
                        <Label htmlFor="remember" className="text-sm font-medium cursor-pointer select-none text-muted-foreground">
                            Ingat saya
                        </Label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-10 font-semibold text-sm"
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </Button>
                </form>

                {/* Register Link */}
                <p className="text-sm text-muted-foreground text-center mt-6">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="font-semibold text-foreground hover:underline">
                        Daftar sekarang
                    </Link>
                </p>
            </motion.div>
        </GuestLayout>
    );
}