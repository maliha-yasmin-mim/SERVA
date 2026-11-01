import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click demo login buttons for instant seamless testing
  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F9F8] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#17211F] font-display">
            Sign In to SERVA
          </h1>
          <p className="text-xs text-[#64716D]">
            Access your dashboard, manage jobs, services, and ProofBox records
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rahim@serva.com.bd"
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
            <LogIn className="w-4 h-4 mr-1" />
            Sign In
          </Button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-[#E6F4F2]/50 border border-[#0F766E]/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Development Demo Accounts (1-Click Fill)</span>
          </div>
          <p className="text-[11px] text-[#64716D]">
            Click any role to pre-fill test credentials:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@serva.com.bd')}
              className="text-[11px] font-semibold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('nasreen@serva.com.bd')}
              className="text-[11px] font-semibold bg-teal-100 text-[#0F766E] px-2.5 py-1 rounded-lg hover:bg-teal-200 transition-colors"
            >
              Nasreen (Cleaner)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('tariq@serva.com.bd')}
              className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg hover:bg-amber-200 transition-colors"
            >
              Tariq (Electrician)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('rahim@serva.com.bd')}
              className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Rahim (Client)
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#64716D]">
          Don't have an account yet?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-[#0F766E] font-bold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
