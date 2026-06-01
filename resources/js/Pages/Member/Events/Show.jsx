import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { motion } from 'framer-motion';
import {
    CalendarDays,
    MapPin,
    ListTree,
    Clock,
    ArrowRight,
    ArrowLeft,
    Info,
    AlignLeft
} from 'lucide-react';

export default function EventShow({ auth, event }) {
    const isPast = new Date(event.event_date) < new Date(new Date().setHours(0,0,0,0));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted transition-colors">
                        <Link href={route('dashboard')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="font-semibold text-sm text-foreground">
                        Detail Event
                    </h2>
                </div>
            }
        >
            <Head title={`Detail ${event.title} — PensMate`} />

            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                
                {/* Event Header Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className={`overflow-hidden border border-border/60 shadow-lg ${isPast ? 'bg-muted/30' : 'bg-background/50 backdrop-blur-sm shadow-primary/5'}`}>
                        <div className={`h-2 w-full ${isPast ? 'bg-muted-foreground' : 'bg-gradient-to-r from-primary via-indigo-500 to-purple-500'}`} />
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-3">
                                <div className={`flex items-center gap-2 text-xs font-bold w-max px-3 py-1.5 rounded-lg ${isPast ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                                    <CalendarDays className="h-4 w-4 shrink-0" />
                                    {new Date(event.event_date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                                    {event.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-1.5 bg-background border border-border/50 px-3 py-1.5 rounded-lg shadow-sm">
                                        <Clock className="h-4 w-4 shrink-0 text-amber-500" />
                                        <span>{event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)} WIB</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-background border border-border/50 px-3 py-1.5 rounded-lg shadow-sm">
                                        <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {event.description && (
                                <div className="pt-6 border-t border-border/50">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
                                        <AlignLeft className="h-3.5 w-3.5" /> Deskripsi Acara
                                    </p>
                                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                        {event.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Rundown Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    <Card className="border border-border/60 shadow-sm bg-background/50 backdrop-blur-sm">
                        <CardHeader className="px-6 py-5 border-b border-border/50 bg-muted/20">
                            <CardTitle className="text-base font-black text-foreground flex items-center gap-2">
                                <ListTree className="h-5 w-5 text-primary" /> Susunan Acara (Rundown)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            {event.rundowns.length > 0 ? (
                                <div className="relative space-y-0 pl-2 sm:pl-4 max-w-2xl mx-auto">
                                    <div className="absolute left-[13px] sm:left-[21px] top-4 bottom-4 w-0.5 bg-border rounded-full" />
                                    {event.rundowns.map((rundown, rIdx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.2 + (rIdx * 0.1) }}
                                            key={rundown.id} 
                                            className="relative flex gap-6 sm:gap-8 items-start py-4 group"
                                        >
                                            <div className="mt-1 h-5 w-5 rounded-full border-4 border-background bg-primary/40 group-hover:bg-primary z-10 shrink-0 transition-colors shadow-sm" />
                                            <div className="flex-1 min-w-0 bg-background border border-border/60 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-base font-bold text-foreground leading-snug">{rundown.activity}</p>
                                                        {rundown.pic && (
                                                            <div className="inline-flex items-center gap-1.5 mt-2.5 bg-muted/50 px-2 py-1 rounded-md">
                                                                <Info className="h-3 w-3 text-muted-foreground" />
                                                                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">PIC: {rundown.pic}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
                                                        <span className="text-sm font-black text-primary">
                                                            {rundown.time_start.substring(0, 5)}
                                                        </span>
                                                        <ArrowRight className="h-3.5 w-3.5 text-primary/50" />
                                                        <span className="text-sm font-black text-primary/70">
                                                            {rundown.time_end.substring(0, 5)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-muted/30 rounded-xl border border-dashed border-border/50">
                                    <ListTree className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-sm font-semibold text-foreground">Rundown Belum Tersedia</p>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                                        Detail sesi acara untuk event ini belum dipublikasikan oleh Admin.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
