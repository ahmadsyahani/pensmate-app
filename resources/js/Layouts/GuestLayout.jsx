import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 sm:p-8">
            {/* Logo atas */}
            <div className="mb-8 text-center">
                <Link href="/">
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary">PensMate.</h1>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Komunitas PensMate</p>
                </Link>
            </div>

            {/* Konten (Card Form) */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}