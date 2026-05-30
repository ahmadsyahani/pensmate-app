import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { UserCog } from 'lucide-react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-muted-foreground" />
                    <h2 className="font-semibold text-xl text-foreground tracking-tight">Pengaturan Profil</h2>
                </div>
            }
        >
            <Head title="Pengaturan Profil" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Form Update Info */}
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    user={auth.user}
                />

                {/* Form Update Password */}
                <UpdatePasswordForm />

                {/* Form Delete Account */}
                <DeleteUserForm />
            </div>
        </AuthenticatedLayout>
    );
}