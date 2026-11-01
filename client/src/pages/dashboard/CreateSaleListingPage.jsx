import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { ShoppingBag, AlertCircle } from 'lucide-react';

const categories = [
  'Electronics & Gadgets',
  'Home & Furniture',
  'Tools & Hardware',
  'Books & Stationery',
  'Clothing & Fashion',
  'Sports & Fitness',
  'Vehicles & Bicycles',
  'Other'
];

const conditions = ['Brand New', 'Like New', 'Gently Used', 'Fair Condition'];

const CreateSaleListingPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState(conditions[1]);
  const [location, setLocation] = useState('Dhaka - Dhanmondi');
  const [imageUrl, setImageUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !price) {
      setError('Please provide title, description and price');
      return;
    }

    setSubmitting(true);
    try {
      const product = await productService.createProduct({
        title,
        description,
        category,
        price: Number(price),
        condition,
        location,
        images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80']
      });
      navigate(`/marketplace/${product._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Marketplace
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Sell a Second-Hand Item
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          List your electronics, tools, or furniture for sale in your local area
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-5">
        <Input
          label="Item Title *"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Bosch Hammer Drill 18V with Extra Battery"
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
            >
              {conditions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Selling Price (BDT) *"
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 4500"
          />

          <Input
            label="Location *"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Dhaka - Banani"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
            Detailed Item Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mention usage history, reason for selling, accessories included, and condition details..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <Input
          label="Photo Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://... (or leave empty for development placeholder photo)"
        />

        <div className="pt-4 border-t border-[#E3EAE7] flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
            List Item for Sale
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSaleListingPage;
