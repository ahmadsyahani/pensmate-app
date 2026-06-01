import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { ArrowRight, Calendar, ShieldCheck, Users } from 'lucide-react';

const FEATURES = [
    {
        icon: Calendar,
        title: 'Agenda Kegiatan',
        desc: 'Semua informasi event dan rundown acara komunitas PensMate dalam satu tempat yang terorganisir.',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: ShieldCheck,
        title: 'Member Terverifikasi',
        desc: 'Setiap anggota diverifikasi oleh admin. Komunitas yang aman, nyaman, dan terpercaya.',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        icon: Users,
        title: 'Jaringan Anggota',
        desc: 'Terhubung dengan sesama anggota komunitas PensMate dan tumbuh bersama.',
        color: 'bg-violet-50 text-violet-600',
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0 },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            <Head title="Komunitas PensMate" />

            {/* ── Navbar ──────────────────────────────────────────────── */}
            <nav className="border-b border-border">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <h1 className="text-base font-black tracking-tight text-primary">PensMate.</h1>
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Button asChild size="sm" className="h-8 text-xs font-semibold">
                                <Link href={route('dashboard')}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-medium">
                                    <Link href={route('login')}>Masuk</Link>
                                </Button>
                                <Button asChild size="sm" className="h-8 text-xs font-semibold">
                                    <Link href={route('register')}>Daftar</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {/* ── Hero ────────────────────────────────────────────── */}
                <section className="max-w-5xl mx-auto px-6 py-24 sm:py-32">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="max-w-2xl"
                    >
                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Komunitas PensMate · PENS
                        </motion.div>

                        <motion.h2
                            variants={fadeUp}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6"
                        >
                            Satu Tempat untuk<br />
                            Seluruh Kegiatan<br />
                            <span className="text-primary">Komunitas.</span>
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="text-muted-foreground text-base sm:text-lg max-w-lg leading-relaxed mb-8"
                        >
                            Platform resmi Komunitas PensMate untuk mengelola agenda, anggota, dan kegiatan bersama secara mudah dan terstruktur.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                        >
                            {auth.user ? (
                                <Button asChild size="lg" className="h-11 px-7 font-semibold">
                                    <Link href={route('dashboard')} className="inline-flex items-center gap-2">
                                        Buka Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg" className="h-11 px-7 font-semibold">
                                        <Link href={route('register')} className="inline-flex items-center gap-2">
                                            Bergabung Sekarang
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-11 px-7 font-semibold">
                                        <Link href={route('login')}>Masuk</Link>
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── Divider ─────────────────────────────────────────── */}
                <div className="border-t border-border" />

                {/* ── Features ────────────────────────────────────────── */}
                <section className="max-w-5xl mx-auto px-6 py-20">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">
                        Apa yang tersedia
                    </p>
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-80px' }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-10"
                    >
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="space-y-3"
                            >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${f.color}`}>
                                    <f.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer className="border-t border-border py-5">
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground font-medium">
                        © {new Date().getFullYear()} Komunitas PensMate
                    </p>
                    <p className="text-xs text-muted-foreground/50">
                        Laravel v{laravelVersion} · PHP v{phpVersion}
                    </p>
                </div>
            </footer>
        </div>
    );
}
