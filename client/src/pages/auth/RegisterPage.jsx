import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Mail, Lock, Phone, MapPin, UserPlus, AlertCircle } from 'lucide-react';

const locations = [
  'Dhaka - Dhanmondi',
  'Dhaka - Gulshan',
  'Dhaka - Banani',
  'Dhaka - Uttara',
  'Dhaka - Mirpur',
  'Dhaka - Mohammadpur',
  'Dhaka - Bashundhara R/A',
  'Chattogram - Agrabad',
  'Sylhet - Zindabazar',
  'Rajshahi - Shaheb Bazar',
  'Khulna - Sonadanga'
];

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState(locations[0]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        location,
        phone
      });
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F7F9F8] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#17211F] font-display">
            Create Your SERVA Account
          </h1>
          <p className="text-xs text-[#64716D]">
            One account to discover work, offer services, and exchange goods
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
            label="Full Name *"
            icon={User}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tanvir Ahmed"
          />

          <Input
            label="Email Address *"
            type="email"
            icon={Mail}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tanvir@example.com"
          />

          <Input
            label="Password (min 6 characters) *"
            type="password"
            icon={Lock}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#17211F] uppercase tracking-wider">
              Primary Location Area *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64716D]">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-[#E3EAE7] pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white text-[#17211F] focus:outline-none focus:border-[#0F766E]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Phone Number (Optional)"
            type="tel"
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1711..."
          />

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
            <UserPlus className="w-4 h-4 mr-1" />
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-[#64716D]">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-[#0F766E] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
