import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeSettings } from '../../context/ThemeSettingsContext';
import {
  ShieldCheck,
  MapPin,
  Heart,
  CreditCard,
  Lock,
  Smartphone,
  CheckCircle,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';

const Footer = () => {
  const { settings } = useThemeSettings();

  const siteName = settings?.general?.siteName || 'SERVA';
  const logoUrl = settings?.general?.logoUrl;
  const footerDesc =
    settings?.content?.footer?.footerDescription ||
    settings?.general?.footerDescription ||
    'Bangladesh’s verified local micro-work, service marketplace, and community exchange platform powered by the SERVA ProofBox™ trust system.';
  const footerHeading = settings?.content?.footer?.footerHeading || 'SERVA Escrow & Verified Online Payments';
  const copyright =
    settings?.general?.copyrightText ||
    `© ${new Date().getFullYear()} ${siteName} Bangladesh. All rights reserved.`;
  const email = settings?.general?.contactEmail || 'support@serva.com.bd';
  const phone = settings?.general?.contactPhone || '+880 1700-000000';
  const address = settings?.general?.address || 'Dhaka, Bangladesh';
  const social = settings?.general?.socialLinks || {};

  return (
    <footer className="bg-[#134E4A] text-white pt-16 pb-12 border-t border-[#0F766E]/40 relative overflow-hidden">
      {/* Background glow & subtle pattern */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C7F36B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-300/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Payment & Trust Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C7F36B] text-[#134E4A] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {footerHeading}
                <span className="text-[10px] bg-[#C7F36B] text-[#134E4A] px-2 py-0.5 rounded font-black uppercase">
                  100% Protected
                </span>
              </h4>
              <p className="text-xs text-teal-200 mt-0.5">
                Pay safely via bKash, Nagad, or Cards. Funds are only released when you approve work evidence in ProofBox.
              </p>
            </div>
          </div>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-teal-300 font-medium mr-1">Supported Gateways:</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-pink-300 border border-pink-400/30">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-orange-300 border border-orange-400/30">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-purple-300 border border-purple-400/30">
              Rocket
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-blue-300 border border-blue-400/30">
              Visa / MC
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-emerald-300 border border-emerald-400/30">
              Cash on Pickup
            </span>
          </div>
        </div>

        {/* 5-Column Sitemap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-10 w-auto max-w-[140px] object-contain rounded-xl"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#C7F36B] flex items-center justify-center text-[#134E4A] font-bold group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              )}
              <span className="font-extrabold text-2xl tracking-tight text-white font-display">
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-teal-100 max-w-sm leading-relaxed">
              {footerDesc}
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-teal-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                <span>{phone}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Opportunities & Market */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#C7F36B] uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-teal-100">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Find Local Work
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Find Trusted Services
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-white transition-colors">
                  Buy & Sell Items
                </Link>
              </li>
              <li>
                <Link to="/free-stuff" className="hover:text-white transition-colors">
                  Free Stuff Community
                </Link>
              </li>
              <li>
                <Link to="/jobs?urgency=Urgent" className="hover:text-white transition-colors">
                  Urgent Micro-Tasks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & ProofBox */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#C7F36B] uppercase tracking-wider">
              Trust & Systems
            </h4>
            <ul className="space-y-2 text-sm text-teal-100">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How SERVA Works
                </Link>
              </li>
              <li>
                <Link to="/trust-verification" className="hover:text-white transition-colors">
                  Verification Standards
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#proofbox" className="hover:text-white transition-colors">
                  SERVA ProofBox™
                </Link>
              </li>
              <li>
                <Link to="/dashboard/verification" className="hover:text-white transition-colors">
                  Identity Verification
                </Link>
              </li>
              <li>
                <Link to="/dashboard/payments" className="hover:text-white transition-colors">
                  Online Payment & Escrow
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#C7F36B] uppercase tracking-wider">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-teal-100">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Compliance Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-200/80 gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-1">
            <span>Built with precision & integrity for local communities</span>
            <Heart className="w-3.5 h-3.5 text-[#C7F36B] fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
