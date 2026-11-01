import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import { CardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Search, Filter, SlidersHorizontal, MapPin, X, RotateCcw } from 'lucide-react';

const categories = [
  'All',
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
  'Delivery and Errands'
];

const locations = [
  'All',
  'Dhaka',
  'Dhaka - Dhanmondi',
  'Dhaka - Gulshan',
  'Dhaka - Banani',
  'Dhaka - Uttara',
  'Dhaka - Mirpur',
  'Chattogram',
  'Chattogram - Agrabad',
  'Sylhet',
  'Rajshahi',
  'Khulna'
];

const FindWorkPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [urgency, setUrgency] = useState(searchParams.get('urgency') || 'All');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state to URL and fetch
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (category && category !== 'All') params.category = category;
      if (location && location !== 'All') params.location = location;
      if (urgency && urgency !== 'All') params.urgency = urgency;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      if (sort) params.sort = sort;

      const data = await jobService.getJobs(params);
      setJobs(data.jobs || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, location, urgency, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All');
    setLocation('All');
    setUrgency('All');
    setMinBudget('');
    setMaxBudget('');
    setSort('newest');
    setSearchParams({});
    setTimeout(fetchJobs, 10);
  };

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Micro-Work Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display mt-1">
            Find Local Work Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D] mt-1">
            Browse verified short-term jobs and micro-tasks across Bangladesh
          </p>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E3EAE7] shadow-soft mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search job title, skills (e.g. AC Repair, Cleaning)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3EAE7] text-xs sm:text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" variant="primary" size="md" className="shrink-0">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleResetFilters}
                title="Reset all filters"
                className="shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Main Grid: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-3 bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3EAE7]">
              <h3 className="font-bold text-sm text-[#17211F] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F766E]" />
                Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#0F766E] hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
                Location Area
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none focus:border-[#0F766E]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
                Urgency Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Urgent', 'Normal'].map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgency(urg)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      urgency === urg
                        ? 'bg-[#0F766E] text-white border-[#0F766E]'
                        : 'bg-gray-50 border-[#E3EAE7] text-[#64716D] hover:bg-gray-100'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
                Budget (BDT)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
                />
              </div>
              <Button variant="secondary" size="sm" onClick={fetchJobs} className="w-full mt-1">
                Apply Budget
              </Button>
            </div>
          </aside>

          {/* Results Column */}
          <div className="md:col-span-9 space-y-4">
            {/* Results header / Sort */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#E3EAE7]">
              <span className="text-xs font-bold text-[#17211F]">
                Showing {totalCount} {totalCount === 1 ? 'Opportunity' : 'Opportunities'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64716D] hidden sm:inline">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-xs font-semibold bg-gray-50 border border-[#E3EAE7] rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="budget_high">Budget: High to Low</option>
                  <option value="budget_low">Budget: Low to High</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Job Grid / Loading / Empty */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                title="No jobs found matching your filters"
                description="Try clearing your budget or category filters to explore more community opportunities."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWorkPage;
