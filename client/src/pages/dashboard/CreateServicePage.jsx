import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Wrench, Plus, Trash2, AlertCircle } from 'lucide-react';

const categories = [
  'Cleaning',
  'Gardening',
  'Repairs and Maintenance',
  'Plumbing',
  'Electrical Work',
  'Moving and Shifting',
  'Tutoring',
  'Photography and Events',
  'Car Wash',
  'Computer & Tech Support',
  'Other Services'
];

const CreateServicePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [startingPrice, setStartingPrice] = useState('');
  const [pricingModel, setPricingModel] = useState('Hourly');
  const [location, setLocation] = useState('Dhaka - Dhanmondi');
  const [availability, setAvailability] = useState('Mon - Sat (9 AM - 7 PM)');
  const [skills, setSkills] = useState('');

  // Packages builder
  const [packages, setPackages] = useState([
    {
      name: 'Standard Package',
      description: 'Comprehensive primary service delivery',
      price: '',
      deliveryTime: '1 Day',
      features: 'Full diagnostic check, Standard labor, Safety inspection'
    }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddPackage = () => {
    setPackages([
      ...packages,
      {
        name: 'Premium Tier',
        description: 'Deep comprehensive service package',
        price: '',
        deliveryTime: 'Same Day',
        features: 'Priority scheduling, Advanced materials, Extended warranty'
      }
    ]);
  };

  const handleRemovePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handlePackageChange = (index, field, value) => {
    const updated = [...packages];
    updated[index][field] = value;
    setPackages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !startingPrice) {
      setError('Please provide title, description, and starting price');
      return;
    }

    setSubmitting(true);
    try {
      const formattedPackages = packages.map(p => ({
        name: p.name,
        description: p.description,
        price: Number(p.price || startingPrice),
        deliveryTime: p.deliveryTime,
        features: typeof p.features === 'string' ? p.features.split(',').map(f => f.trim()) : p.features
      }));

      const service = await serviceService.createService({
        title,
        description,
        category,
        startingPrice: Number(startingPrice),
        pricingModel,
        location,
        availability,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        packages: formattedPackages
      });

      navigate(`/services/${service._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Offer a Skill
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Advertise Your Service
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Create a service offering with tiered packages to receive client quote requests
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
          label="Service Title *"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Master Electrician & AC Servicing Diagnostics"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Category *
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

          <Input
            label="Service Coverage Area *"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Dhaka - Dhanmondi, Banani"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
            Description of Service & Guarantees *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your trade background, tools, approach, and service guarantees..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Starting Price (BDT) *"
            type="number"
            required
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="e.g. 500"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Pricing Model
            </label>
            <select
              value={pricingModel}
              onChange={(e) => setPricingModel(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
            >
              <option value="Hourly">Hourly</option>
              <option value="Fixed Package">Fixed Package</option>
              <option value="Per Job">Per Job</option>
              <option value="Custom Quote">Custom Quote</option>
            </select>
          </div>

          <Input
            label="Standard Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="e.g. Mon-Sat (9 AM - 7 PM)"
          />
        </div>

        {/* Defined Service Packages Builder */}
        <div className="pt-4 border-t border-[#E3EAE7] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#17211F]">
                Defined Service Packages
              </h3>
              <p className="text-xs text-[#64716D]">
                Allow clients to select clear service bundles
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddPackage}>
              <Plus className="w-3.5 h-3.5" />
              Add Tier
            </Button>
          </div>

          <div className="space-y-4">
            {packages.map((pkg, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F766E] uppercase">Package #{idx + 1}</span>
                  {packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePackage(idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Package Name"
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                  />
                  <Input
                    label="Package Price (BDT)"
                    type="number"
                    value={pkg.price}
                    onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                    placeholder={startingPrice || '600'}
                  />
                  <Input
                    label="Delivery Time"
                    value={pkg.deliveryTime}
                    onChange={(e) => handlePackageChange(idx, 'deliveryTime', e.target.value)}
                  />
                </div>

                <Input
                  label="Features (Comma separated)"
                  value={pkg.features}
                  onChange={(e) => handlePackageChange(idx, 'features', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#E3EAE7] flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
            Publish Service
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateServicePage;
