import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { serviceService } from '../../services/serviceService';
import { productService } from '../../services/productService';
import { freeItemService } from '../../services/freeItemService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loader';
import {
  FileText,
  Briefcase,
  Wrench,
  ShoppingBag,
  Gift,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';

const MyPostsPage = () => {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'services' | 'products' | 'freeItems'

  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [freeItems, setFreeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [j, s, p, f] = await Promise.all([
        jobService.getMyPostedJobs().catch(() => []),
        serviceService.getMyServices().catch(() => []),
        productService.getMyProducts().catch(() => []),
        freeItemService.getMyFreeItems().catch(() => [])
      ]);
      setJobs(j || []);
      setServices(s || []);
      setProducts(p || []);
      setFreeItems(f || []);
    } catch (err) {
      console.error('Failed to load user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    await jobService.deleteJob(id);
    setJobs(jobs.filter(j => j._id !== id));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    await productService.deleteProduct(id);
    setProducts(products.filter(p => p._id !== id));
  };

  const handleUpdateProductStatus = async (id, status) => {
    await productService.updateProductStatus(id, status);
    fetchAll();
  };

  const handleUpdateFreeItemStatus = async (id, status) => {
    await freeItemService.updateFreeItemStatus(id, status);
    fetchAll();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Listings Management
          </span>
          <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
            My Posted Listings
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D]">
            Manage all your active jobs, services, products, and giveaways
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'jobs' && (
            <Link to="/dashboard/create-job">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1" />
                Post a Job
              </Button>
            </Link>
          )}
          {activeTab === 'services' && (
            <Link to="/dashboard/create-service">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1" />
                Offer a Service
              </Button>
            </Link>
          )}
          {activeTab === 'products' && (
            <Link to="/dashboard/create-product">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1" />
                Sell an Item
              </Button>
            </Link>
          )}
          {activeTab === 'freeItems' && (
            <Link to="/dashboard/create-free-item">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1" />
                Give Away Item
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#E3EAE7] shadow-soft overflow-x-auto">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'jobs' ? 'bg-[#0F766E] text-white' : 'text-[#64716D] hover:text-[#17211F]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Jobs ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'services' ? 'bg-[#0F766E] text-white' : 'text-[#64716D] hover:text-[#17211F]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'products' ? 'bg-[#0F766E] text-white' : 'text-[#64716D] hover:text-[#17211F]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('freeItems')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'freeItems' ? 'bg-[#0F766E] text-white' : 'text-[#64716D] hover:text-[#17211F]'
          }`}
        >
          <Gift className="w-4 h-4" />
          Free Stuff ({freeItems.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No jobs posted yet"
                actionText="Post Your First Job"
                onAction={() => window.location.href = '/dashboard/create-job'}
              />
            ) : (
              jobs.map(job => (
                <div key={job._id} className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#0F766E] uppercase">{job.category}</span>
                    <Link to={`/jobs/${job._id}`} className="block">
                      <h3 className="font-bold text-sm sm:text-base text-[#17211F] hover:text-[#0F766E] truncate">
                        {job.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-[#64716D] mt-1">
                      <span>BDT {job.budget}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.applicationsCount || 0} Applicants</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/dashboard/received-applications?jobId=${job._id}`}>
                      <Button variant="secondary" size="sm">
                        Applications
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            services.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title="No services listed yet"
                actionText="Offer a Service"
                onAction={() => window.location.href = '/dashboard/create-service'}
              />
            ) : (
              services.map(svc => (
                <div key={svc._id} className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#0F766E] uppercase">{svc.category}</span>
                    <Link to={`/services/${svc._id}`} className="block">
                      <h3 className="font-bold text-sm sm:text-base text-[#17211F] hover:text-[#0F766E] truncate">
                        {svc.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-[#64716D] mt-1">
                      <span>From BDT {svc.startingPrice}</span>
                      <span>•</span>
                      <span>{svc.pricingModel}</span>
                      <span>•</span>
                      <span>{svc.location}</span>
                    </div>
                  </div>

                  <Link to={`/services/${svc._id}`}>
                    <Button variant="outline" size="sm">
                      View Service
                    </Button>
                  </Link>
                </div>
              ))
            )
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            products.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No products listed"
                actionText="Sell an Item"
                onAction={() => window.location.href = '/dashboard/create-product'}
              />
            ) : (
              products.map(prod => (
                <div key={prod._id} className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#0F766E] uppercase">{prod.category}</span>
                      <span className="text-[10px] bg-gray-100 font-bold px-1.5 py-0.5 rounded">{prod.condition}</span>
                    </div>
                    <Link to={`/marketplace/${prod._id}`} className="block">
                      <h3 className="font-bold text-sm sm:text-base text-[#17211F] hover:text-[#0F766E] truncate">
                        {prod.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-[#64716D] mt-1">
                      <span className="font-bold text-[#0F766E]">BDT {prod.price}</span>
                      <span>•</span>
                      <span>Status: {prod.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {prod.status === 'Available' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProductStatus(prod._id, 'Sold')}
                      >
                        Mark as Sold
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpdateProductStatus(prod._id, 'Available')}
                      >
                        Re-list
                      </Button>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* Free Items Tab */}
          {activeTab === 'freeItems' && (
            freeItems.length === 0 ? (
              <EmptyState
                icon={Gift}
                title="No free items offered"
                actionText="Give Away Something"
                onAction={() => window.location.href = '/dashboard/create-free-item'}
              />
            ) : (
              freeItems.map(item => (
                <div key={item._id} className="bg-white p-5 rounded-2xl border-2 border-emerald-100 shadow-soft flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-emerald-700 uppercase">100% Free • {item.category}</span>
                    <Link to={`/free-stuff/${item._id}`} className="block">
                      <h3 className="font-bold text-sm sm:text-base text-[#17211F] hover:text-emerald-700 truncate">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-[#64716D] mt-1">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{item.requests?.length || 0} Request(s)</span>
                      <span>•</span>
                      <span>Status: {item.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'Available' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateFreeItemStatus(item._id, 'Collected')}
                      >
                        Mark as Collected
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        Collected
                      </span>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
