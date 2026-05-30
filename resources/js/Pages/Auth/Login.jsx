import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Separator } from '@/Components/ui/separator';
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-md mx-auto"
            >
                <Card className="shadow-lg border-border">
                    <CardHeader className="px-8 pt-8 pb-0 space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Masuk ke Akun</CardTitle>
                        <CardDescription>
                            Masukkan NRP dan password kamu untuk melanjutkan.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 py-8">
                        {status && (
                            <div className="mb-6 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* NRP */}
                            <div className="space-y-2">
                                <Label htmlFor="nrp" className="text-sm font-semibold">NRP Mahasiswa</Label>
                                <Input
                                    id="nrp"
                                    type="text"
                                    name="nrp"
                                    value={data.nrp}
                                    className="h-11"
                                    autoComplete="nrp"
                                    autoFocus
                                    placeholder="Contoh: 3124600000"
                                    onChange={(e) => setData('nrp', e.target.value)}
                                />
                                <InputError message={errors.nrp} />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs font-semibold text-primary hover:underline"
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
                                    className="h-11"
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
                                <Label htmlFor="remember" className="text-sm font-medium cursor-pointer select-none">
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full h-11 font-bold text-sm"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                    </CardContent>

                    <Separator />

                    <CardFooter className="px-8 py-5 justify-center">
                        <p className="text-sm text-muted-foreground">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="font-semibold text-primary hover:underline">
                                Daftar sekarang
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </GuestLayout>
    );
}