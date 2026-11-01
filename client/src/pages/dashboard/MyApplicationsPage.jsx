import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loader';
import { Send, MapPin, Calendar, FileCheck2, ArrowRight } from 'lucide-react';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await jobService.getMyApplications();
        setApplications(apps || []);
      } catch (err) {
        console.error('Failed to load my applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Track Progress
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          My Submitted Applications
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Track status of micro-jobs and local tasks you have applied for
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No applications submitted yet"
          description="Browse open local jobs in Dhaka, Chattogram, and your area to start applying."
          actionText="Find Local Work"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.job;
            const isAccepted = app.status === 'Accepted';

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4 hover:border-[#0F766E]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3EAE7]">
                  <div>
                    <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider">
                      {job?.category}
                    </span>
                    <h3 className="font-bold text-base text-[#17211F] font-display">
                      {job?.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isAccepted
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#64716D]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                    {job?.location}
                  </span>
                  <span>•</span>
                  <span>Proposed Rate: <strong>BDT {app.proposedPayment}</strong></span>
                  <span>•</span>
                  <span>Submitted on: {new Date(app.createdAt).toLocaleDateString('en-GB')}</span>
                </div>

                <p className="text-xs text-[#17211F] bg-[#F7F9F8] p-3 rounded-xl border border-[#E3EAE7] leading-relaxed">
                  "{app.introduction}"
                </p>

                <div className="flex items-center justify-between pt-2">
                  {isAccepted ? (
                    <Link to={`/dashboard/proofbox/${job?._id}`}>
                      <Button variant="lime" size="sm">
                        <FileCheck2 className="w-4 h-4 mr-1" />
                        Open Job ProofBox Studio
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Poster review in progress
                    </span>
                  )}

                  <Link to={`/jobs/${job?._id}`} className="text-xs font-bold text-[#0F766E] hover:underline">
                    View Job Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
