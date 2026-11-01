import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import { Clock, Zap, CheckCircle2 } from 'lucide-react';

const AvailabilityPage = () => {
  const { user, updateUser } = useAuth();

  const [isAvailableNow, setIsAvailableNow] = useState(user?.isAvailableNow || false);
  const [weekdays, setWeekdays] = useState(user?.availabilitySchedule?.weekdays || true);
  const [weekends, setWeekends] = useState(user?.availabilitySchedule?.weekends || false);
  const [evenings, setEvenings] = useState(user?.availabilitySchedule?.evenings || false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await authService.updateAvailability({
        isAvailableNow,
        availabilitySchedule: {
          weekdays,
          weekends,
          evenings
        }
      });
      updateUser({
        ...user,
        isAvailableNow,
        availabilitySchedule: { weekdays, weekends, evenings }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Work Preferences
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Availability & Schedule
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Control when you appear in "Available Now" searches and receive job match alerts
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Availability preferences updated!</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
        {/* Available Now Toggle */}
        <div className="p-5 rounded-2xl bg-[#E6F4F2]/50 border border-[#0F766E]/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#17211F]">
                "Available Now" Instant Badge
              </h3>
              <p className="text-xs text-[#64716D]">
                Displays a green active indicator next to your profile and prioritizes you in urgent local micro-jobs.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isAvailableNow}
              onChange={(e) => setIsAvailableNow(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]" />
          </label>
        </div>

        {/* Regular Schedule Checkboxes */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-[#17211F] uppercase tracking-wider">
            Standard Working Hours
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={weekdays}
                onChange={(e) => setWeekdays(e.target.checked)}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              <span className="text-xs sm:text-sm font-semibold text-[#17211F]">
                Standard Weekdays (Sunday — Thursday, 9 AM to 6 PM)
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={weekends}
                onChange={(e) => setWeekends(e.target.checked)}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              <span className="text-xs sm:text-sm font-semibold text-[#17211F]">
                Weekends (Friday & Saturday)
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={evenings}
                onChange={(e) => setEvenings(e.target.checked)}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              <span className="text-xs sm:text-sm font-semibold text-[#17211F]">
                Evening Hours (6 PM to 10 PM)
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E3EAE7] flex items-center justify-end">
          <Button variant="primary" size="md" onClick={handleSave} isLoading={saving}>
            Save Availability
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
