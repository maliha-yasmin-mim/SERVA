import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import { User, Phone, MapPin, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

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

const MyProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || locations[0]);
  const [skills, setSkills] = useState((user?.skills || []).join(', '));
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const updated = await authService.updateProfile({
        name,
        phone,
        bio,
        location,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        hourlyRate: Number(hourlyRate),
        avatar
      });
      updateUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Account Settings
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          My Profile & Trade Credentials
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Keep your skills, location, and trade background up to date for smart matching
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
        {/* Avatar header */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#E3EAE7]">
          <Avatar src={avatar || user?.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-[#17211F]">{user?.name}</h3>
            <p className="text-xs text-[#64716D]">{user?.email}</p>
            <div className="mt-1">
              <VerificationBadge status={user?.verificationStatus} size="sm" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1711..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Primary Location Area
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <Input
            label="Standard Hourly Rate (BDT)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
            Personal Bio & Work Background
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Introduce yourself, your experience, and professional values..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <Input
          label="Skills & Trades (Comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. AC Servicing, Electrical Wiring, Plumbing, Carpentry"
          helperText="Used by SERVA Smart Matching to pair you with relevant high-budget jobs"
        />

        <Input
          label="Profile Photo URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="https://..."
        />

        <div className="pt-4 border-t border-[#E3EAE7] flex items-center justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={saving}>
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MyProfilePage;
