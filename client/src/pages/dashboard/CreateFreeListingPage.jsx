import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { freeItemService } from '../../services/freeItemService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Gift, AlertCircle } from 'lucide-react';

const categories = [
  'Furniture',
  'Books & Study Materials',
  'Clothing',
  'Kitchen & Household',
  'Electronics',
  'Toys & Baby Items',
  'Other Free Items'
];

const CreateFreeListingPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [condition, setCondition] = useState('Good');
  const [location, setLocation] = useState('Dhaka - Dhanmondi');
  const [pickupInstructions, setPickupInstructions] = useState('Self pickup required by collector');
  const [imageUrl, setImageUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Please provide title and description');
      return;
    }

    setSubmitting(true);
    try {
      const item = await freeItemService.createFreeItem({
        title,
        description,
        category,
        condition,
        location,
        pickupInstructions,
        images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80']
      });
      navigate(`/free-stuff/${item._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list free item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
          <Gift className="w-3.5 h-3.5" />
          Community Giveaway
        </div>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display">
          Give Away an Item for Free
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Pass on textbooks, furniture, or home goods to someone in your neighborhood
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-100 shadow-soft space-y-5">
        <Input
          label="Item Title *"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Solid Wood 2-Tier Coffee Table (Free Pickup)"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-100 bg-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-100 bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs TLC">Needs TLC</option>
            </select>
          </div>
        </div>

        <Input
          label="Location *"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Dhaka - Mirpur 10"
        />

        <Input
          label="Pickup Instructions *"
          required
          value={pickupInstructions}
          onChange={(e) => setPickupInstructions(e.target.value)}
          placeholder="e.g. Ground floor pickup. Friday afternoon preferred."
        />

        <div>
          <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
            Item Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item, dimensions, and any marks or history..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-emerald-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="pt-4 border-t border-emerald-100 flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={submitting} className="bg-emerald-700 hover:bg-emerald-800">
            Publish Free Listing
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFreeListingPage;
