import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import InputError from '@/Components/InputError';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        nrp: '',
        password: '',
        ktm: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar — PensMate" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-lg mx-auto"
            >
                <Card className="shadow-lg border-border">
                    <CardHeader className="px-8 pt-8 pb-0 space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun Baru</CardTitle>
                        <CardDescription>
                            Lengkapi data diri kamu untuk bergabung dengan komunitas PensMate.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 py-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Nama Lengkap */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="h-11"
                                    autoComplete="name"
                                    autoFocus
                                    placeholder="Masukkan nama lengkap"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold">
                                    Email Kampus
                                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">(@student.pens.ac.id)</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="h-11"
                                    autoComplete="username"
                                    pattern=".*@.*student\.pens\.ac\.id$"
                                    title="Gunakan email kampus yang valid"
                                    placeholder="nama@student.pens.ac.id"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* NRP & Password — 2 kolom */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="nrp" className="text-sm font-semibold">NRP</Label>
                                    <Input
                                        id="nrp"
                                        name="nrp"
                                        value={data.nrp}
                                        className="h-11"
                                        autoComplete="nrp"
                                        placeholder="NRP kamu"
                                        onChange={(e) => setData('nrp', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nrp} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="h-11"
                                        autoComplete="new-password"
                                        placeholder="Min. 8 karakter"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>
                            </div>

                            {/* Upload KTM */}
                            <div className="space-y-2">
                                <Label htmlFor="ktm" className="text-sm font-semibold">
                                    Foto KTM
                                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">(Maks. 2MB · JPG/PNG)</span>
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg px-4 py-5 bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <input
                                        id="ktm"
                                        type="file"
                                        name="ktm"
                                        capture="environment"
                                        accept="image/jpeg, image/png, image/jpg"
                                        className="block w-full text-sm text-muted-foreground cursor-pointer
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary file:text-primary-foreground
                                            hover:file:bg-primary/90
                                            file:cursor-pointer file:transition-colors"
                                        onChange={(e) => setData('ktm', e.target.files[0])}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-3">
                                        Pastikan foto KTM jelas dan terbaca agar proses verifikasi cepat.
                                    </p>
                                </div>
                                <InputError message={errors.ktm} />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full h-11 font-bold text-sm"
                                disabled={processing}
                            >
                                {processing ? 'Mendaftarkan...' : 'Daftar PensMate'}
                            </Button>
                        </form>
                    </CardContent>

                    <Separator />

                    <CardFooter className="px-8 py-5 justify-center">
                        <p className="text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="font-semibold text-primary hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </GuestLayout>
    );
}