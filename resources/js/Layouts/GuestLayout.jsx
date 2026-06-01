export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-background flex font-sans">
            {/* ── Left Panel — Branding ────────────────────────────────── */}
            <div className="hidden lg:flex w-[42%] bg-primary flex-col justify-between p-12 shrink-0">
                <div>
                    <h1 className="text-xl font-black text-primary-foreground tracking-tight">PensMate.</h1>
                </div>
                <div className="space-y-5">
                    <p className="text-3xl font-black text-primary-foreground leading-snug">
                        Platform resmi<br />Komunitas PENS<br />Mahasiswa.
                    </p>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
                        Kelola agenda kegiatan, absensi digital, dan jaringan anggota komunitas dalam satu platform terstruktur.
                    </p>
                </div>
                <p className="text-primary-foreground/30 text-xs">
                    © {new Date().getFullYear()} Komunitas PensMate
                </p>
            </div>

            {/* ── Right Panel — Form ───────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-[400px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8">
                        <h1 className="text-xl font-black text-primary tracking-tight">PensMate.</h1>
                        <p className="text-xs text-muted-foreground mt-1">Platform Komunitas PENS Mahasiswa</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}