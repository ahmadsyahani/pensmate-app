import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Card className="border-border/50 shadow-2xl bg-card/90 backdrop-blur-sm border-t-4 border-t-primary w-full max-w-md mx-auto">
                <CardHeader className="space-y-2 pb-6 text-center">
                    <CardTitle className="text-2xl font-extrabold tracking-tight">Lupa Password?</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Tidak masalah. Beritahu kami alamat email Anda dan kami akan mengirimkan tautan reset password.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {status && (
                        <div className="mb-6 font-medium text-sm text-green-600 bg-green-50/50 p-4 rounded-lg border border-green-200 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full transition-all focus-visible:ring-primary text-center"
                                isFocused={true}
                                placeholder="nama@student.pens.ac.id"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="text-center" />
                        </div>

                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                className="w-full h-11 text-base font-bold transition-all shadow-md hover:shadow-lg" 
                                disabled={processing}
                            >
                                {processing ? 'Mengirim...' : 'Kirim Tautan Reset'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
