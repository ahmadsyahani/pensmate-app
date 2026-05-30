import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import InputError from '@/Components/InputError';

export default function DeleteUserForm({ className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setIsOpen(false);
        clearErrors();
        reset();
    };

    return (
        <Card className={`border-destructive/50 shadow-sm ${className}`}>
            <CardHeader>
                <CardTitle className="text-destructive">Hapus Akun</CardTitle>
                <CardDescription>
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.
                    Sebelum menghapus akun Anda, harap unduh data atau informasi apa pun yang ingin Anda simpan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Hapus Akun</Button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Apakah Anda yakin ingin menghapus akun ini?</DialogTitle>
                            <DialogDescription>
                                Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.
                                Masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={deleteUser} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="sr-only">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kata Sandi"
                                />
                                <InputError message={errors.password} />
                            </div>
                            
                            <DialogFooter className="gap-2 sm:gap-0 pt-4">
                                <Button type="button" variant="outline" onClick={closeModal}>
                                    Batal
                                </Button>
                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Hapus Akun
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
