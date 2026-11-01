import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import ServiceCard from '../../components/services/ServiceCard';
import { CardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Search, Filter, MapPin, RotateCcw } from 'lucide-react';

const categories = [
  'All',
  'Cleaning',
  'Gardening',
  'Repairs and Maintenance',
  'Plumbing',
  'Electrical Work',
  'Moving and Shifting',
  'Tutoring',
  'Photography and Events',
  'Car Wash',
  'Computer & Tech Support'
];

const locations = [
  'All',
  'Dhaka',
  'Dhaka - Dhanmondi',
  'Dhaka - Banani',
  'Dhaka - Gulshan',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna'
];

const FindServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (category && category !== 'All') params.category = category;
      if (location && location !== 'All') params.location = location;
      if (sort) params.sort = sort;

      const data = await serviceService.getServices(params);
      setServices(data.services || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category, location, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('All');
    setLocation('All');
    setSort('rating');
    setTimeout(fetchServices, 10);
  };

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Verified Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display mt-1">
            Find Trusted Local Service Providers
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D] mt-1">
            Verified technicians, deep cleaners, tutors, and electricians ready to assist you
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E3EAE7] shadow-soft mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search services (e.g. Electrical wiring, House deep cleaning)..."
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-xs sm:text-sm p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
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
            Showing {totalCount} Verified {totalCount === 1 ? 'Service' : 'Services'}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64716D]">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#E3EAE7] rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Service Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            title="No services found"
            description="Try selecting another category or area to see more verified specialists."
            actionText="Reset Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindServicesPage;
