import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../../components/marketplace/ProductCard';
import { CardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Search, RotateCcw } from 'lucide-react';

const categories = [
  'All',
  'Electronics & Gadgets',
  'Home & Furniture',
  'Tools & Hardware',
  'Books & Stationery',
  'Clothing & Fashion',
  'Sports & Fitness',
  'Vehicles & Bicycles',
  'Other'
];

const conditions = ['All', 'Brand New', 'Like New', 'Gently Used', 'Fair Condition'];

const MarketplacePage = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState('All');
  const [sort, setSort] = useState('newest');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (category && category !== 'All') params.category = category;
      if (condition && condition !== 'All') params.condition = condition;
      if (sort) params.sort = sort;

      const data = await productService.getProducts(params);
      setProducts(data.products || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, condition, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('All');
    setCondition('All');
    setSort('newest');
    setTimeout(fetchProducts, 10);
  };

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Circular Economy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display mt-1">
            Buy & Sell Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D] mt-1">
            Verified local second-hand items, electronics, furniture, and tools in Bangladesh
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E3EAE7] shadow-soft mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products (e.g. Bosch Drill, Ergonomic Chair)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3EAE7] text-xs sm:text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <Button type="submit" variant="primary" size="md">
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
          <span className="text-xs font-bold text-[#17211F]">
            Showing {totalCount} {totalCount === 1 ? 'Product' : 'Products'} Available
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64716D]">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#E3EAE7] rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No items found"
            description="Try adjusting your category or condition filters to see more listings."
            actionText="Reset Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
