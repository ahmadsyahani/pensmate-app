import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <Card className="border-border/50 shadow-2xl bg-card/90 backdrop-blur-sm border-t-4 border-t-primary w-full max-w-md mx-auto">
                <CardHeader className="space-y-2 pb-6 text-center">
                    <CardTitle className="text-2xl font-extrabold tracking-tight">Konfirmasi Keamanan</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Area ini aman. Silakan konfirmasi password Anda sebelum melanjutkan ke proses berikutnya.
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full transition-all focus-visible:ring-primary"
                                isFocused={true}
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                className="w-full h-11 text-base font-bold transition-all shadow-md hover:shadow-lg" 
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Konfirmasi'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
