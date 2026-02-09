import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Truck, ShieldCheck, LogOut, Pill, Lock, Menu, X, Sun, Moon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { path: '/dashboard/tracking', label: 'Tracking', icon: Truck },
  { path: '/dashboard/authentication', label: 'Authentication', icon: ShieldCheck },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();

  const handleLogout = () => {
    setShowLogout(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Med</span>
              <span className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Secure</span>
              <Lock className="h-3.5 w-3.5 text-primary" />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full gradient-primary animate-fade-scale" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogout(true)}
              className="hidden text-muted-foreground hover:text-destructive md:flex"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>

            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card p-4 md:hidden animate-slide-up">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { setShowLogout(true); setMobileMenuOpen(false); }}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-slide-up">
        {children}
      </main>

      {/* Logout Modal */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from MedSecure?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowLogout(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
