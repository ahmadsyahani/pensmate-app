import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { ArrowRight, Calendar, ShieldCheck, Users } from 'lucide-react';

const FEATURES = [
    {
        icon: Calendar,
        title: 'Agenda Kegiatan',
        desc: 'Semua informasi event dan rundown acara komunitas PensMate dalam satu tempat yang terorganisir.',
    },
    {
        icon: ShieldCheck,
        title: 'Member Terverifikasi',
        desc: 'Setiap anggota diverifikasi oleh admin. Komunitas yang aman, nyaman, dan terpercaya.',
    },
    {
        icon: Users,
        title: 'Jaringan Anggota',
        desc: 'Terhubung dengan sesama anggota komunitas PensMate dan tumbuh bersama.',
    },
];

// Variant reusable: fade up
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0 },
};

// Stagger container
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            <Head title="Komunitas PensMate" />


            <main className="flex-1">
                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 py-24 text-center">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.p
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="text-sm font-bold text-primary uppercase tracking-widest"
                        >
                            Komunitas PensMate
                        </motion.p>

                        <motion.h2
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
                        >
                            Satu Tempat untuk<br />
                            <span className="text-primary">Seluruh Kegiatan Komunitas</span>
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="text-muted-foreground text-lg max-w-xl leading-relaxed"
                        >
                            Platform resmi Komunitas PensMate untuk mengelola agenda, anggota, dan kegiatan bersama secara mudah dan terstruktur.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
                        >
                            {auth.user ? (
                                <Button asChild size="lg" className="h-12 px-8 font-bold text-base">
                                    <Link href={route('dashboard')} className="inline-flex items-center gap-2">
                                        Buka Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg" className="h-12 px-8 font-bold text-base">
                                        <Link href={route('register')} className="inline-flex items-center gap-2">
                                            Bergabung Sekarang
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-12 px-8 font-bold text-base">
                                        <Link href={route('login')}>Masuk</Link>
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </section>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Features */}
                <section className="max-w-5xl mx-auto px-6 py-20">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-80px' }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow h-full">
                                    <CardContent className="p-7 space-y-4">
                                        <motion.div
                                            whileHover={{ scale: 1.12, rotate: 4 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                            className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center"
                                        >
                                            <f.icon className="h-5 w-5 text-primary" />
                                        </motion.div>
                                        <h3 className="text-base font-bold">{f.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-t border-border py-6"
            >
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-muted-foreground">
                        &copy; {new Date().getFullYear()} Komunitas PensMate
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                        Laravel v{laravelVersion} &bull; PHP v{phpVersion}
                    </p>
                </div>
            </motion.footer>
        </div>
    );
}
