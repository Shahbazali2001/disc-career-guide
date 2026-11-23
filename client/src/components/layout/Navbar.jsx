import { useQuery } from '@tanstack/react-query';
import { LogOut, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getHealth } from '../../api/careerApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-white/10 text-white'
      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    staleTime: 60_000,
    retry: 1,
  });

  const isGeminiLive = Boolean(health?.ok && health?.aiConfigured);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    toast.success('Signed out cleanly.');
    navigate('/');
  };

  const userInitial = (user?.name?.trim()?.[0] || 'U').toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090D16]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Live Health Pill */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2.5 focus:outline-none"
            onClick={() => setMobileOpen(false)}
          >
            <div className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-lg border border-white/15 bg-slate-900/90 p-1 shadow-inner transition-transform group-hover:scale-105">
              <span className="rounded-[2px] bg-[#F43F5E]" />
              <span className="rounded-[2px] bg-[#F59E0B]" />
              <span className="rounded-[2px] bg-[#10B981]" />
              <span className="rounded-[2px] bg-[#6366F1]" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              DISC <span className="text-indigo-400">CareerGuide</span>
            </span>
          </Link>

          <div
            title={
              isGeminiLive
                ? `Connected to ${health?.model || 'gemini-2.5-flash'}`
                : 'Running with realistic trait-based demo fallback'
            }
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:inline-flex ${
              isGeminiLive
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isGeminiLive ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span>{isGeminiLive ? 'Gemini Live' : 'Demo Mode'}</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/test" className={navLinkClass}>
                Take Test
              </NavLink>
              <NavLink to="/history" className={navLinkClass}>
                My History
              </NavLink>

              <div className="mx-2 h-5 w-px bg-white/10" />

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1.5 pr-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 text-xs font-bold text-white">
                  {userInitial}
                </span>
                <span className="max-w-[130px] truncate text-xs font-medium text-slate-200">
                  {user?.name}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Log In
              </NavLink>
              <Link
                to="/register"
                className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:brightness-110"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-300 hover:bg-white/[0.08] hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#090D16]/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="mb-3 flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                isGeminiLive
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isGeminiLive ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span>{isGeminiLive ? 'Gemini Live' : 'Demo Mode'}</span>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 font-bold text-white">
                  {userInitial}
                </span>
                <span className="max-w-[140px] truncate">{user?.name}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/test"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Take Test
                </NavLink>
                <NavLink
                  to="/history"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  My History
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Log In
                </NavLink>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
