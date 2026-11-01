import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeSettings } from '../../context/ThemeSettingsContext';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Modal from '../common/Modal';
import {
  Briefcase,
  Wrench,
  ShoppingBag,
  Gift,
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  ShieldCheck,
  Clock,
  LogOut,
  CreditCard,
  Sparkles,
  MapPin,
  Heart,
  Sliders
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { settings } = useThemeSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const siteName = settings?.general?.siteName || 'SERVA';
  const tagline = settings?.general?.tagline || 'Local Help. Trusted Connections.';
  const logoUrl = settings?.general?.logoUrl;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Find Work', path: '/jobs' },
    { name: 'Find Services', path: '/services' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Free Stuff', path: '/free-stuff' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  const handlePostOption = (destination) => {
    setPostModalOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=' + destination);
    } else {
      navigate(destination);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      setSearchModalOpen(false);
      navigate(`/jobs?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchKeyword('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E3EAE7] transition-all">
        {/* Top Micro Bar for trust & region */}
        <div className="bg-[#134E4A] text-white text-[11px] py-1 px-4 sm:px-8 hidden sm:flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 text-teal-100">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C7F36B] animate-pulse" />
            <span>SERVA Bangladesh — Verified Local Micro-Work, Services & Community Exchange</span>
          </div>
          <div className="flex items-center gap-4 text-teal-200">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C7F36B]" /> SERVA ProofBox™ Guarantee
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[#C7F36B] font-semibold flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> Online Payment: bKash • Nagad • Cards
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-10 w-auto max-w-[140px] object-contain rounded-xl"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#134E4A] flex items-center justify-center text-white shadow-soft group-hover:shadow-glow-teal transition-all group-hover:scale-105">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#17211F] font-display flex items-center gap-1.5">
                {siteName}
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#C7F36B] text-[#134E4A] px-1.5 py-0.5 rounded shadow-xs">
                  BD
                </span>
              </span>
              <span className="text-[10px] text-[#64716D] -mt-1 hidden sm:inline font-medium truncate max-w-[200px]">
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-[#0F766E] bg-[#E6F4F2] font-bold shadow-xs'
                      : 'text-[#17211F] hover:text-[#0F766E] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-xl text-[#64716D] hover:text-[#0F766E] hover:bg-[#E6F4F2] transition-colors"
              title="Search opportunities"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favourites Shortcut Icon */}
            <Link
              to="/dashboard/favourites"
              className="p-2 rounded-xl text-[#64716D] hover:text-red-500 hover:bg-red-50 transition-colors relative"
              title="My Favourites"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Post Something Button (Lime Highlight) */}
            <Button
              variant="lime"
              size="sm"
              onClick={() => setPostModalOpen(true)}
              className="hidden sm:inline-flex shadow-sm hover:shadow-glow-lime font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              Post Something
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                {/* Notifications Bell */}
                <Link
                  to="/dashboard/notifications"
                  className="p-2 rounded-xl text-[#64716D] hover:text-[#0F766E] hover:bg-[#E6F4F2] transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0F766E] animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0F766E]" />
                </Link>

                {/* User Dropdown Trigger */}
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-[#E3EAE7] hover:border-[#CBD5D1] transition-all bg-white shadow-xs"
                >
                  <Avatar src={user?.avatar} size="sm" isOnline={user?.isAvailableNow} />
                  <span className="text-xs font-bold text-[#17211F] hidden lg:inline max-w-[90px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64716D]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-premium border border-[#E3EAE7] py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-[#E3EAE7]">
                      <p className="text-xs font-bold text-[#17211F] truncate">{user?.name}</p>
                      <p className="text-[11px] text-[#64716D] truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold text-[#0F766E] bg-[#E6F4F2] px-2 py-0.5 rounded">
                        {user?.verificationStatus || 'Member'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-teal-600" />
                        Dashboard Overview
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                      >
                        <User className="w-4 h-4 text-teal-600" />
                        My Profile
                      </Link>

                      <Link
                        to="/dashboard/favourites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        My Favourites
                      </Link>

                      <Link
                        to="/dashboard/payments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                      >
                        <CreditCard className="w-4 h-4 text-[#0F766E]" />
                        Payment & Escrow History
                      </Link>

                      <Link
                        to="/dashboard/proofbox"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                        SERVA ProofBox™
                      </Link>

                      <Link
                        to="/dashboard/verification"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Identity Verification
                      </Link>

                      <Link
                        to="/dashboard/availability"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                      >
                        <Clock className="w-4 h-4 text-gray-500" />
                        Availability Settings
                      </Link>

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Console
                          </Link>
                          <Link
                            to="/admin/customization"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100"
                          >
                            <Sliders className="w-4 h-4" />
                            Website Customization
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-[#E3EAE7] pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="text-xs">
                    Join SERVA
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden rounded-xl p-2 text-[#17211F] hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E3EAE7] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#17211F] hover:bg-[#E6F4F2] hover:text-[#0F766E]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Button
              variant="lime"
              size="md"
              className="w-full font-bold"
              onClick={() => {
                setMobileMenuOpen(false);
                setPostModalOpen(true);
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Post Something
            </Button>

            {!isAuthenticated && (
              <div className="flex gap-2 border-t border-[#E3EAE7] pt-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button variant="ghost" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button variant="primary" size="md" className="w-full">
                    Join SERVA
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Search on SERVA"
        subtitle="Search jobs, verified services, or marketplace items across Bangladesh"
      >
        <form onSubmit={handleSearchSubmit} className="space-y-4 pt-2">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              autoFocus
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="e.g. Electrician, AC repair, Apartment cleaning, Furniture..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:ring-2 focus:ring-[#0F766E] text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="font-semibold text-gray-400">Popular:</span>
            {['Plumber Dhaka', 'Deep Cleaning', 'Electrician', 'Used Laptop', 'Free Furniture'].map(
              (term) => (
                <button
                  type="button"
                  key={term}
                  onClick={() => {
                    setSearchModalOpen(false);
                    navigate(`/jobs?keyword=${encodeURIComponent(term)}`);
                  }}
                  className="bg-gray-100 hover:bg-[#E6F4F2] hover:text-[#0F766E] px-2.5 py-1 rounded-lg transition-colors"
                >
                  {term}
                </button>
              )
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setSearchModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="lime" size="sm" type="submit">
              Search Opportunities
            </Button>
          </div>
        </form>
      </Modal>

      {/* Post Something Modal (4 Clear Choices) */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="What would you like to post?"
        subtitle="Choose from the 4 categories below to get started on SERVA Bangladesh"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {/* Choice 1: Post a Job */}
          <button
            onClick={() => handlePostOption('/dashboard/create-job')}
            className="flex flex-col items-start p-4 rounded-2xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group hover:shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Post a Job
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              Hire local help for cleaning, plumbing, moving, repairs, tutoring, or event assistance.
            </p>
          </button>

          {/* Choice 2: Offer a Service */}
          <button
            onClick={() => handlePostOption('/dashboard/create-service')}
            className="flex flex-col items-start p-4 rounded-2xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group hover:shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Offer a Service
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              Advertise your verified skills, create tiered packages, and receive direct client orders.
            </p>
          </button>

          {/* Choice 3: Sell an Item */}
          <button
            onClick={() => handlePostOption('/dashboard/create-product')}
            className="flex flex-col items-start p-4 rounded-2xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group hover:shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Sell an Item
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              List second-hand electronics, tools, furniture, bicycles, or books in your neighborhood.
            </p>
          </button>

          {/* Choice 4: Give Away an Item */}
          <button
            onClick={() => handlePostOption('/dashboard/create-free-item')}
            className="flex flex-col items-start p-4 rounded-2xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group hover:shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Give Away for Free
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              Pass on useful study books, spare appliances, or furniture to community members at zero cost.
            </p>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
