import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                {/* Heading */}
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Buat Akun</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Lengkapi data diri untuk bergabung dengan PensMate.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Nama Lengkap */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground">Nama Lengkap</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            className="h-10"
                            autoComplete="name"
                            autoFocus
                            placeholder="Masukkan nama lengkap"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                            Email Kampus
                            <span className="ml-1.5 text-xs text-muted-foreground font-normal">(@student.pens.ac.id)</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="h-10"
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
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="nrp" className="text-sm font-semibold text-foreground">NRP</Label>
                            <Input
                                id="nrp"
                                name="nrp"
                                value={data.nrp}
                                className="h-10"
                                autoComplete="nrp"
                                placeholder="NRP kamu"
                                onChange={(e) => setData('nrp', e.target.value)}
                                required
                            />
                            <InputError message={errors.nrp} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="h-10"
                                autoComplete="new-password"
                                placeholder="Min. 8 karakter"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} />
                        </div>
                    </div>

                    {/* Upload KTM */}
                    <div className="space-y-1.5">
                        <Label htmlFor="ktm" className="text-sm font-semibold text-foreground">
                            Foto KTM
                            <span className="ml-1.5 text-xs text-muted-foreground font-normal">(Maks. 2MB · JPG/PNG)</span>
                        </Label>
                        <div className="border border-dashed border-border rounded-lg px-4 py-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                            <input
                                id="ktm"
                                type="file"
                                name="ktm"
                                capture="environment"
                                accept="image/jpeg, image/png, image/jpg"
                                className="block w-full text-sm text-muted-foreground cursor-pointer
                                    file:mr-3 file:py-1.5 file:px-3
                                    file:rounded-md file:border file:border-border
                                    file:text-xs file:font-semibold file:text-foreground
                                    file:bg-background hover:file:bg-muted
                                    file:cursor-pointer file:transition-colors"
                                onChange={(e) => setData('ktm', e.target.files[0])}
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Pastikan foto KTM jelas agar proses verifikasi cepat.
                            </p>
                        </div>
                        <InputError message={errors.ktm} />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-10 font-semibold text-sm mt-2"
                        disabled={processing}
                    >
                        {processing ? 'Mendaftarkan...' : 'Daftar PensMate'}
                    </Button>
                </form>

                {/* Login Link */}
                <p className="text-sm text-muted-foreground text-center mt-6">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="font-semibold text-foreground hover:underline">
                        Masuk di sini
                    </Link>
                </p>
            </motion.div>
        </GuestLayout>
    );
}