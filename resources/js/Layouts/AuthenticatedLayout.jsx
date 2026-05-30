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

    // Komponen Reusable untuk Link Navigasi biar kodenya nggak kepanjangan
    const NavLink = ({ href, active, icon: Icon, children }) => (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-bold ${
                active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    );

    return (
        <div className="min-h-screen bg-muted/20 font-sans flex">
            
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 flex-col bg-background border-r border-border h-screen fixed z-20">
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <h1 className="text-2xl font-extrabold tracking-tight text-primary">PensMate.</h1>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                    <div className="space-y-1">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')} icon={LayoutDashboard}>
                            Dashboard
                        </NavLink>
                    </div>

                    {/* Menu Khusus Member */}
                    {!isAdmin && (
                        <div className="space-y-1">
                            <h4 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-4">
                                Fitur Member
                            </h4>
                            <NavLink href={route('kehadiran.index')} active={route().current('kehadiran.*')} icon={QrCode}>
                                Kehadiran
                            </NavLink>
                            <NavLink href={route('pensmates.index')} active={route().current('pensmates.index')} icon={Users}>
                                PensMates
                            </NavLink>
                        </div>
                    )}

                    {/* Menu Khusus Admin */}
                    {isAdmin && (
                        <div className="space-y-1">
                            <h4 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-4">
                                Manajemen
                            </h4>
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

                {/* User Profile (Bottom Sidebar) */}
                <div className="p-4 border-t border-border bg-muted/10">
                    {/* Area nama & NRP bisa diklik untuk masuk ke pengaturan profil */}
                    <Link 
                        href={route('profile.edit')} 
                        className="flex items-center gap-3 px-2 py-2 mb-3 rounded-lg hover:bg-muted/80 transition-colors group/profile w-full text-left"
                    >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover/profile:bg-primary/20 transition-colors">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate text-foreground group-hover/profile:text-primary transition-colors">{user.name}</span>
                            <span className="text-xs font-medium text-muted-foreground truncate">{user.nrp}</span>
                        </div>
                    </Link>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* Mobile Header (Muncul di layar kecil) */}
            <div className="md:hidden fixed top-0 w-full bg-background border-b border-border z-30 px-4 h-16 flex justify-between items-center">
                <h1 className="text-xl font-extrabold text-primary">PensMate.</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                    className="text-muted-foreground"
                >
                    {showingNavigationDropdown ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {showingNavigationDropdown && (
                <div className="md:hidden fixed top-16 left-0 w-full bg-background border-b border-border z-20 shadow-xl p-4 space-y-4">
                    <div className="space-y-1">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')} icon={LayoutDashboard}>
                            Dashboard
                        </NavLink>
                        {!isAdmin && (
                            <>
                                <div className="pt-4 pb-2">
                                    <h4 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Fitur Member</h4>
                                </div>
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
                                <div className="pt-4 pb-2">
                                    <h4 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Manajemen</h4>
                                </div>
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
                    
                    {/* Tambahan Menu Khusus Profil & Logout di Mobile */}
                    <div className="pt-4 border-t border-border space-y-1">
                        <NavLink href={route('profile.edit')} active={route().current('profile.edit')} icon={User}>
                            Pengaturan Profil
                        </NavLink>
                        
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-left"
                        >
                            <LogOut className="h-5 w-5" />
                            Log Keluar
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen flex flex-col">
                {/* Header Dinamis */}
                {header && (
                    <header className="bg-background border-b border-border sticky top-0 z-10 px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                        {header}
                    </header>
                )}
                
                {/* Area Konten */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}