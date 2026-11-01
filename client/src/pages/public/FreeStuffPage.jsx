import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { freeItemService } from '../../services/freeItemService';
import FreeItemCard from '../../components/free-items/FreeItemCard';
import { CardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Gift, Search, RotateCcw } from 'lucide-react';

const categories = [
  'All',
  'Furniture',
  'Books & Study Materials',
  'Clothing',
  'Kitchen & Household',
  'Electronics',
  'Toys & Baby Items',
  'Other Free Items'
];

const FreeStuffPage = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (category && category !== 'All') params.category = category;

      const data = await freeItemService.getFreeItems(params);
      setItems(data.items || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to load free items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('All');
    setTimeout(fetchItems, 10);
  };

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5" />
            100% Free Community Exchange
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display">
            Free Stuff & Community Giveaways
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D] mt-1">
            Give away or collect useful textbooks, appliances, and home goods with zero transaction fees
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-soft mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search free items (e.g. Study table, Books, Microwave)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-100 bg-white focus:outline-none focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <Button type="submit" variant="primary" size="md" className="bg-emerald-700 hover:bg-emerald-800">
                Search
              </Button>
              <Button type="button" variant="ghost" size="md" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-emerald-900">
            {totalCount} Free {totalCount === 1 ? 'Item' : 'Items'} Listed in Your Area
          </span>
        </div>

        {/* Free Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No free items found"
            description="Check back soon or be the first to share an item with your local community!"
            actionText="Reset Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <FreeItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeStuffPage;
