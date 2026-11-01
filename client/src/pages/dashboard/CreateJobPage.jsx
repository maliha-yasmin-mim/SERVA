import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Briefcase, MapPin, Calendar, DollarSign, Clock, Users, PlusCircle, AlertCircle } from 'lucide-react';

const categories = [
  'Cleaning',
  'Gardening',
  'Moving and Shifting',
  'Plumbing',
  'Electrical Work',
  'Repairs and Maintenance',
  'Car Wash',
  'Construction and Labour',
  'Tutoring',
  'Photography and Events',
  'Delivery and Errands',
  'Other Local Jobs'
];

const locations = [
  'Dhaka - Dhanmondi',
  'Dhaka - Gulshan',
  'Dhaka - Banani',
  'Dhaka - Uttara',
  'Dhaka - Mirpur',
  'Dhaka - Mohammadpur',
  'Chattogram - Agrabad',
  'Sylhet - Zindabazar',
  'Rajshahi - Shaheb Bazar',
  'Khulna - Sonadanga'
];

const CreateJobPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState(locations[0]);
  const [budget, setBudget] = useState('');
  const [paymentType, setPaymentType] = useState('Fixed');
  const [workDate, setWorkDate] = useState('Flexible');
  const [startTime, setStartTime] = useState('Morning');
  const [expectedDuration, setExpectedDuration] = useState('1-2 Days');
  const [workersNeeded, setWorkersNeeded] = useState(1);
  const [skills, setSkills] = useState('');
  const [requirements, setRequirements] = useState('');
  const [urgency, setUrgency] = useState('Normal');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !budget) {
      setError('Please fill in title, description, and budget');
      return;
    }

    setSubmitting(true);
    try {
      const job = await jobService.createJob({
        title,
        description,
        category,
        location,
        budget: Number(budget),
        paymentType,
        workDate,
        startTime,
        expectedDuration,
        workersNeeded: Number(workersNeeded),
        requiredSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
        requirements: requirements.split('\n').map(s => s.trim()).filter(Boolean),
        urgency
      });
      navigate(`/jobs/${job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          New Listing
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Post a Local Job Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Hire verified help for short-term tasks. Every job comes with SERVA ProofBox™ accountability.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
        <Input
          label="Job Title *"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 3-Room Apartment Deep Cleaning & Window Grill Wipe"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Job Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Location Area *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
            >
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
            Detailed Description *
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain the scope of work, conditions on site, and specific outcomes expected..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Budget (BDT) *"
            type="number"
            required
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 3000"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Payment Model
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
            >
              <option value="Fixed">Fixed Amount</option>
              <option value="Hourly">Hourly Rate</option>
              <option value="Negotiable">Negotiable</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Low">Flexible</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Work Date / Schedule"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            placeholder="e.g. Tomorrow, 9 AM"
          />
          <Input
            label="Expected Duration"
            value={expectedDuration}
            onChange={(e) => setExpectedDuration(e.target.value)}
            placeholder="e.g. 4 Hours"
          />
          <Input
            label="Workers Needed"
            type="number"
            min={1}
            value={workersNeeded}
            onChange={(e) => setWorkersNeeded(e.target.value)}
          />
        </div>

        <Input
          label="Required Skills (Comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. Deep Cleaning, Tile Polishing, Chemical Safety"
        />

        <div>
          <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
            Task Checklist Requirements (One per line)
          </label>
          <textarea
            rows={3}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="e.g.&#10;Scrub tiles without scratching&#10;Wipe down window grills&#10;Sanitize bathroom chrome"
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
          />
          <p className="text-[11px] text-[#64716D] mt-1">
            These tasks will automatically form the SERVA ProofBox checklist for your assigned worker.
          </p>
        </div>

        <div className="pt-4 border-t border-[#E3EAE7] flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
            Publish Job Listing
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPage;
