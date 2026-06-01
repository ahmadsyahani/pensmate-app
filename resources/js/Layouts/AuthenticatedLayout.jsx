import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    UserCheck, 
    CalendarDays, 
    LogOut, 
    Menu, 
    X, 
    User,
    QrCode,
    Users,
    KeyRound
} from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const isAdmin = user.role === 'admin';

    const NavLink = ({ href, active, icon: Icon, children }) => (
        <Link
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
        >
            <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary' : ''}`} />
            {children}
        </Link>
    );

    return (
        <div className="min-h-screen bg-muted/20 font-sans flex">

            {/* ── Sidebar Desktop ─────────────────────────────────────── */}
            <aside className="hidden md:flex w-56 flex-col bg-background border-r border-border h-screen fixed z-20">
                {/* Logo */}
                <div className="h-14 flex items-center px-5 border-b border-border shrink-0">
                    <h1 className="text-base font-black tracking-tight text-primary">PensMate.</h1>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                    <div className="space-y-0.5">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')} icon={LayoutDashboard}>
                            Dashboard
                        </NavLink>
                    </div>

                    {!isAdmin && (
                        <div className="space-y-0.5">
                            <p className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1.5">
                                Menu
                            </p>
                            <NavLink href={route('kehadiran.index')} active={route().current('kehadiran.*')} icon={QrCode}>
                                Kehadiran
                            </NavLink>
                            <NavLink href={route('pensmates.index')} active={route().current('pensmates.index')} icon={Users}>
                                PensMates
                            </NavLink>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="space-y-0.5">
                            <p className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1.5">
                                Manajemen
                            </p>
                            <NavLink href={route('admin.approval')} active={route().current('admin.approval')} icon={UserCheck}>
                                Approval Member
                            </NavLink>
                            <NavLink href={route('admin.events.index')} active={route().current('admin.events.*')} icon={CalendarDays}>
                                Kelola Event
                            </NavLink>
                            <NavLink href={route('admin.session.index')} active={route().current('admin.session.*')} icon={KeyRound}>
                                Sesi Absensi
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* User Profile Bottom */}
                <div className="p-3 border-t border-border shrink-0">
                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-2.5 px-2 py-2 mb-1.5 rounded-md hover:bg-muted transition-colors group w-full"
                    >
                        <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-bold text-primary">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex flex-col overflow-hidden min-w-0">
                            <span className="text-xs font-semibold truncate text-foreground">{user.name}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{user.nrp}</span>
                        </div>
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* ── Mobile Header ────────────────────────────────────────── */}
            <div className="md:hidden fixed top-0 w-full bg-background border-b border-border z-30 px-4 h-14 flex justify-between items-center">
                <h1 className="text-base font-black text-primary">PensMate.</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                    className="h-8 w-8 text-muted-foreground"
                >
                    {showingNavigationDropdown ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {/* ── Mobile Dropdown ──────────────────────────────────────── */}
            {showingNavigationDropdown && (
                <div className="md:hidden fixed top-14 left-0 w-full bg-background border-b border-border z-20 shadow-lg p-3 space-y-4">
                    <div className="space-y-0.5">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')} icon={LayoutDashboard}>
                            Dashboard
                        </NavLink>
                        {!isAdmin && (
                            <>
                                <NavLink href={route('kehadiran.index')} active={route().current('kehadiran.*')} icon={QrCode}>
                                    Kehadiran
                                </NavLink>
                                <NavLink href={route('pensmates.index')} active={route().current('pensmates.index')} icon={Users}>
                                    PensMates
                                </NavLink>
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <NavLink href={route('admin.approval')} active={route().current('admin.approval')} icon={UserCheck}>
                                    Approval Member
                                </NavLink>
                                <NavLink href={route('admin.events.index')} active={route().current('admin.events.*')} icon={CalendarDays}>
                                    Kelola Event
                                </NavLink>
                                <NavLink href={route('admin.session.index')} active={route().current('admin.session.*')} icon={KeyRound}>
                                    Sesi Absensi
                                </NavLink>
                            </>
                        )}
                    </div>
                    <div className="pt-3 border-t border-border space-y-0.5">
                        <NavLink href={route('profile.edit')} active={route().current('profile.edit')} icon={User}>
                            Profil Saya
                        </NavLink>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors text-left"
                        >
                            <LogOut className="h-4 w-4" />
                            Keluar
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Main Content ─────────────────────────────────────────── */}
            <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen flex flex-col">
                {header && (
                    <header className="bg-background border-b border-border sticky top-0 z-20 px-5 sm:px-6 h-14 flex items-center">
                        {header}
                    </header>
                )}
                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}